"use client";
import { Heart, ShoppingBag } from "lucide-react";
import { useStore } from "@/components/store-provider";
export function ProductActions({ id, stock }: { id: string; stock: number }) {
  const { add, favorites, toggleFavorite, cart } = useStore();
  const line = cart.find((x) => x.id === id);
  const liked = favorites.includes(id);
  return (
    <div className="product-actions">
      <button
        disabled={stock < 1}
        className="button button-dark"
        onClick={() => add(id)}
      >
        <ShoppingBag size={17} />
        {stock < 1
          ? "Agotado"
          : line
            ? `Añadir otra unidad (${line.quantity} en pedido)`
            : "Añadir al pedido"}
      </button>
      <button
        className={`favorite-detail ${liked ? "is-favorite" : ""}`}
        onClick={() => toggleFavorite(id)}
        aria-label="Alternar favorito"
      >
        <Heart size={19} fill={liked ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
