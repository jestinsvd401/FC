import { Link } from "react-router-dom";
import { STOCK_LABELS, money } from "../../shared/marketplace";
import type { CatalogProduct } from "../types";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link className="card" to={`/product/${product.id}`}>
      <div className="card-photo">
        <img src={product.image} alt="" />
        <em className={`stock ${product.stockStatus}`}>{STOCK_LABELS[product.stockStatus]}</em>
      </div>
      <p className="eyebrow">{product.category}</p>
      <h3>{product.name}</h3>
      <p className="shop">{product.shopName}</p>
      <p className="price">{money(product.price)}</p>
    </Link>
  );
}
