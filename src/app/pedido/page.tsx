"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { business, money } from "@/lib/business";
import { useStore } from "@/components/store-provider";
export default function Pedido() {
  const { cart, setQty, remove, clear, perfumes } = useStore();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [gift, setGift] = useState(false);
  const lines = cart
    .map((l) => ({ line: l, p: perfumes.find((p) => p.id === l.id) }))
    .filter((x) => x.p && x.p.stock > 0)
    .map((x) => ({ ...x, qty: Math.min(x.line.quantity, x.p!.stock) }));
  const total = lines.reduce((n, x) => n + x.p!.price * x.qty, 0);
  const message = [
    `Hola, quiero consultar para hacer este pedido en ${business.name}.`,
    name.trim() ? `Nombre: ${name.trim()}` : "",
    ...lines.map(
      (x) =>
        `• ${x.p!.name} (${x.p!.size} ml) × ${x.qty} — ${money(x.p!.price * x.qty)}`,
    ),
    `Total estimado: ${money(total)}`,
    gift ? "Es para regalo." : "",
    note.trim() ? `Nota: ${note.trim()}` : "",
    "¿Podrían confirmarme la disponibilidad y el total final?",
  ]
    .filter(Boolean)
    .join("\n");
  const url = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
  return (
    <div className="page-shell order-page">
      <div className="page-heading compact-heading">
        <h1>
          Tu <em>pedido.</em>
        </h1>
        <p>
          Revisa tu selección y continúa por WhatsApp. No se realiza ningún pago
          en esta web.
        </p>
      </div>
      {!lines.length ? (
        <div className="empty-state">
          <h2>Tu pedido está esperando su primer aroma.</h2>
          <p>Añade los perfumes que te gustaría consultar.</p>
          <Link className="button button-dark" href="/catalogo">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="order-layout">
          <div className="order-lines">
            <div className="order-lines-head">
              <span>PRODUCTO</span>
              <span>CANTIDAD</span>
              <span>SUBTOTAL</span>
            </div>
            {lines.map(({ p, qty }) => (
              <div className="order-line" key={p!.id}>
                <img src={p!.image} alt={p!.name} />
                <div className="order-line-info">
                  <span className="eyebrow">{p!.brand}</span>
                  <Link href={`/perfume/${p!.slug}`}>{p!.name}</Link>
                  <small>
                    {p!.size} ml · {money(p!.price)}
                  </small>
                  <button className="remove-line" onClick={() => remove(p!.id)}>
                    <Trash2 size={13} /> Quitar
                  </button>
                </div>
                <div className="qty-control">
                  <button
                    aria-label="Reducir cantidad"
                    onClick={() => setQty(p!.id, qty - 1)}
                  >
                    <Minus size={13} />
                  </button>
                  <span>{qty}</span>
                  <button
                    aria-label="Aumentar cantidad"
                    disabled={qty >= p!.stock}
                    onClick={() => setQty(p!.id, qty + 1)}
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <strong className="line-total">{money(p!.price * qty)}</strong>
              </div>
            ))}
            <button
              className="text-link continue-link"
              onClick={() => {
                clear();
              }}
            >
              <Trash2 size={14} /> Vaciar pedido
            </button>
          </div>
          <aside className="order-summary">
            <p className="eyebrow">RESUMEN DEL PEDIDO</p>
            <label>
              Tu nombre (opcional)
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamas?"
              />
            </label>
            <label>
              Nota para el negocio
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="¿Alguna preferencia o pregunta?"
                rows={3}
              />
            </label>
            <label className="gift-check">
              <input
                type="checkbox"
                checked={gift}
                onChange={(e) => setGift(e.target.checked)}
              />{" "}
              Es para regalo
            </label>
            <div className="summary-total">
              <span>Total estimado</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="summary-disclaimer">
              El negocio confirmará disponibilidad, entrega y precio final por
              WhatsApp.
            </p>
            <a
              className="button button-whatsapp"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> Enviar pedido por WhatsApp
            </a>
            <p className="privacy-note">
              Tu pedido no se guarda en el servidor.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
