import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CATEGORIES,
  ORDER_LABELS,
  stockStatus,
  type Address,
  type ListingStatus,
  type OrderStatus,
} from "../shared/marketplace.ts";
import { hashPassword, newToken, verifyPassword } from "./auth.ts";
import { Store } from "./store.ts";
import type { Order, Product, User } from "./types.ts";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const IMAGE_DATA =
  /^data:image\/(png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=\s]+$/i;
const IMAGE_LOCAL = /^\/products\/[a-z0-9.-]+\.(jpg|jpeg|png|webp|gif|svg)$/i;

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type AuthedRequest = Request & { user?: User };

function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    shopName: user.shopName,
    sellerStatus: user.sellerStatus,
    suspended: user.suspended,
    address: user.address,
    createdAt: user.createdAt,
  };
}

function cents(value: number): number {
  return Math.round(value * 100) / 100;
}

function asText(value: unknown, label: string, min: number, max: number): string {
  if (typeof value !== "string") throw new HttpError(400, `${label} is required.`);
  const text = value.trim().replace(/\u0000/g, "");
  if (text.length < min || text.length > max) {
    throw new HttpError(400, `${label} must be ${min}–${max} characters.`);
  }
  return text;
}

function asAddress(value: unknown): Address {
  if (!value || typeof value !== "object") throw new HttpError(400, "A shipping address is required.");
  const body = value as Record<string, unknown>;
  return {
    recipient: asText(body.recipient, "Recipient", 2, 80),
    line1: asText(body.line1, "Address", 4, 120),
    city: asText(body.city, "City", 2, 60),
    region: asText(body.region, "Region", 1, 60),
    postal: asText(body.postal, "Postal code", 2, 16),
    country: asText(body.country, "Country", 2, 60),
  };
}

function asImage(value: unknown): string {
  if (typeof value !== "string") throw new HttpError(400, "A product image is required.");
  const image = value.trim();
  if (image.length > 1_800_000) throw new HttpError(400, "Product image must be under 1.4 MB.");
  if (!IMAGE_DATA.test(image) && !IMAGE_LOCAL.test(image)) {
    throw new HttpError(400, "Use a PNG, JPEG, WEBP, or GIF image.");
  }
  return image;
}

function asPrice(value: unknown): number {
  const price = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(price) || price < 0.5 || price > 100_000) {
    throw new HttpError(400, "Price must be between $0.50 and $100,000.");
  }
  return cents(price);
}

function asQuantity(value: unknown): number {
  const quantity = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 9999) {
    throw new HttpError(400, "Quantity must be a whole number from 0 to 9999.");
  }
  return quantity;
}

function route(fn: (req: AuthedRequest, res: Response) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req as AuthedRequest, res);
    } catch (error) {
      next(error);
    }
  };
}

