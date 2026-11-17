export const CATEGORIES = [
  "Home",
  "Kitchen",
  "Fashion",
  "Sports",
  "Electronics",
  "Books",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Role = "buyer" | "seller" | "admin";

export type SellerStatus = "pending" | "approved" | "rejected";

export type ListingStatus = "active" | "hidden" | "removed";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type OrderStatus =
  | "waiting_payment"
  | "payment_confirmed"
  | "ready_to_ship"
  | "shipped"
  | "completed";

export type PaymentStatus = "waiting" | "received";

export const LOW_STOCK_AT = 5;

export const ORDER_FLOW: OrderStatus[] = [
  "waiting_payment",
  "payment_confirmed",
  "ready_to_ship",
  "shipped",
  "completed",
];

export const ORDER_LABELS: Record<OrderStatus, string> = {
  waiting_payment: "Waiting for payment confirmation",
  payment_confirmed: "Payment Confirmed",
  ready_to_ship: "Ready to ship",
  shipped: "Shipped",
  completed: "Completed",
};

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  waiting: "Waiting for payment",
  received: "Payment received",
};

export const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

export const LISTING_LABELS: Record<ListingStatus, string> = {
  active: "Active",
  hidden: "Hidden",
  removed: "Removed",
};

export function stockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= LOW_STOCK_AT) return "low_stock";
  return "in_stock";
}

export function money(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

export interface Address {
  recipient: string;
  line1: string;
  city: string;
  region: string;
  postal: string;
  country: string;
}

export function formatAddress(address: Address): string {
  return [
    address.recipient,
    address.line1,
    `${address.city}, ${address.region} ${address.postal}`,
    address.country,
  ]
    .filter(Boolean)
    .join("\n");
}
