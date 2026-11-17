import type { Order } from "./types.js";

const TAIPEI = "Asia/Taipei";
const DAY = 86_400_000;

export function taipeiDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TAIPEI,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function taipeiMonth(iso: string): string {
  return taipeiDate(iso).slice(0, 7);
}

export function monthLabel(month: string): string {
  const [year, mon] = month.split("-");
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(Number(year), Number(mon) - 1, 1)));
}

export function completedAt(order: Order): string | null {
  if (order.status !== "completed") return null;
  const event = [...order.timeline].reverse().find((item) => item.status === "completed");
  return event?.at ?? order.updatedAt;
}

export function reviewOrder(order: Order, now = Date.now()) {
  const ageDays = (iso: string) => (now - new Date(iso).getTime()) / DAY;
  const flags: string[] = [];
  if (order.status === "waiting_payment" && ageDays(order.createdAt) >= 3) {
    flags.push("Payment still waiting");
  }
  if ((order.status === "payment_confirmed" || order.status === "ready_to_ship") && ageDays(order.updatedAt) >= 3) {
    flags.push("Shipment is overdue");
  }
  if (order.status === "shipped" && ageDays(order.updatedAt) >= 7) {
    flags.push("Shipped and not closed");
  }
  if (order.paymentStatus === "waiting" && order.status !== "waiting_payment") {
    flags.push("Payment does not match the order status");
  }
  if (order.total <= 0) flags.push("Amount is not positive");
  return {
    incomplete: order.status !== "completed",
    abnormal: flags.length > 0,
    flags,
  };
}

function cents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function sellerLedger(orders: Order[], now = Date.now()) {
  const completed = orders.filter((order) => order.status === "completed");
  const month = taipeiMonth(new Date(now).toISOString());
  const monthlyRevenue = cents(
    completed
      .filter((order) => taipeiMonth(completedAt(order) ?? order.updatedAt) === month)
      .reduce((sum, order) => sum + order.total, 0),
  );
  const byMonth = new Map<string, { revenue: number; completedOrders: number }>();
  for (const order of completed) {
    const key = taipeiMonth(completedAt(order) ?? order.updatedAt);
    const row = byMonth.get(key) ?? { revenue: 0, completedOrders: 0 };
    row.revenue = cents(row.revenue + order.total);
    row.completedOrders += 1;
    byMonth.set(key, row);
  }
  const pending = orders.filter((order) => order.status === "waiting_payment");
  const waiting = orders.filter((order) => order.status === "payment_confirmed" || order.status === "ready_to_ship");
  return {
    month,
    monthLabel: monthLabel(month),
    monthlyRevenue,
    months: [...byMonth.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, row]) => ({ month: key, label: monthLabel(key), ...row })),
    completedOrders: completed.length,
    pendingPayments: pending.length,
    pendingPaymentAmount: cents(pending.reduce((sum, order) => sum + order.total, 0)),
    waitingShipment: waiting.length,
    completedTotal: cents(completed.reduce((sum, order) => sum + order.total, 0)),
  };
}

export function csvCell(value: string | number): string {
  const text = String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

export function salesCsv(orders: Order[]): string {
  const header = [
    "Order ID",
    "Buyer",
    "Buyer email",
    "Products",
    "Total amount",
    "Payment status",
    "Transaction status",
    "Order date",
    "Completed at",
  ];
  const rows = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((order) =>
      [
        order.id,
        order.buyer.name,
        order.buyer.email,
        order.items.map((item) => `${item.name} x ${item.quantity}`).join("; "),
        order.total.toFixed(2),
        order.paymentStatus,
        order.status,
        order.createdAt,
        completedAt(order) ?? "",
      ]
        .map(csvCell)
        .join(","),
    );
  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
