import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Gate } from "./components/Gate";
import { Home } from "./pages/Home";
import { ProductPage } from "./pages/ProductPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { BuyerOrders } from "./pages/BuyerOrders";
import { BuyerOrder } from "./pages/BuyerOrder";
import { SellerOverview } from "./pages/seller/Overview";
import { Inventory } from "./pages/seller/Inventory";
import { ProductForm } from "./pages/seller/ProductForm";
import { SellerOrders } from "./pages/seller/SellerOrders";
import { SellerOrder } from "./pages/seller/SellerOrder";
import { Sales } from "./pages/seller/Sales";
import { Transactions } from "./pages/admin/Transactions";
import { TransactionDetail } from "./pages/admin/TransactionDetail";
import { Users } from "./pages/admin/Users";
import { Activity } from "./pages/admin/Activity";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="cart"
          element={
            <Gate role="buyer">
              <Cart />
            </Gate>
          }
        />
        <Route
          path="checkout"
          element={
            <Gate role="buyer">
              <Checkout />
            </Gate>
          }
        />
        <Route
          path="orders"
          element={
            <Gate role="buyer">
              <BuyerOrders />
            </Gate>
          }
        />
        <Route
          path="orders/:id"
          element={
            <Gate role="buyer">
              <BuyerOrder />
            </Gate>
          }
        />
        <Route
          path="sell"
          element={
            <Gate role="seller">
              <SellerOverview />
            </Gate>
          }
        />
        <Route
          path="sell/inventory"
          element={
            <Gate role="seller">
              <Inventory />
            </Gate>
          }
        />
        <Route
          path="sell/products/new"
          element={
            <Gate role="seller">
              <ProductForm />
            </Gate>
          }
        />
        <Route
          path="sell/products/:id/edit"
          element={
            <Gate role="seller">
              <ProductForm />
            </Gate>
          }
        />
        <Route
          path="sell/orders"
          element={
            <Gate role="seller">
              <SellerOrders />
            </Gate>
          }
        />
        <Route
          path="sell/orders/:id"
          element={
            <Gate role="seller">
              <SellerOrder />
            </Gate>
          }
        />
        <Route
          path="sell/sales"
          element={
            <Gate role="seller">
              <Sales />
            </Gate>
          }
        />
        <Route
          path="admin"
          element={
            <Gate role="admin">
              <Transactions />
            </Gate>
          }
        />
        <Route
          path="admin/transactions/:id"
          element={
            <Gate role="admin">
              <TransactionDetail />
            </Gate>
          }
        />
        <Route
          path="admin/users"
          element={
            <Gate role="admin">
              <Users />
            </Gate>
          }
        />
        <Route
          path="admin/activity"
          element={
            <Gate role="admin">
              <Activity />
            </Gate>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
