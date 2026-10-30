"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [setup, setSetup] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSetup(params.has("setup"));
    setUnauthorized(params.has("unauthorized"));
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/admin/perfumes";
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-shell">
      <div className="admin-login panel-card">
        <Link href="/" className="admin-back">
          ← Volver a la tienda
        </Link>
        <h1>Administrar la tienda</h1>
        {unauthorized && (
          <p className="notice">
            Esta cuenta no tiene permisos de propietario para administrar la
            tienda.
          </p>
        )}
        <form onSubmit={submit} className="admin-form">
          <label>
            Correo electrónico
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="button button-dark" disabled={busy}>
            {busy ? "Entrando…" : "Iniciar sesión"}
          </button>
          {message && <p className="form-error">{message}</p>}
        </form>
        
      </div>
    </div>
  );
}