export function createApp(options?: { dataFile?: string; seed?: boolean }) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const dataFile =
    options?.dataFile ?? path.resolve(here, "../data/market.json");
  const store = new Store(dataFile, options?.seed !== false);
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  function currentUser(req: Request): User | null {
    const token = req.cookies?.shopit_session;
    if (typeof token !== "string" || !token) return null;
    const session = store.db.sessions.find((item) => item.token === token);
    if (!session) return null;
    if (Date.now() - new Date(session.createdAt).getTime() > SESSION_MS) return null;
    const user = store.db.users.find((item) => item.id === session.userId);
    if (!user || user.suspended) return null;
    return user;
  }

  function attach(req: AuthedRequest, _res: Response, next: NextFunction) {
    const user = currentUser(req);
    if (user) req.user = user;
    next();
  }

  app.use(attach);

  function requireUser(req: AuthedRequest): User {
    if (!req.user) throw new HttpError(401, "Sign in to continue.");
    return req.user;
  }

  function deny(user: User, allowed: Array<User["role"]>): never {
    if (allowed.includes("admin") && user.role === "seller") {
      throw new HttpError(403, "Sellers cannot approve platform administrators.");
    }
    if (allowed.includes("admin") && user.role === "buyer") {
      throw new HttpError(403, "Buyers cannot manage platform users.");
    }
    if (allowed.includes("seller") && user.role === "buyer") {
      throw new HttpError(403, "Buyers cannot manage inventory.");
    }
    if (allowed.includes("seller") && user.role === "admin") {
      throw new HttpError(403, "Platform administrators monitor the marketplace and do not act as sellers.");
    }
    if (allowed.includes("buyer") && user.role === "admin") {
      throw new HttpError(403, "Platform administrators monitor transactions and do not act as buyers.");
    }
    if (allowed.includes("buyer") && user.role === "seller") {
      throw new HttpError(403, "Sellers use the seller desk and do not purchase from this account.");
    }
    throw new HttpError(403, "You do not have access to that desk.");
  }

  function requireRole(req: AuthedRequest, roles: Array<User["role"]>): User {
    const user = requireUser(req);
    if (!roles.includes(user.role)) deny(user, roles);
    return user;
  }

  function approvedSeller(user: User): void {
    if (user.role !== "seller" || user.sellerStatus !== "approved") {
      throw new HttpError(403, "Your seller application is still waiting for approval.");
    }
  }

  function log(db: { activities: Store["db"]["activities"] }, entry: Omit<Store["db"]["activities"][number], "id" | "at"> & { at?: string }) {
    db.activities.push({
      id: `a_${newToken().slice(0, 8)}`,
      at: entry.at ?? new Date().toISOString(),
      type: entry.type,
      message: entry.message,
      actorName: entry.actorName,
      orderId: entry.orderId,
    });
    if (db.activities.length > 500) db.activities.splice(0, db.activities.length - 500);
  }

  function sellerOf(sellerId: string) {
    return store.db.users.find((user) => user.id === sellerId);
  }

  function presentProduct(product: Product, includeListing: boolean) {
    const seller = sellerOf(product.sellerId);
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      stockStatus: stockStatus(product.quantity),
      image: product.image,
      sellerId: product.sellerId,
      sellerName: seller?.name ?? "Seller",
      shopName: seller?.shopName ?? "Independent seller",
      listingStatus: includeListing ? product.listingStatus : "active",
      updatedAt: product.updatedAt,
    };
  }

  function readProductInput(body: Record<string, unknown>, imageRequired: boolean) {
    const name = asText(body.name, "Product name", 2, 80);
    const category = asText(body.category, "Category", 2, 40);
    if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      throw new HttpError(400, "Choose a category from the list.");
    }
    const description = asText(body.description, "Description", 10, 800);
    const price = asPrice(body.price);
    const quantity = asQuantity(body.quantity);
    const listingStatus = body.listingStatus === "hidden" ? "hidden" : "active";
    if (body.listingStatus && body.listingStatus !== "active" && body.listingStatus !== "hidden") {
      throw new HttpError(400, "Listing status must be Active or Hidden.");
    }
    let image: string | undefined;
    if (body.image) image = asImage(body.image);
    else if (imageRequired) throw new HttpError(400, "A product image is required.");
    return { name, category, description, price, quantity, listingStatus: listingStatus as ListingStatus, image };
  }

  function presentOrder(order: Order) {
    return order;
  }

  function findOrder(id: string): Order {
    const order = store.db.orders.find((item) => item.id === id);
    if (!order) throw new HttpError(404, "Order not found.");
    return order;
  }

  function canSeeOrder(user: User, order: Order): boolean {
    if (user.role === "admin") return true;
    if (user.role === "buyer") return order.buyer.id === user.id;
    if (user.role === "seller") return order.seller.id === user.id;
    return false;
  }

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, name: "shop it.com" });
  });

  app.post(
    "/api/auth/register",
    route((req, res) => {
      const name = asText(req.body?.name, "Name", 2, 60);
      const email = asText(req.body?.email, "Email", 6, 120).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Enter a valid email.");
      const password = asText(req.body?.password, "Password", 8, 80);
      const role = req.body?.role === "seller" ? "seller" : "buyer";
      if (req.body?.role === "admin") {
        throw new HttpError(403, "Platform administrators cannot be approved from registration.");
      }
      const shopName =
        role === "seller" ? asText(req.body?.shopName || `${name}'s shop`, "Shop name", 2, 60) : null;
      const address = req.body?.address ? asAddress(req.body.address) : null;
      let createdUser!: User;
      let token = "";
      store.update((db) => {
        if (db.users.some((user) => user.email === email)) {
          throw new HttpError(400, "An account with that email already exists.");
        }
        createdUser = {
          id: `u_${newToken().slice(0, 8)}`,
          name,
          email,
          ...hashPassword(password),
          role,
          shopName,
          sellerStatus: role === "seller" ? "pending" : null,
          suspended: false,
          address,
          createdAt: new Date().toISOString(),
        };
        db.users.push(createdUser);
        token = newToken();
        db.sessions.push({ token, userId: createdUser.id, createdAt: new Date().toISOString() });
        log(db, {
          type: role === "seller" ? "seller_applied" : "user_registered",
          message:
            role === "seller"
              ? `${name} applied to sell as ${shopName} and is waiting for approval.`
              : `${name} registered as a buyer.`,
          actorName: name,
        });
      });
      res.cookie("shopit_session", token, cookieOptions());
      res.status(201).json({ user: publicUser(createdUser) });
    }),
  );

  app.post(
    "/api/auth/login",
    route((req, res) => {
      const email = asText(req.body?.email, "Email", 6, 120).toLowerCase();
      const password = asText(req.body?.password, "Password", 8, 80);
      const user = store.db.users.find((item) => item.email === email);
      if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
        throw new HttpError(401, "Email or password does not match.");
      }
      if (user.suspended) throw new HttpError(403, "This account is suspended.");
      const token = newToken();
      store.update((db) => {
        db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
      });
      res.cookie("shopit_session", token, cookieOptions());
      res.json({ user: publicUser(user) });
    }),
  );

  app.post(
    "/api/auth/logout",
    route((req, res) => {
      const token = req.cookies?.shopit_session;
      if (typeof token === "string") {
        store.update((db) => {
          db.sessions = db.sessions.filter((session) => session.token !== token);
        });
      }
      res.clearCookie("shopit_session", { path: "/" });
      res.json({ ok: true });
    }),
  );

  app.get(
    "/api/auth/me",
    route((req, res) => {
      res.json({ user: req.user ? publicUser(req.user) : null });
    }),
  );

  app.get(
    "/api/products",
    route((req, res) => {
      const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase().slice(0, 80) : "";
      const category = typeof req.query.category === "string" ? req.query.category : "";
      const products = store.db.products
        .filter((product) => product.listingStatus === "active")
        .filter((product) => (category ? product.category === category : true))
        .filter((product) =>
          q
            ? `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(q)
            : true,
        )
        .map((product) => presentProduct(product, false));
      res.json({ products, categories: CATEGORIES });
    }),
  );

  app.get(
    "/api/products/:id",
    route((req, res) => {
      const product = store.db.products.find((item) => item.id === req.params.id);
      if (!product || product.listingStatus !== "active") throw new HttpError(404, "Product not found.");
      res.json({ product: presentProduct(product, false) });
    }),
  );

  app.get(
    "/api/seller/products",
    route((req, res) => {
      const user = requireRole(req, ["seller"]);
      const products = store.db.products
        .filter((product) => product.sellerId === user.id)
        .map((product) => presentProduct(product, true));
      res.json({ products, sellerStatus: user.sellerStatus, shopName: user.shopName });
    }),
  );

  app.get(
    "/api/seller/products/:id",
    route((req, res) => {
      const user = requireRole(req, ["seller"]);
      const product = store.db.products.find((item) => item.id === req.params.id && item.sellerId === user.id);
      if (!product) throw new HttpError(404, "Product not found.");
      res.json({ product: presentProduct(product, true) });
    }),
  );

  app.post(
    "/api/seller/products",
    route((req, res) => {
      const user = requireRole(req, ["seller"]);
      approvedSeller(user);
      const input = readProductInput(req.body ?? {}, true);
      let created!: Product;
      store.update((db) => {
        created = {
          id: `p_${newToken().slice(0, 8)}`,
          sellerId: user.id,
          name: input.name,
          category: input.category,
          description: input.description,
          price: input.price,
          quantity: input.quantity,
          image: input.image!,
          listingStatus: input.listingStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.products.push(created);
        log(db, {
          type: "product_listed",
          message: `${user.name} listed ${created.name}.`,
          actorName: user.name,
        });
      });
      res.status(201).json({ product: presentProduct(created, true) });
    }),
  );

  app.patch(
    "/api/seller/products/:id",
    route((req, res) => {
      const user = requireRole(req, ["seller"]);
      approvedSeller(user);
      const input = readProductInput({ ...req.body, image: req.body?.image || undefined }, false);
      let updated!: Product;
      store.update((db) => {
        const product = db.products.find((item) => item.id === req.params.id && item.sellerId === user.id);
        if (!product) throw new HttpError(404, "Product not found.");
        if (product.listingStatus === "removed") {
          throw new HttpError(400, "Removed listings stay in the record and cannot be edited.");
        }
        product.name = input.name;
        product.category = input.category;
        product.description = input.description;
        product.price = input.price;
        product.quantity = input.quantity;
        product.listingStatus = input.listingStatus;
        if (input.image) product.image = input.image;
        product.updatedAt = new Date().toISOString();
        updated = product;
        log(db, {
          type: "product_updated",
          message: `${user.name} updated ${product.name}.`,
          actorName: user.name,
        });
      });
      res.json({ product: presentProduct(updated, true) });
    }),
  );

  app.patch(
    "/api/seller/products/:id/quantity",
    route((req, res) => {
      const user = requireRole(req, ["seller"]);
      approvedSeller(user);
      const quantity = asQuantity(req.body?.quantity);
      let updated!: Product;
      store.update((db) => {
        const product = db.products.find((item) => item.id === req.params.id && item.sellerId === user.id);
        if (!product) throw new HttpError(404, "Product not found.");
        if (product.listingStatus === "removed") throw new HttpError(400, "Removed listings cannot be restocked.");
        product.quantity = quantity;
        product.updatedAt = new Date().toISOString();
        updated = product;
        log(db, {
          type: "inventory_quantity",
          message: `${user.name} set ${product.name} quantity to ${quantity}.`,
          actorName: user.name,
        });
      });
      res.json({ product: presentProduct(updated, true) });
    }),
  );

  app.post(
    "/api/seller/products/:id/visibility",
    route((req, res) => {
      const user = requireRole(req, ["seller"]);
      approvedSeller(user);
      const action = req.body?.action;
      if (action !== "hide" && action !== "unhide" && action !== "remove") {
        throw new HttpError(400, "Choose hide, unhide, or remove.");
      }
      let updated!: Product;
      store.update((db) => {
        const product = db.products.find((item) => item.id === req.params.id && item.sellerId === user.id);
        if (!product) throw new HttpError(404, "Product not found.");
        if (action === "remove") {
          product.listingStatus = "removed";
        } else if (action === "hide") {
          if (product.listingStatus === "removed") throw new HttpError(400, "Removed listings stay removed.");
          product.listingStatus = "hidden";
        } else {
          if (product.listingStatus === "removed") throw new HttpError(400, "Removed listings cannot return to the floor.");
          product.listingStatus = "active";
        }
        product.updatedAt = new Date().toISOString();
        updated = product;
        log(db, {
          type: `product_${action}`,
          message: `${user.name} ${action === "unhide" ? "listed" : action === "hide" ? "hid" : "removed"} ${product.name}.`,
          actorName: user.name,
        });
      });
      res.json({ product: presentProduct(updated, true) });
    }),
  );

  function enrichCart(userId: string) {
    const lines = store.db.carts[userId] ?? [];
    return lines.map((line) => {
      const product = store.db.products.find((item) => item.id === line.productId);
      const seller = product ? sellerOf(product.sellerId) : undefined;
      const purchasable = Boolean(
        product && product.listingStatus === "active" && product.quantity >= line.quantity && product.quantity > 0,
      );
      return {
        productId: line.productId,
        quantity: line.quantity,
        name: product?.name ?? "Unavailable product",
        image: product?.image ?? "",
        price: product?.price ?? 0,
        available: product?.quantity ?? 0,
        stockStatus: stockStatus(product?.quantity ?? 0),
        listingStatus: product?.listingStatus ?? "removed",
        sellerId: product?.sellerId ?? "",
        sellerName: seller?.name ?? "",
        shopName: seller?.shopName ?? "",
        lineTotal: cents((product?.price ?? 0) * line.quantity),
        purchasable,
      };
    });
  }

  app.get(
    "/api/cart",
    route((req, res) => {
      const user = requireRole(req, ["buyer"]);
      const items = enrichCart(user.id);
      const subtotal = cents(items.reduce((sum, item) => sum + item.lineTotal, 0));
      res.json({ items, subtotal });
    }),
  );

  app.post(
    "/api/cart",
    route((req, res) => {
      const user = requireRole(req, ["buyer"]);
      const productId = asText(req.body?.productId, "Product", 2, 40);
      const quantity = asQuantity(req.body?.quantity);
      if (quantity < 1) throw new HttpError(400, "Select a quantity of at least 1.");
      store.update((db) => {
        const product = db.products.find((item) => item.id === productId);
        if (!product || product.listingStatus !== "active") throw new HttpError(404, "Product not found.");
        const cart = db.carts[user.id] ?? [];
        const existing = cart.find((item) => item.productId === productId);
        const next = (existing?.quantity ?? 0) + quantity;
        if (product.quantity < 1) throw new HttpError(400, "That product is out of stock.");
        if (next > product.quantity) {
          throw new HttpError(400, `Only ${product.quantity} available.`);
        }
        if (existing) existing.quantity = next;
        else cart.push({ productId, quantity });
        db.carts[user.id] = cart;
      });
      const items = enrichCart(user.id);
      res.status(201).json({
        items,
        subtotal: cents(items.reduce((sum, item) => sum + item.lineTotal, 0)),
      });
    }),
  );

  app.put(
    "/api/cart",
    route((req, res) => {
      const user = requireRole(req, ["buyer"]);
      const productId = asText(req.body?.productId, "Product", 2, 40);
      const quantity = asQuantity(req.body?.quantity);
      store.update((db) => {
        const cart = db.carts[user.id] ?? [];
        const existing = cart.find((item) => item.productId === productId);
        if (!existing) throw new HttpError(404, "That item is not in the cart.");
        if (quantity === 0) {
          db.carts[user.id] = cart.filter((item) => item.productId !== productId);
          return;
        }
        const product = db.products.find((item) => item.id === productId);
        if (!product || product.listingStatus !== "active") throw new HttpError(400, "That product is no longer listed.");
        if (quantity > product.quantity) throw new HttpError(400, `Only ${product.quantity} available.`);
        existing.quantity = quantity;
      });
      const items = enrichCart(user.id);
      res.json({ items, subtotal: cents(items.reduce((sum, item) => sum + item.lineTotal, 0)) });
    }),
  );

  app.delete(
    "/api/cart/:productId",
    route((req, res) => {
      const user = requireRole(req, ["buyer"]);
      store.update((db) => {
        db.carts[user.id] = (db.carts[user.id] ?? []).filter((item) => item.productId !== req.params.productId);
      });
      const items = enrichCart(user.id);
      res.json({ items, subtotal: cents(items.reduce((sum, item) => sum + item.lineTotal, 0)) });
    }),
  );

  app.post(
    "/api/orders",
    route((req, res) => {
      const user = requireRole(req, ["buyer"]);
      if (req.body?.quantitiesConfirmed !== true) {
        throw new HttpError(400, "Confirm the quantities before submitting the order.");
      }
      const address = asAddress(req.body?.address);
      const rawItems = Array.isArray(req.body?.items) ? req.body.items : null;
      if (!rawItems?.length) throw new HttpError(400, "Review the cart and add a product before ordering.");
      if (rawItems.length > 30) throw new HttpError(400, "Split a very large cart into smaller orders.");
      const lines = rawItems.map((line: { productId?: unknown; quantity?: unknown }) => ({
        productId: asText(line?.productId, "Product", 2, 40),
        quantity: asQuantity(line?.quantity),
      }));
      if (lines.some((line: { quantity: number }) => line.quantity < 1)) {
        throw new HttpError(400, "Each confirmed quantity must be at least 1.");
      }

      const created: Order[] = [];
      store.update((db) => {
        const resolved: { product: Product; seller: User; quantity: number }[] = lines.map((line: { productId: string; quantity: number }) => {
          const product = db.products.find((item) => item.id === line.productId);
          if (!product || product.listingStatus !== "active") {
            throw new HttpError(400, "A selected product is no longer listed.");
          }
          if (line.quantity > product.quantity) {
            throw new HttpError(400, `Only ${product.quantity} of ${product.name} available.`);
          }
          const seller = db.users.find((item) => item.id === product.sellerId);
          if (!seller || seller.suspended || seller.sellerStatus !== "approved") {
            throw new HttpError(400, `${product.name} cannot be purchased right now.`);
          }
          return { product, seller, quantity: line.quantity };
        });

        const groups = new Map<string, typeof resolved>();
        for (const line of resolved) {
          const group = groups.get(line.seller.id) ?? [];
          group.push(line);
          groups.set(line.seller.id, group);
        }

        const now = new Date().toISOString();
        for (const group of groups.values()) {
          const seller = group[0].seller;
          for (const line of group) line.product.quantity -= line.quantity;
          const items = group.map((line) => ({
            productId: line.product.id,
            name: line.product.name,
            category: line.product.category,
            image: line.product.image,
            price: line.product.price,
            quantity: line.quantity,
          }));
          const total = cents(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
          const order: Order = {
            id: nextOrderId(db.orders),
            buyer: { id: user.id, name: user.name, email: user.email, address },
            seller: {
              id: seller.id,
              name: seller.name,
              email: seller.email,
              shopName: seller.shopName,
            },
            items,
            total,
            status: "waiting_payment",
            paymentStatus: "waiting",
            prepared: false,
            shipmentNote: "",
            address,
            createdAt: now,
            updatedAt: now,
            timeline: [
              {
                status: "waiting_payment",
                at: now,
                actorId: user.id,
                actorName: user.name,
                note: "Order submitted. Waiting for payment confirmation.",
              },
            ],
          };
          db.orders.push(order);
          created.push(order);
          log(db, {
            type: "order_placed",
            message: `${user.name} placed order ${order.id} with ${seller.shopName ?? seller.name}.`,
            actorName: user.name,
            orderId: order.id,
          });
        }

        const orderedIds = new Set(lines.map((line: { productId: string }) => line.productId));
        db.carts[user.id] = (db.carts[user.id] ?? []).filter((item) => !orderedIds.has(item.productId));
        const buyer = db.users.find((item) => item.id === user.id);
        if (buyer) buyer.address = address;
      });

      res.status(201).json({ orders: created.map(presentOrder) });
    }),
  );

  app.get(
    "/api/orders",
    route((req, res) => {
      const user = requireRole(req, ["buyer"]);
      const orders = store.db.orders
        .filter((order) => order.buyer.id === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      res.json({ orders });
    }),
  );

  app.get(
    "/api/seller/orders",
    route((req, res) => {
      const user = requireRole(req, ["seller"]);
      const orders = store.db.orders
        .filter((order) => order.seller.id === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      res.json({ orders });
    }),
  );

  app.get(
    "/api/seller/sales",
    route((req, res) => {
      const user = requireRole(req, ["seller"]);
      const orders = store.db.orders.filter((order) => order.seller.id === user.id);
      const paid = orders.filter((order) => order.paymentStatus === "received");
      const completed = orders.filter((order) => order.status === "completed");
      const units = (list: Order[]) => list.reduce((sum, order) => sum + order.items.reduce((inner, item) => inner + item.quantity, 0), 0);
      res.json({
        orders: orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        summary: {
          orderCount: orders.length,
          paidTotal: cents(paid.reduce((sum, order) => sum + order.total, 0)),
          completedTotal: cents(completed.reduce((sum, order) => sum + order.total, 0)),
          unitsSold: units(completed),
          openCount: orders.filter((order) => order.status !== "completed").length,
        },
      });
    }),
  );

  app.get(
    "/api/orders/:id",
    route((req, res) => {
      const user = requireUser(req);
      const order = findOrder(req.params.id);
      if (!canSeeOrder(user, order)) throw new HttpError(404, "Order not found.");
      res.json({ order: presentOrder(order), mode: user.role });
    }),
  );

  app.post(
    "/api/orders/:id/advance",
    route((req, res) => {
      const user = requireUser(req);
      if (user.role === "admin") {
        throw new HttpError(403, "Platform administrators monitor transactions and do not act as the buyer or seller.");
      }
      if (user.role !== "seller") {
        throw new HttpError(403, "Buyers cannot move seller fulfillment steps.");
      }
      approvedSeller(user);
      const action = req.body?.action;
      let updated!: Order;
      store.update((db) => {
        const order = db.orders.find((item) => item.id === req.params.id);
        if (!order || order.seller.id !== user.id) throw new HttpError(404, "Order not found.");
        const now = new Date().toISOString();
        if (action === "payment_received") {
          if (order.status !== "waiting_payment") throw new HttpError(409, "Payment was already confirmed.");
          order.status = "payment_confirmed";
          order.paymentStatus = "received";
          pushTimeline(order, "payment_confirmed", user, now, "Payment received.");
        } else if (action === "ready_to_ship") {
          if (order.status === "waiting_payment") {
            throw new HttpError(409, "Payment is still waiting. Confirm payment before moving the order to Ready to Ship.");
          }
          if (order.status !== "payment_confirmed") throw new HttpError(409, "This order is already past Ready to Ship.");
          order.status = "ready_to_ship";
          pushTimeline(order, "ready_to_ship", user, now, "Moved to Ready to Ship.");
        } else if (action === "prepare") {
          if (order.status !== "ready_to_ship") {
            throw new HttpError(409, "Move the order to Ready to Ship before preparing the product.");
          }
          if (order.prepared) throw new HttpError(409, "The product is already prepared.");
          order.prepared = true;
          pushTimeline(order, "ready_to_ship", user, now, "Product prepared.");
        } else if (action === "confirm_shipment") {
          if (order.status !== "ready_to_ship") throw new HttpError(409, "Confirm shipment only after the order is Ready to Ship.");
          if (!order.prepared) throw new HttpError(409, "Prepare the product before confirming shipment.");
          const note = typeof req.body?.note === "string" ? req.body.note.trim().slice(0, 240) : "";
          order.status = "shipped";
          order.shipmentNote = note;
          pushTimeline(order, "shipped", user, now, note ? `Shipment confirmed. ${note}` : "Shipment confirmed.");
        } else {
          throw new HttpError(400, "Unknown seller action.");
        }
        order.updatedAt = now;
        updated = order;
        log(db, {
          type: "order_status",
          message: `${user.name} updated order ${order.id}: ${ORDER_LABELS[order.status]}.`,
          actorName: user.name,
          orderId: order.id,
        });
      });
      res.json({ order: presentOrder(updated) });
    }),
  );

  app.post(
    "/api/orders/:id/complete",
    route((req, res) => {
      const user = requireUser(req);
      if (user.role === "admin") {
        throw new HttpError(403, "Platform administrators monitor transactions and do not act as the buyer or seller.");
      }
      if (user.role !== "buyer") throw new HttpError(403, "The buyer confirms completion after shipment.");
      let updated!: Order;
      store.update((db) => {
        const order = db.orders.find((item) => item.id === req.params.id);
        if (!order || order.buyer.id !== user.id) throw new HttpError(404, "Order not found.");
        if (order.status !== "shipped") {
          throw new HttpError(409, "Completion opens after the seller confirms shipment.");
        }
        const now = new Date().toISOString();
        order.status = "completed";
        order.updatedAt = now;
        pushTimeline(order, "completed", user, now, "Buyer confirmed the order arrived.");
        updated = order;
        log(db, {
          type: "order_completed",
          message: `${user.name} completed order ${order.id}.`,
          actorName: user.name,
          orderId: order.id,
        });
      });
      res.json({ order: presentOrder(updated) });
    }),
  );

  app.get(
    "/api/admin/orders",
    route((req, res) => {
      const user = requireRole(req, ["admin"]);
      void user;
      const status = typeof req.query.status === "string" ? req.query.status : "";
      const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase().slice(0, 80) : "";
      const orders = store.db.orders
        .filter((order) => (status ? order.status === status : true))
        .filter((order) =>
          q
            ? `${order.id} ${order.buyer.name} ${order.seller.name} ${order.seller.shopName ?? ""}`.toLowerCase().includes(q)
            : true,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const counts = Object.fromEntries(
        (Object.keys(ORDER_LABELS) as OrderStatus[]).map((key) => [
          key,
          store.db.orders.filter((order) => order.status === key).length,
        ]),
      );
      const volume = cents(store.db.orders.reduce((sum, order) => sum + order.total, 0));
      res.json({ orders, counts, volume, monitorOnly: true });
    }),
  );

  app.get(
    "/api/admin/users",
    route((req, res) => {
      requireRole(req, ["admin"]);
      const users = store.db.users
        .map(publicUser)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      res.json({ users });
    }),
  );

  app.patch(
    "/api/admin/users/:id",
    route((req, res) => {
      const admin = requireRole(req, ["admin"]);
      if (req.body?.role === "admin" || req.body?.action === "approve_admin") {
        throw new HttpError(403, "Platform administrator access cannot be granted from the user desk.");
      }
      const action = req.body?.action;
      if (action !== "approve" && action !== "reject" && action !== "suspend" && action !== "restore") {
        throw new HttpError(400, "Unknown user action.");
      }
      let updated!: User;
      store.update((db) => {
        const target = db.users.find((item) => item.id === req.params.id);
        if (!target) throw new HttpError(404, "User not found.");
        if (target.role === "admin") {
          throw new HttpError(403, "Platform administrators are not approved or edited from this desk.");
        }
        if (target.id === admin.id) throw new HttpError(400, "You cannot change your own platform account here.");
        if (action === "approve" || action === "reject") {
          if (target.role !== "seller") throw new HttpError(400, "Only seller applications are approved here.");
          target.sellerStatus = action === "approve" ? "approved" : "rejected";
          log(db, {
            type: action === "approve" ? "seller_approved" : "seller_rejected",
            message:
              action === "approve"
                ? `${admin.name} approved ${target.name} to sell as ${target.shopName}.`
                : `${admin.name} rejected ${target.name}'s seller application.`,
            actorName: admin.name,
          });
        } else if (action === "suspend") {
          target.suspended = true;
          db.sessions = db.sessions.filter((session) => session.userId !== target.id);
          log(db, {
            type: "user_suspended",
            message: `${admin.name} suspended ${target.name}.`,
            actorName: admin.name,
          });
        } else {
          target.suspended = false;
          log(db, {
            type: "user_restored",
            message: `${admin.name} restored ${target.name}.`,
            actorName: admin.name,
          });
        }
        updated = target;
      });
      res.json({ user: publicUser(updated) });
    }),
  );

  app.get(
    "/api/admin/activity",
    route((req, res) => {
      requireRole(req, ["admin"]);
      const activity = [...store.db.activities].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 200);
      res.json({ activity });
    }),
  );

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  if (process.env.NODE_ENV === "production") {
    const dist = path.resolve(here, "../dist");
    app.use(express.static(dist));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof HttpError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Something went wrong on the marketplace." });
  });

  return app;
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MS,
  };
}

function nextOrderId(orders: Order[]): string {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = `SI-${10000 + Math.floor(Math.random() * 90000)}`;
    if (!orders.some((order) => order.id === id)) return id;
  }
  return `SI-${Date.now().toString().slice(-8)}`;
}

function pushTimeline(order: Order, status: OrderStatus, user: User, at: string, note: string) {
  order.timeline.push({ status, at, actorId: user.id, actorName: user.name, note });
}
