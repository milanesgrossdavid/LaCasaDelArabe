"use client";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Perfume } from "@/types";
import { money } from "@/lib/business";
import { useStore } from "@/components/store-provider";
import { useState } from "react";

export function HomeProductCard({ product }: { product: Perfume }) {
  const { add, favorites, toggleFavorite } = useStore();
  const liked = favorites.includes(product.id);
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    add(product.id);
    setAdded(true);
    const el = document.createElement("div");
    el.textContent = "Agregado al carrito ✓";
    el.style.cssText =
      "position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--gold);color:#1a1407;padding:0.8rem 1.8rem;border-radius:50px;z-index:9999;font-weight:500;box-shadow:0 20px 60px rgba(0,0,0,0.2);animation:fadeInUp 0.3s ease";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link href={`/perfume/${product.slug}`} className="product-image-link">
          <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
          {product.isNew && <span className="product-tag">Nuevo</span>}
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
        <p className="eyebrow">{product.brand || ""}</p>
        <Link href={`/perfume/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-meta">
          <span>
            {product.gender} · {product.size} ml
          </span>
          <strong>{money(product.price)}</strong>
        </div>
      </div>
    </article>
  );
}
