"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("storage-notice-dismissed");
    if (!dismissed) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("storage-notice-dismissed", "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        zIndex: "9999",
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.1)",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: "1 1 400px" }}>
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
            Preferencias en este dispositivo
          </h3>
          <p style={{ color: "var(--text-soft)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Guardamos el carrito, tus favoritos y el tema visual en el almacenamiento local de tu navegador. No son cookies y puedes borrarlos desde la configuración del navegador.
            <Link href="/cookies" style={{ color: "var(--gold)", textDecoration: "underline", marginLeft: "0.3rem" }}>
              Más información
            </Link>
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          <button
            onClick={dismiss}
            className="button button-dark"
            style={{ padding: "0.7rem 1.5rem" }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
