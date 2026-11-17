import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, STOCK_LABELS, stockStatus } from "../../../shared/marketplace";
import { api } from "../../api";
import { useAuth } from "../../auth";
import type { CatalogProduct } from "../../types";

export function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [preview, setPreview] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const approved = user?.sellerStatus === "approved";

  useEffect(() => {
    if (!id) return;
    api<{ product: CatalogProduct }>(`/api/seller/products/${id}`)
      .then((data) => {
        setProduct(data.product);
        setPreview(data.product.image);
        setQuantity(data.product.quantity);
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 1_400_000) {
      setError("Product image must be under 1.4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function submit(form: FormData) {
    if (!approved) return;
    setPending(true);
    setError("");
    const body = {
      name: form.get("name"),
      category: form.get("category"),
      description: form.get("description"),
      price: Number(form.get("price")),
      quantity: Number(form.get("quantity")),
      listingStatus: form.get("listingStatus"),
      image: preview.startsWith("data:") || !editing ? preview : undefined,
    };
    try {
      if (editing) {
        await api(`/api/seller/products/${id}`, { method: "PATCH", body });
      } else {
        await api("/api/seller/products", { method: "POST", body: { ...body, image: preview } });
      }
      navigate("/sell/inventory");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product.");
    } finally {
      setPending(false);
    }
  }

  if (editing && !product && !error) return <p className="loading">Loading listing…</p>;

  return (
    <section className="sheet">
      <p className="eyebrow">Listing</p>
      <h1>{editing ? "Edit product" : "Add a product"}</h1>
      {!approved && <p className="monitor">You can read this form, but listing stays locked until the platform admin approves the shop.</p>}
      <form
        className="product-form"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(new FormData(event.currentTarget));
        }}
      >
        <label>
          Product Name
          <input name="name" required defaultValue={product?.name} />
        </label>
        <label>
          Category
          <select name="category" defaultValue={product?.category ?? "Home"}>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea name="description" required minLength={10} rows={5} defaultValue={product?.description} />
        </label>
        <label>
          Price
          <input name="price" type="number" min={0.5} step="0.01" required defaultValue={product?.price ?? 20} />
        </label>
        <label>
          Quantity
          <input
            name="quantity"
            type="number"
            min={0}
            step={1}
            required
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
        </label>
        <p className="note">
          Stock status: <strong>{STOCK_LABELS[stockStatus(Number.isFinite(quantity) ? quantity : 0)]}</strong>
        </p>
        <label>
          Product Image
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => onFile(event.target.files?.[0])} />
        </label>
        {preview && <img className="preview" src={preview} alt="Product preview" />}
        <label>
          Listing Status
          <select name="listingStatus" defaultValue={product?.listingStatus === "hidden" ? "hidden" : "active"}>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <button className="button" disabled={!approved || pending || (!editing && !preview)}>
          {pending ? "Saving…" : editing ? "Save product" : "List product"}
        </button>
      </form>
    </section>
  );
}
