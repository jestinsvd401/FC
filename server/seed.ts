import type { Address } from "../shared/marketplace.ts";
import { hashPassword } from "./auth.ts";
import type { DB, Order, Product, User } from "./types.ts";

const DEMO_PASSWORD = "shopit-demo";

const taipei: Address = {
  recipient: "Elena Voss",
  line1: "14 Songshan Road",
  city: "Taipei",
  region: "Taipei",
  postal: "105",
  country: "Taiwan",
};

const portland: Address = {
  recipient: "Chris Adeyemi",
  line1: "88 Division Street",
  city: "Portland",
  region: "OR",
  postal: "97202",
  country: "United States",
};

function user(
  partial: Omit<User, "passwordHash" | "salt" | "suspended" | "createdAt"> & {
    suspended?: boolean;
    createdAt?: string;
  },
): User {
  return {
    suspended: false,
    createdAt: partial.createdAt ?? "2026-10-02T02:00:00.000Z",
    ...hashPassword(DEMO_PASSWORD),
    ...partial,
  };
}

function product(
  partial: Omit<Product, "createdAt" | "updatedAt"> & { createdAt?: string },
): Product {
  const createdAt = partial.createdAt ?? "2026-10-12T03:00:00.000Z";
  return { createdAt, updatedAt: createdAt, ...partial };
}

