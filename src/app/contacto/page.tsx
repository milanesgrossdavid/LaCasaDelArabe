"use client";
import { useState } from "react";
import { MessageCircle, Send, User, Phone } from "lucide-react";
import { business } from "@/lib/business";

export default function ContactoPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hola, mi nombre es ${name}. Teléfono: ${phone}. Mensaje: ${message}`;
    window.open(
      `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  }

  return (
    <div className="page-shell">
      <div className="page-heading">
        <h1>
          Escríbenos por <em>WhatsApp</em>
        </h1>
        <p>Te asesoramos para encontrar tu aroma ideal</p>
      </div>
      <div style={{ maxWidth: "700px", margin: "0 auto", width: "100%" }}>
        <form
          onSubmit={submit}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "clamp(2rem, 5vw, 3.5rem)",
            display: "grid",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500" }}>
              <User size={18} />
              Nombre completo
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                padding: "0.9rem 1.2rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "0.95rem",
              }}
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500" }}>
              <Phone size={18} />
              Teléfono
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                padding: "0.9rem 1.2rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "0.95rem",
              }}
              placeholder="Ej: +53 5XXXXXXX"
            />
          </div>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <label style={{ fontWeight: "500" }}>Mensaje</label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{
                padding: "0.9rem 1.2rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "0.95rem",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              placeholder="¿Qué perfume te interesa o qué necesitas?"
            />
          </div>
          <button
            className="button button-dark"
            type="submit"
            style={{ justifySelf: "center", padding: "0.9rem 2rem" }}
          >
            <Send size={16} /> Enviar por WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
