"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Plus, Save, Trash2, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Row = {
  id?: number;
  active: boolean;
  messages: string[];
};
const blank: Row = { active: false, messages: [] };
export default function AdminAnnouncementPage() {
  const [row, setRow] = useState<Row>(blank);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcement")
      .select("active, messages")
      .eq("id", 1)
      .maybeSingle();
    if (error) setMessage(error.message);
    else if (data) {
      setRow({
        id: 1,
        active: !!data.active,
        messages: Array.isArray(data.messages) ? [...data.messages] : [],
      });
    } else setRow({ ...blank });
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);
  function toggleActive() {
    setRow((old) => ({ ...old, active: !old.active }));
    setMessage("");
  }
  function setMessageText(index: number, value: string) {
    setRow((old) => {
      const next = [...old.messages];
      next[index] = value;
      return { ...old, messages: next };
    });
    setMessage("");
  }
  function addMessage() {
    setRow((old) => ({ ...old, messages: [...old.messages, ""] }));
    setMessage("");
  }
  function removeMessage(index: number) {
    setRow((old) => {
      const next = [...old.messages];
      next.splice(index, 1);
      return { ...old, messages: next };
    });
    setMessage("");
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const payload = {
      active: row.active,
      messages: row.messages.filter((m) => m.trim().length > 0),
      updated_at: new Date().toISOString(),
    };
    try {
      const { error } = await supabase
        .from("announcement")
        .upsert({ id: 1, ...payload }, { onConflict: "id" });
      if (error) throw error;
      setMessage("Anuncio guardado correctamente.");
      await load();
    } catch (err) {
      setMessage(
        (err as { message?: string } | null)?.message ??
          "No se pudo guardar. Revisa las políticas RLS y que owner_id esté configurado.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }
  return (
    <div className="admin-shell admin-wide">
      <header className="admin-top">
        <div>
          <h1>Anuncio de la barra superior</h1>
          <p className="muted">
            Edita los mensajes que se muestran en el anuncio deslizante de la
            tienda pública.
          </p>
        </div>
        <div className="admin-top-actions">
          <Link href="/" className="button button-outline">
            <span>Ver tienda</span>
          </Link>
          <Link href="/admin/perfumes" className="button button-outline">
            <LayoutDashboard size={16} /> Perfumes
          </Link>
          <button className="button button-outline" onClick={signOut}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>
      {message && (
        <p className="notice" role="status">{message}</p>
      )}
      <div className="admin-grid">
        <section className="panel-card">
          <div className="admin-section-heading">
            <h2>Configuración del anuncio</h2>
          </div>
          <form className="admin-form" onSubmit={save}>
            <div
              className="toggle-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  onClick={toggleActive}
                  className={`button ${row.active ? "button-dark" : "button-outline"} toggle-button`}
                  style={{
                    padding: "6px 14px",
                    fontSize: 14,
                    borderRadius: 20,
                  }}
                >
                  {row.active ? "Activado" : "Desactivado"}
                </button>
                <span className="muted" style={{ fontSize: 13 }}>
                  Mostrar en la tienda pública
                </span>
              </div>
              <span
                className={`status-pill ${row.active ? "active" : "inactive"}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  background: row.active ? "#dcfce7" : "#fee2e2",
                  color: row.active ? "#166534" : "#991b1b",
                  border: row.active ? "1px solid #bbf7d0" : "1px solid #fecaca",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: row.active ? "#22c55e" : "#ef4444",
                    display: "inline-block",
                  }}
                />
                {row.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="admin-section-heading">
              <h2>Mensajes ({row.messages.length})</h2>
            </div>
            <div className="messages-list" style={{ marginBottom: 20 }}>
              {row.messages.map((m, i) => (
                <div
                  key={i}
                  className="message-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 12,
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    background: "#fff",
                    marginBottom: 8,
                  }}
                >
                  <span
                    className="message-number"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#f3f4f6",
                      color: "#374151",
                      fontSize: 13,
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <input
                    className="message-input"
                    value={m}
                    onChange={(e) => setMessageText(i, e.target.value)}
                    placeholder="Texto del anuncio"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: 14,
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    className="remove-message"
                    onClick={() => removeMessage(i)}
                    title="Eliminar mensaje"
                    style={{
                      padding: 6,
                      color: "#ef4444",
                      background: "none",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {row.messages.length === 0 && (
                <p className="muted" style={{ padding: 12, textAlign: "center" }}>
                  Añade al menos un mensaje para mostrar el anuncio.
                </p>
              )}
            </div>
            <div
              className="add-row"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: 20,
              }}
            >
              <button type="button" className="button button-outline" onClick={addMessage} style={{ padding: "8px 14px" }}>
                <Plus size={16} /> Añadir mensaje
              </button>
            </div>
            <div className="admin-form-actions">
              <button disabled={busy} className="button button-dark" type="submit" style={{ padding: "10px 20px" }}>
                <Save size={16} />
                {busy ? "Guardando…" : "Guardar anuncio"}
              </button>
            </div>
          </form>
        </section>
      </div>
      <p className="admin-footnote">
        Los cambios se reflejan en la tienda pública inmediatamente. Solo el
        propietario de la tienda puede editar el anuncio.
      </p>
    </div>
  );
}