export function buildSeed(): DB {
  const users: User[] = [
    user({
      id: "u_maya",
      name: "Maya Chen",
      email: "maya@shopit.com",
      role: "admin",
      shopName: null,
      sellerStatus: null,
      address: null,
      createdAt: "2026-09-01T01:00:00.000Z",
    }),
    user({
      id: "u_jonah",
      name: "Jonah Hale",
      email: "jonah@shopit.com",
      role: "seller",
      shopName: "Northwind Goods",
      sellerStatus: "approved",
      address: {
        recipient: "Jonah Hale",
        line1: "19 Warren Street",
        city: "Hudson",
        region: "NY",
        postal: "12534",
        country: "United States",
      },
      createdAt: "2026-09-14T01:00:00.000Z",
    }),
    user({
      id: "u_priya",
      name: "Priya Nair",
      email: "priya@shopit.com",
      role: "seller",
      shopName: "Field & Form",
      sellerStatus: "approved",
      address: {
        recipient: "Priya Nair",
        line1: "410 East 6th Street",
        city: "Austin",
        region: "TX",
        postal: "78702",
        country: "United States",
      },
      createdAt: "2026-09-18T01:00:00.000Z",
    }),
    user({
      id: "u_elena",
      name: "Elena Voss",
      email: "elena@shopit.com",
      role: "buyer",
      shopName: null,
      sellerStatus: null,
      address: taipei,
      createdAt: "2026-10-01T01:00:00.000Z",
    }),
    user({
      id: "u_chris",
      name: "Chris Adeyemi",
      email: "chris@shopit.com",
      role: "buyer",
      shopName: null,
      sellerStatus: null,
      address: portland,
      createdAt: "2026-10-03T01:00:00.000Z",
    }),
    user({
      id: "u_sam",
      name: "Sam Ortiz",
      email: "sam@shopit.com",
      role: "seller",
      shopName: "Lot & Line",
      sellerStatus: "pending",
      address: null,
      createdAt: "2026-11-15T08:00:00.000Z",
    }),
  ];

  const products: Product[] = [
    product({
      id: "p_mug",
      sellerId: "u_jonah",
      name: "Stoneware Mug",
      category: "Home",
      description:
        "A thick-walled cup with a low handle, glazed warm white. It holds 300 ml and sits steady on a desk.",
      price: 28,
      quantity: 18,
      image: "/products/mug.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_lamp",
      sellerId: "u_jonah",
      name: "Graphite Floor Lamp",
      category: "Home",
      description:
        "Matte steel arm with a deep shade. The head tilts and stays put. A cloth cord is included.",
      price: 86,
      quantity: 4,
      image: "/products/lamp.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_candle",
      sellerId: "u_jonah",
      name: "Glass Pillar Candle",
      category: "Home",
      description:
        "Unscented soy blend in clear glass. It burns for about 45 hours on a cotton wick.",
      price: 24,
      quantity: 16,
      image: "/products/candle.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_board",
      sellerId: "u_jonah",
      name: "Walnut Serving Board",
      category: "Kitchen",
      description:
        "Edge-grain walnut, 40 cm long, with a juice groove and an oil finish. Hidden from the floor until Jonah lists it again.",
      price: 46,
      quantity: 7,
      image: "/products/board.svg",
      listingStatus: "hidden",
    }),
    product({
      id: "p_throw",
      sellerId: "u_jonah",
      name: "Oat Linen Throw",
      category: "Home",
      description:
        "Washed linen in oat, 140 by 200 cm. The cloth is soft and already creased. None are left on hand.",
      price: 58,
      quantity: 0,
      image: "/products/throw.svg",
      listingStatus: "active",
    }),
    product({
      id: "p_headphones",
      sellerId: "u_jonah",
      name: "Studio Headphones",
      category: "Electronics",
      description:
        "Closed ear cups, a padded band, and a detachable cable. Tuned for long listening rather than heavy bass.",
      price: 79,
      quantity: 5,
      image: "/products/headphones.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_poncho",
      sellerId: "u_priya",
      name: "Open-Knit Poncho",
      category: "Fashion",
      description:
        "Cotton open knit with a fringe hem. One size, meant to sit over a shirt. The yarn is undyed.",
      price: 96,
      quantity: 11,
      image: "/products/poncho.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_runners",
      sellerId: "u_priya",
      name: "Clay Court Sneakers",
      category: "Sports",
      description:
        "A court sneaker with a clay-colored upper and a pale sole. Unbranded, true to size, for daily miles.",
      price: 118,
      quantity: 3,
      image: "/products/runners.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_daypack",
      sellerId: "u_priya",
      name: "Charcoal Daypack",
      category: "Fashion",
      description:
        "An 18-liter pack with a front pocket and padded straps. The shell shrugs off a light rain.",
      price: 74,
      quantity: 9,
      image: "/products/daypack.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_watch",
      sellerId: "u_priya",
      name: "Slim Leather Watch",
      category: "Fashion",
      description:
        "A slim case, white dial, and taupe leather strap. Three hands, quartz, no logo on the face.",
      price: 128,
      quantity: 6,
      image: "/products/watch.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_scarf",
      sellerId: "u_priya",
      name: "Windowpane Wool Scarf",
      category: "Fashion",
      description:
        "Soft wool in a windowpane check of camel, ink, and rust. Long enough to wrap twice.",
      price: 42,
      quantity: 2,
      image: "/products/scarf.jpg",
      listingStatus: "active",
    }),
    product({
      id: "p_notebook",
      sellerId: "u_priya",
      name: "Write Ideas Notebook",
      category: "Books",
      description:
        "Cloth cover, 192 lined pages, lay-flat binding. Priya removed this listing from the floor.",
      price: 16,
      quantity: 14,
      image: "/products/notebook.jpg",
      listingStatus: "removed",
    }),
  ];

  const buyerElena = {
    id: "u_elena",
    name: "Elena Voss",
    email: "elena@shopit.com",
    address: taipei,
  };
  const buyerChris = {
    id: "u_chris",
    name: "Chris Adeyemi",
    email: "chris@shopit.com",
    address: portland,
  };
  const sellerJonah = {
    id: "u_jonah",
    name: "Jonah Hale",
    email: "jonah@shopit.com",
    shopName: "Northwind Goods",
  };
  const sellerPriya = {
    id: "u_priya",
    name: "Priya Nair",
    email: "priya@shopit.com",
    shopName: "Field & Form",
  };

  const orders: Order[] = [
    {
      id: "SI-18420",
      buyer: buyerElena,
      seller: sellerJonah,
      items: [
        {
          productId: "p_mug",
          name: "Stoneware Mug",
          category: "Home",
          image: "/products/mug.jpg",
          price: 28,
          quantity: 2,
        },
      ],
      total: 56,
      status: "waiting_payment",
      paymentStatus: "waiting",
      prepared: false,
      shipmentNote: "",
      address: taipei,
      createdAt: "2026-11-17T01:20:00.000Z",
      updatedAt: "2026-11-17T01:20:00.000Z",
      timeline: [
        {
          status: "waiting_payment",
          at: "2026-11-17T01:20:00.000Z",
          actorId: "u_elena",
          actorName: "Elena Voss",
          note: "Order submitted. Waiting for payment confirmation.",
        },
      ],
    },
    {
      id: "SI-18433",
      buyer: buyerElena,
      seller: sellerPriya,
      items: [
        {
          productId: "p_poncho",
          name: "Open-Knit Poncho",
          category: "Fashion",
          image: "/products/poncho.jpg",
          price: 96,
          quantity: 1,
        },
      ],
      total: 96,
      status: "payment_confirmed",
      paymentStatus: "received",
      prepared: false,
      shipmentNote: "",
      address: taipei,
      createdAt: "2026-11-16T02:10:00.000Z",
      updatedAt: "2026-11-16T06:40:00.000Z",
      timeline: [
        {
          status: "waiting_payment",
          at: "2026-11-16T02:10:00.000Z",
          actorId: "u_elena",
          actorName: "Elena Voss",
          note: "Order submitted. Waiting for payment confirmation.",
        },
        {
          status: "payment_confirmed",
          at: "2026-11-16T06:40:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Payment received.",
        },
      ],
    },
    {
      id: "SI-18441",
      buyer: buyerChris,
      seller: sellerJonah,
      items: [
        {
          productId: "p_headphones",
          name: "Studio Headphones",
          category: "Electronics",
          image: "/products/headphones.jpg",
          price: 79,
          quantity: 1,
        },
      ],
      total: 79,
      status: "ready_to_ship",
      paymentStatus: "received",
      prepared: false,
      shipmentNote: "",
      address: portland,
      createdAt: "2026-11-15T08:00:00.000Z",
      updatedAt: "2026-11-16T03:15:00.000Z",
      timeline: [
        {
          status: "waiting_payment",
          at: "2026-11-15T08:00:00.000Z",
          actorId: "u_chris",
          actorName: "Chris Adeyemi",
          note: "Order submitted. Waiting for payment confirmation.",
        },
        {
          status: "payment_confirmed",
          at: "2026-11-15T18:00:00.000Z",
          actorId: "u_jonah",
          actorName: "Jonah Hale",
          note: "Payment received.",
        },
        {
          status: "ready_to_ship",
          at: "2026-11-16T03:15:00.000Z",
          actorId: "u_jonah",
          actorName: "Jonah Hale",
          note: "Moved to Ready to Ship.",
        },
      ],
    },
    {
      id: "SI-18455",
      buyer: buyerChris,
      seller: sellerPriya,
      items: [
        {
          productId: "p_daypack",
          name: "Charcoal Daypack",
          category: "Fashion",
          image: "/products/daypack.jpg",
          price: 74,
          quantity: 1,
        },
      ],
      total: 74,
      status: "shipped",
      paymentStatus: "received",
      prepared: true,
      shipmentNote: "Packed in a mailer. Handed to the carrier.",
      address: portland,
      createdAt: "2026-11-13T04:00:00.000Z",
      updatedAt: "2026-11-14T07:30:00.000Z",
      timeline: [
        {
          status: "waiting_payment",
          at: "2026-11-13T04:00:00.000Z",
          actorId: "u_chris",
          actorName: "Chris Adeyemi",
          note: "Order submitted. Waiting for payment confirmation.",
        },
        {
          status: "payment_confirmed",
          at: "2026-11-13T09:00:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Payment received.",
        },
        {
          status: "ready_to_ship",
          at: "2026-11-13T16:00:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Moved to Ready to Ship.",
        },
        {
          status: "ready_to_ship",
          at: "2026-11-14T01:00:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Product prepared.",
        },
        {
          status: "shipped",
          at: "2026-11-14T07:30:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Shipment confirmed. Packed in a mailer. Handed to the carrier.",
        },
      ],
    },
    {
      id: "SI-18302",
      buyer: buyerElena,
      seller: sellerPriya,
      items: [
        {
          productId: "p_watch",
          name: "Slim Leather Watch",
          category: "Fashion",
          image: "/products/watch.jpg",
          price: 128,
          quantity: 1,
        },
      ],
      total: 128,
      status: "completed",
      paymentStatus: "received",
      prepared: true,
      shipmentNote: "Shipped in a small box.",
      address: taipei,
      createdAt: "2026-11-08T02:00:00.000Z",
      updatedAt: "2026-11-11T08:00:00.000Z",
      timeline: [
        {
          status: "waiting_payment",
          at: "2026-11-08T02:00:00.000Z",
          actorId: "u_elena",
          actorName: "Elena Voss",
          note: "Order submitted. Waiting for payment confirmation.",
        },
        {
          status: "payment_confirmed",
          at: "2026-11-08T06:00:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Payment received.",
        },
        {
          status: "ready_to_ship",
          at: "2026-11-08T12:00:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Moved to Ready to Ship.",
        },
        {
          status: "ready_to_ship",
          at: "2026-11-09T01:00:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Product prepared.",
        },
        {
          status: "shipped",
          at: "2026-11-09T05:00:00.000Z",
          actorId: "u_priya",
          actorName: "Priya Nair",
          note: "Shipment confirmed. Shipped in a small box.",
        },
        {
          status: "completed",
          at: "2026-11-11T08:00:00.000Z",
          actorId: "u_elena",
          actorName: "Elena Voss",
          note: "Buyer confirmed the order arrived.",
        },
      ],
    },
  ];

  return {
    users,
    products,
    carts: {},
    orders,
    sessions: [],
    activities: [
      {
        id: "a1",
        at: "2026-09-14T01:00:00.000Z",
        type: "seller_approved",
        message: "Maya Chen approved Jonah Hale to sell as Northwind Goods.",
        actorName: "Maya Chen",
      },
      {
        id: "a2",
        at: "2026-09-18T01:00:00.000Z",
        type: "seller_approved",
        message: "Maya Chen approved Priya Nair to sell as Field & Form.",
        actorName: "Maya Chen",
      },
      {
        id: "a3",
        at: "2026-10-12T03:00:00.000Z",
        type: "product_listed",
        message: "Jonah Hale listed Stoneware Mug.",
        actorName: "Jonah Hale",
      },
      {
        id: "a4",
        at: "2026-10-20T03:00:00.000Z",
        type: "product_hidden",
        message: "Jonah Hale hid Walnut Serving Board.",
        actorName: "Jonah Hale",
      },
      {
        id: "a5",
        at: "2026-11-08T02:00:00.000Z",
        type: "order_placed",
        message: "Elena Voss placed order SI-18302 with Field & Form.",
        actorName: "Elena Voss",
        orderId: "SI-18302",
      },
      {
        id: "a6",
        at: "2026-11-11T08:00:00.000Z",
        type: "order_completed",
        message: "Elena Voss completed order SI-18302.",
        actorName: "Elena Voss",
        orderId: "SI-18302",
      },
      {
        id: "a7",
        at: "2026-11-14T07:30:00.000Z",
        type: "order_shipped",
        message: "Priya Nair shipped order SI-18455.",
        actorName: "Priya Nair",
        orderId: "SI-18455",
      },
      {
        id: "a8",
        at: "2026-11-15T08:00:00.000Z",
        type: "seller_applied",
        message: "Sam Ortiz applied to sell as Lot & Line and is waiting for approval.",
        actorName: "Sam Ortiz",
      },
      {
        id: "a9",
        at: "2026-11-16T03:15:00.000Z",
        type: "order_status",
        message: "Jonah Hale moved order SI-18441 to Ready to ship.",
        actorName: "Jonah Hale",
        orderId: "SI-18441",
      },
      {
        id: "a10",
        at: "2026-11-17T01:20:00.000Z",
        type: "order_placed",
        message: "Elena Voss placed order SI-18420 with Northwind Goods.",
        actorName: "Elena Voss",
        orderId: "SI-18420",
      },
    ],
  };
}

export const DEMO_ACCOUNTS = [
  { name: "Maya Chen", email: "maya@shopit.com", role: "Platform admin", password: DEMO_PASSWORD },
  { name: "Jonah Hale", email: "jonah@shopit.com", role: "Seller · Northwind Goods", password: DEMO_PASSWORD },
  { name: "Priya Nair", email: "priya@shopit.com", role: "Seller · Field & Form", password: DEMO_PASSWORD },
  { name: "Elena Voss", email: "elena@shopit.com", role: "Buyer", password: DEMO_PASSWORD },
  { name: "Chris Adeyemi", email: "chris@shopit.com", role: "Buyer", password: DEMO_PASSWORD },
  { name: "Sam Ortiz", email: "sam@shopit.com", role: "Seller · pending approval", password: DEMO_PASSWORD },
];
