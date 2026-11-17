import postgres from "postgres";
import type { CartItem, DB, Order, OrderItem, Product, TimelineEvent, User } from "./types.js";

type Sql = postgres.Sql | postgres.TransactionSql;

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function num(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

export function openDatabase(url: string): postgres.Sql {
  return postgres(url, {
    prepare: false,
    max: 1,
    ssl: "require",
    idle_timeout: 5,
    connect_timeout: 15,
  });
}

export async function readDb(sql: Sql): Promise<DB> {
  const users = await sql<UserRow[]>`select * from shopit_users`;
  const products = await sql<ProductRow[]>`select * from shopit_products`;
  const carts = await sql<CartRow[]>`select * from shopit_cart_items`;
  const orders = await sql<OrderRow[]>`select * from shopit_orders`;
  const items = await sql<ItemRow[]>`select * from shopit_order_items order by order_id, position`;
  const timeline = await sql<TimelineRow[]>`select * from shopit_timeline order by order_id, position`;
  const activities = await sql<ActivityRow[]>`select * from shopit_activities`;
  const sessions = await sql<SessionRow[]>`select * from shopit_sessions`;

  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const item of items) {
    const list = itemsByOrder.get(item.order_id) ?? [];
    list.push({
      productId: item.product_id,
      name: item.name,
      category: item.category,
      image: item.image,
      price: num(item.price),
      quantity: item.quantity,
    });
    itemsByOrder.set(item.order_id, list);
  }
  const timelineByOrder = new Map<string, TimelineEvent[]>();
  for (const event of timeline) {
    const list = timelineByOrder.get(event.order_id) ?? [];
    list.push({
      status: event.status as TimelineEvent["status"],
      at: iso(event.at),
      actorId: event.actor_id,
      actorName: event.actor_name,
      note: event.note,
    });
    timelineByOrder.set(event.order_id, list);
  }

  const cartMap: Record<string, CartItem[]> = {};
  for (const line of carts) {
    const list = cartMap[line.user_id] ?? [];
    list.push({ productId: line.product_id, quantity: line.quantity });
    cartMap[line.user_id] = list;
  }

  return {
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
      salt: user.salt,
      role: user.role,
      shopName: user.shop_name,
      sellerStatus: user.seller_status,
      suspended: user.suspended,
      address: user.address,
      createdAt: iso(user.created_at),
    })),
    products: products.map((product) => ({
      id: product.id,
      sellerId: product.seller_id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: num(product.price),
      quantity: product.quantity,
      image: product.image,
      listingStatus: product.listing_status,
      createdAt: iso(product.created_at),
      updatedAt: iso(product.updated_at),
    })),
    carts: cartMap,
    orders: orders.map((order) => ({
      id: order.id,
      buyer: order.buyer,
      seller: order.seller,
      items: itemsByOrder.get(order.id) ?? [],
      total: num(order.total),
      status: order.status,
      paymentStatus: order.payment_status,
      prepared: order.prepared,
      shipmentNote: order.shipment_note,
      address: order.address,
      createdAt: iso(order.created_at),
      updatedAt: iso(order.updated_at),
      timeline: timelineByOrder.get(order.id) ?? [],
    })),
    activities: activities.map((activity) => ({
      id: activity.id,
      at: iso(activity.at),
      type: activity.type,
      message: activity.message,
      actorName: activity.actor_name,
      orderId: activity.order_id ?? undefined,
    })),
    sessions: sessions.map((session) => ({
      token: session.token,
      userId: session.user_id,
      createdAt: iso(session.created_at),
    })),
  };
}

