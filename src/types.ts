import type { Address, ListingStatus, OrderStatus, PaymentStatus, Role, SellerStatus, StockStatus } from "../shared/marketplace";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  shopName: string | null;
  sellerStatus: SellerStatus | null;
  suspended: boolean;
  address: Address | null;
  createdAt: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  stockStatus: StockStatus;
  image: string;
  sellerId: string;
  sellerName: string;
  shopName: string;
  listingStatus: ListingStatus;
  updatedAt: string;
}

export interface CartLine {
  productId: string;
  quantity: number;
  name: string;
  image: string;
  price: number;
  available: number;
  stockStatus: StockStatus;
  listingStatus: ListingStatus;
  sellerId: string;
  sellerName: string;
  shopName: string;
  lineTotal: number;
  purchasable: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

export interface MarketplaceOrder {
  id: string;
  buyer: { id: string; name: string; email: string; address?: Address | null };
  seller: { id: string; name: string; email: string; shopName?: string | null };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  prepared: boolean;
  shipmentNote: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  timeline: { status: OrderStatus; at: string; actorId: string; actorName: string; note: string }[];
}

export interface ActivityItem {
  id: string;
  at: string;
  type: string;
  message: string;
  actorName: string;
  orderId?: string;
}
