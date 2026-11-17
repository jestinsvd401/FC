# shop it.com

A person-to-person marketplace with separate desks for visitors, buyers, sellers, and the platform admin.

Visitors browse public listings. Buyers add products to a cart, confirm quantities, and submit orders. Sellers manage inventory and move each order through payment, packing, and shipment. The platform admin monitors transactions and manages users, without buying or selling.

## Run

```bash
npm install
npm run dev
```

The floor opens at http://127.0.0.1:5173. The API listens on port 3001. Sample data is created in `data/market.json` on first launch.

```bash
npm test
npm run build
npm start
```

## Sample accounts

Password for every sample account: `shopit-demo`

| Person | Email | Role |
| --- | --- | --- |
| Maya Chen | maya@shopit.com | Platform admin |
| Jonah Hale | jonah@shopit.com | Approved seller, Northwind Goods |
| Priya Nair | priya@shopit.com | Approved seller, Field & Form |
| Elena Voss | elena@shopit.com | Buyer |
| Chris Adeyemi | chris@shopit.com | Buyer |
| Sam Ortiz | sam@shopit.com | Seller waiting for approval |

## Order trail

Waiting for payment confirmation → Payment Confirmed → Ready to ship → Shipped → Completed

The seller records payment, moves the order to Ready to Ship, prepares the product, and confirms shipment. The buyer marks the order completed after it arrives. The admin can read every step and cannot advance it.
