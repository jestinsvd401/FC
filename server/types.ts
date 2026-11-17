import type {
  Address,
  ListingStatus,
  OrderStatus,
  PaymentStatus,
  Role,
  SellerStatus,
} from "../shared/marketplace.js";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: Role;
  shopName: string | null;
  sellerStatus: SellerStatus | null;
  suspended: boolean;
  address: Address | null;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  listingStatus: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

export interface TimelineEvent {
  status: OrderStatus;
  at: string;
  actorId: string;
  actorName: string;
  note: string;
}

export interface OrderParty {
  id: string;
  name: string;
  email: string;
  shopName?: string | null;
  address?: Address | null;
}

export interface Order {
  id: string;
  buyer: OrderParty;
  seller: OrderParty;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  prepared: boolean;
  shipmentNote: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface Activity {
  id: string;
  at: string;
  type: string;
  message: string;
  actorName: string;
  orderId?: string;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
}

export interface DB {
  users: User[];
  products: Product[];
  carts: Record<string, CartItem[]>;
  orders: Order[];
  activities: Activity[];
  sessions: Session[];
}

export function emptyDb(): DB {
  return { users: [], products: [], carts: {}, orders: [], activities: [], sessions: [] };
}
