import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import type { AddressInfo } from "node:net";
import { createApp } from "./app.ts";

function client(base: string) {
  let cookie = "";
  return async function call(pathname: string, options: { method?: string; body?: unknown } = {}) {
    const response = await fetch(base + pathname, {
      method: options.method ?? "GET",
      headers: {
        ...(options.body ? { "content-type": "application/json" } : {}),
        ...(cookie ? { cookie } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const setCookie = response.headers.getSetCookie();
    if (setCookie.length) cookie = setCookie.map((part) => part.split(";")[0]).join("; ");
    const text = await response.text();
    return { status: response.status, data: text ? JSON.parse(text) : null };
  };
}

describe("shop it.com roles and transaction flow", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "shopit-"));
  const app = createApp({ dataFile: path.join(dir, "market.json"), seed: true });
  let server: Server;
  let base = "";

  it("enforces desks and walks an order from cart to completed", async () => {
    server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const address = server.address() as AddressInfo;
    base = `http://127.0.0.1:${address.port}`;

    const buyer = client(base);
    const seller = client(base);
    const otherSeller = client(base);
    const admin = client(base);
    const pending = client(base);
    const visitor = client(base);

    const floor = await visitor("/api/products");
    assert.equal(floor.status, 200);
    assert.ok(floor.data.products.some((product: { id: string }) => product.id === "p_mug"));
    assert.ok(!floor.data.products.some((product: { id: string }) => product.id === "p_board"));
    assert.ok(!floor.data.products.some((product: { id: string }) => product.id === "p_notebook"));
    assert.equal((await visitor("/api/cart")).status, 401);

    assert.equal((await buyer("/api/auth/login", { method: "POST", body: { email: "elena@shopit.com", password: "shopit-demo" } })).status, 200);
    assert.equal((await seller("/api/auth/login", { method: "POST", body: { email: "jonah@shopit.com", password: "shopit-demo" } })).status, 200);
    assert.equal((await otherSeller("/api/auth/login", { method: "POST", body: { email: "priya@shopit.com", password: "shopit-demo" } })).status, 200);
    assert.equal((await admin("/api/auth/login", { method: "POST", body: { email: "maya@shopit.com", password: "shopit-demo" } })).status, 200);
    assert.equal((await pending("/api/auth/login", { method: "POST", body: { email: "sam@shopit.com", password: "shopit-demo" } })).status, 200);

    const buyerInventory = await buyer("/api/seller/products", { method: "POST", body: { name: "Nope" } });
    assert.equal(buyerInventory.status, 403);
    assert.match(buyerInventory.data.error, /Buyers cannot manage inventory/);

    const sellerAdmin = await seller("/api/admin/users/u_sam", { method: "PATCH", body: { action: "approve", role: "admin" } });
    assert.equal(sellerAdmin.status, 403);
    assert.match(sellerAdmin.data.error, /Sellers cannot approve platform administrators/);

    const grantAdmin = await admin("/api/admin/users/u_sam", { method: "PATCH", body: { role: "admin" } });
    assert.equal(grantAdmin.status, 403);
    assert.match(grantAdmin.data.error, /cannot be granted/);

    const adminCart = await admin("/api/cart", { method: "POST", body: { productId: "p_mug", quantity: 1 } });
    assert.equal(adminCart.status, 403);
    assert.match(adminCart.data.error, /do not act as buyers/);

    const adminList = await admin("/api/seller/products", { method: "POST", body: { name: "Admin listing" } });
    assert.equal(adminList.status, 403);
    assert.match(adminList.data.error, /do not act as sellers/);

    const monitor = await admin("/api/orders/SI-18420/advance", { method: "POST", body: { action: "payment_received" } });
    assert.equal(monitor.status, 403);
    assert.match(monitor.data.error, /do not act as the buyer or seller/);

    const watched = await admin("/api/admin/orders");
    assert.equal(watched.status, 200);
    assert.equal(watched.data.monitorOnly, true);
    assert.ok(watched.data.orders.some((order: { id: string }) => order.id === "SI-18420"));

    const locked = await pending("/api/seller/products", {
      method: "POST",
      body: {
        name: "Early listing",
        category: "Home",
        description: "Should stay locked until approval.",
        price: 12,
        quantity: 2,
        image: "/products/mug.jpg",
        listingStatus: "active",
      },
    });
    assert.equal(locked.status, 403);

    const users = await admin("/api/admin/users");
    const sam = users.data.users.find((user: { email: string }) => user.email === "sam@shopit.com");
    const approved = await admin(`/api/admin/users/${sam.id}`, { method: "PATCH", body: { action: "approve" } });
    assert.equal(approved.status, 200);
    assert.equal(approved.data.user.sellerStatus, "approved");

    const tinyPng =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const created = await pending("/api/seller/products", {
      method: "POST",
      body: {
        name: "Clay Cup",
        category: "Kitchen",
        description: "A small cup listed after the shop was approved.",
        price: 15,
        quantity: 3,
        image: tinyPng,
        listingStatus: "active",
      },
    });
    assert.equal(created.status, 201);
    const productId = created.data.product.id as string;

    const hiddenFromFloor = await pending(`/api/seller/products/${productId}/visibility`, {
      method: "POST",
      body: { action: "hide" },
    });
    assert.equal(hiddenFromFloor.status, 200);
    const whileHidden = await visitor(`/api/products/${productId}`);
    assert.equal(whileHidden.status, 404);
    assert.equal((await pending(`/api/seller/products/${productId}/visibility`, { method: "POST", body: { action: "unhide" } })).status, 200);

    const added = await buyer("/api/cart", { method: "POST", body: { productId, quantity: 2 } });
    assert.equal(added.status, 201);
    const unconfirmed = await buyer("/api/orders", {
      method: "POST",
      body: {
        quantitiesConfirmed: false,
        items: [{ productId, quantity: 2 }],
        address: {
          recipient: "Elena Voss",
          line1: "14 Songshan Road",
          city: "Taipei",
          region: "Taipei",
          postal: "105",
          country: "Taiwan",
        },
      },
    });
    assert.equal(unconfirmed.status, 400);
    assert.match(unconfirmed.data.error, /Confirm the quantities/);

    const placed = await buyer("/api/orders", {
      method: "POST",
      body: {
        quantitiesConfirmed: true,
        items: [{ productId, quantity: 2 }],
        address: {
          recipient: "Elena Voss",
          line1: "14 Songshan Road",
          city: "Taipei",
          region: "Taipei",
          postal: "105",
          country: "Taiwan",
        },
      },
    });
    assert.equal(placed.status, 201);
    const order = placed.data.orders[0];
    assert.equal(order.status, "waiting_payment");
    assert.equal(order.paymentStatus, "waiting");
    assert.equal(order.buyer.email, "elena@shopit.com");
    assert.equal(order.total, 30);

    const stock = await pending("/api/seller/products");
    const remaining = stock.data.products.find((product: { id: string }) => product.id === productId);
    assert.equal(remaining.quantity, 1);
    assert.equal(remaining.stockStatus, "low_stock");

    const stranger = await otherSeller(`/api/orders/${order.id}/advance`, { method: "POST", body: { action: "payment_received" } });
    assert.equal(stranger.status, 404);

    const skipped = await pending(`/api/orders/${order.id}/advance`, { method: "POST", body: { action: "ready_to_ship" } });
    assert.equal(skipped.status, 409);

    const paid = await pending(`/api/orders/${order.id}/advance`, { method: "POST", body: { action: "payment_received" } });
    assert.equal(paid.status, 200);
    assert.equal(paid.data.order.status, "payment_confirmed");
    assert.equal(paid.data.order.paymentStatus, "received");

    const ready = await pending(`/api/orders/${order.id}/advance`, { method: "POST", body: { action: "ready_to_ship" } });
    assert.equal(ready.status, 200);
    assert.equal(ready.data.order.status, "ready_to_ship");

    const earlyShip = await pending(`/api/orders/${order.id}/advance`, { method: "POST", body: { action: "confirm_shipment" } });
    assert.equal(earlyShip.status, 409);
    assert.match(earlyShip.data.error, /Prepare the product/);

    assert.equal((await pending(`/api/orders/${order.id}/advance`, { method: "POST", body: { action: "prepare" } })).status, 200);
    const earlyComplete = await buyer(`/api/orders/${order.id}/complete`, { method: "POST", body: {} });
    assert.equal(earlyComplete.status, 409);

    const shipped = await pending(`/api/orders/${order.id}/advance`, {
      method: "POST",
      body: { action: "confirm_shipment", note: "Handed to the counter." },
    });
    assert.equal(shipped.status, 200);
    assert.equal(shipped.data.order.status, "shipped");

    const completed = await buyer(`/api/orders/${order.id}/complete`, { method: "POST", body: {} });
    assert.equal(completed.status, 200);
    assert.equal(completed.data.order.status, "completed");

    const sellerSales = await pending("/api/seller/sales");
    assert.equal(sellerSales.status, 200);
    assert.ok(sellerSales.data.summary.completedTotal >= 30);

    const activity = await admin("/api/admin/activity");
    assert.equal(activity.status, 200);
    assert.ok(activity.data.activity.some((item: { orderId?: string }) => item.orderId === order.id));
    assert.equal((await buyer("/api/admin/activity")).status, 403);
  });

  after(() => {
    server?.close();
  });
});
