"use client";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Perfume } from "@/types";
import { money } from "@/lib/business";
import { useStore } from "@/components/store-provider";
import { useState } from "react";
export function ProductCard({ product }: { product: Perfume }) {
  const { add, favorites, toggleFavorite } = useStore();
  const liked = favorites.includes(product.id);
  const [added, setAdded] = useState(false);
  function handleAdd() {
    add(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link href={`/perfume/${product.slug}`} className="product-image-link">
          <img
            className="product-image"
            src={product.image}
            alt={`Perfume ${product.name}`}
            loading="lazy"
          />
          <span className="product-tag">
            {product.stock < 1 ? "Agotado" : product.isNew ? "Nuevo" : ""}
          </span>
        </Link>
        <button
          className={`favorite-button ${liked ? "is-favorite" : ""}`}
          aria-label={liked ? "Quitar de favoritos" : "Añadir a favoritos"}
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
        {product.stock > 0 && (
          <button
            className={`quick-add ${added ? "added" : ""}`}
            onClick={handleAdd}
            aria-label="Añadir al pedido"
          >
            <Plus size={17}/>
          </button>
        )}
      </div>
      <div className="product-info">
        <p className="eyebrow">{product.brand}</p>
        <Link href={`/perfume/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-meta">
          <span>{product.size} ml</span>
          <strong>{money(product.price)}</strong>
        </div>
        {added && <div style={{ marginTop: "0.6rem", color: "var(--gold)", fontSize: "0.85rem" }}>Agregado al carrito ✓</div>}
      </div>
    </article>
  );
}