export async function writeDb(sql: Sql, db: DB): Promise<void> {
  await sql`delete from shopit_timeline`;
  await sql`delete from shopit_order_items`;
  await sql`delete from shopit_cart_items`;
  await sql`delete from shopit_orders`;
  await sql`delete from shopit_activities`;
  await sql`delete from shopit_sessions`;
  await sql`delete from shopit_products`;
  await sql`delete from shopit_users`;

  if (db.users.length) {
    await sql`insert into shopit_users ${sql(
      db.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        salt: user.salt,
        role: user.role,
        shop_name: user.shopName,
        seller_status: user.sellerStatus,
        suspended: user.suspended,
        address: user.address,
        created_at: user.createdAt,
      })),
    )}`;
  }
  if (db.products.length) {
    await sql`insert into shopit_products ${sql(
      db.products.map((product) => ({
        id: product.id,
        seller_id: product.sellerId,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
        listing_status: product.listingStatus,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      })),
    )}`;
  }
  const cartRows = Object.entries(db.carts).flatMap(([userId, lines]) =>
    lines.map((line) => ({ user_id: userId, product_id: line.productId, quantity: line.quantity })),
  );
  if (cartRows.length) await sql`insert into shopit_cart_items ${sql(cartRows)}`;
  if (db.orders.length) {
    await sql`insert into shopit_orders ${sql(
      db.orders.map((order) => ({
        id: order.id,
        buyer: order.buyer,
        seller: order.seller,
        total: order.total,
        status: order.status,
        payment_status: order.paymentStatus,
        prepared: order.prepared,
        shipment_note: order.shipmentNote,
        address: order.address,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
      })),
    )}`;
    const itemRows = db.orders.flatMap((order) =>
      order.items.map((item, position) => ({
        order_id: order.id,
        position,
        product_id: item.productId,
        name: item.name,
        category: item.category,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
    );
    if (itemRows.length) await sql`insert into shopit_order_items ${sql(itemRows)}`;
    const events = db.orders.flatMap((order) =>
      order.timeline.map((event, position) => ({
        order_id: order.id,
        position,
        status: event.status,
        at: event.at,
        actor_id: event.actorId,
        actor_name: event.actorName,
        note: event.note,
      })),
    );
    if (events.length) await sql`insert into shopit_timeline ${sql(events)}`;
  }
  if (db.activities.length) {
    await sql`insert into shopit_activities ${sql(
      db.activities.map((activity) => ({
        id: activity.id,
        at: activity.at,
        type: activity.type,
        message: activity.message,
        actor_name: activity.actorName,
        order_id: activity.orderId ?? null,
      })),
    )}`;
  }
  if (db.sessions.length) {
    await sql`insert into shopit_sessions ${sql(
      db.sessions.map((session) => ({
        token: session.token,
        user_id: session.userId,
        created_at: session.createdAt,
      })),
    )}`;
  }
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  salt: string;
  role: User["role"];
  shop_name: string | null;
  seller_status: User["sellerStatus"];
  suspended: boolean;
  address: User["address"];
  created_at: Date | string;
}

interface ProductRow {
  id: string;
  seller_id: string;
  name: string;
  category: string;
  description: string;
  price: string | number;
  quantity: number;
  image: string;
  listing_status: Product["listingStatus"];
  created_at: Date | string;
  updated_at: Date | string;
}

interface CartRow {
  user_id: string;
  product_id: string;
  quantity: number;
}

interface OrderRow {
  id: string;
  buyer: Order["buyer"];
  seller: Order["seller"];
  total: string | number;
  status: Order["status"];
  payment_status: Order["paymentStatus"];
  prepared: boolean;
  shipment_note: string;
  address: Order["address"];
  created_at: Date | string;
  updated_at: Date | string;
}

interface ItemRow {
  order_id: string;
  product_id: string;
  name: string;
  category: string;
  image: string;
  price: string | number;
  quantity: number;
}

interface TimelineRow {
  order_id: string;
  status: string;
  at: Date | string;
  actor_id: string;
  actor_name: string;
  note: string;
}

interface ActivityRow {
  id: string;
  at: Date | string;
  type: string;
  message: string;
  actor_name: string;
  order_id: string | null;
}

interface SessionRow {
  token: string;
  user_id: string;
  created_at: Date | string;
}
