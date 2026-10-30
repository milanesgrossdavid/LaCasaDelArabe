"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Plus, Save, Trash2, Upload, ExternalLink, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Row = {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  gender: string;
  family: string;
  size_ml: number;
  price: number;
  images: string[];
  stock: number;
  featured: boolean;
  published?: boolean;
  is_new: boolean;
  notes: { top: string[]; heart: string[]; base: string[] };
  intensity: string;
  occasions: string[];
  season: string[];
};
const blank: Row = {
  slug: "",
  name: "",
  brand: "",
  description: "",
  gender: "Unisex",
  family: "Amaderada",
  size_ml: 100,
  price: 50,
  images: [],
  stock: 7,
  featured: false,
  is_new: false,
  notes: { top: [], heart: [], base: [] },
  intensity: "Moderada",
  occasions: [],
  season: [],
};
const csv = (v: string) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
export default function AdminPerfumesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row>(blank);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("perfumes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setMessage(error.message);
    else setRows((data ?? []) as Row[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);
  function startNew() {
    setForm({ ...blank, notes: { top: [], heart: [], base: [] } });
    setEditing(false);
    setMessage("");
  }
  function edit(row: Row) {
    setForm({ ...row, notes: row.notes ?? { top: [], heart: [], base: [] } });
    setEditing(true);
    setMessage("");
  }
  function update<K extends keyof Row>(key: K, value: Row[K]) {
    setForm((old) => ({ ...old, [key]: value }));
  }
  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Selecciona un archivo de imagen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("La imagen debe pesar menos de 5 MB.");
      return;
    }
    setBusy(true);
    setMessage("Subiendo fotografía…");
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      update("images", [...form.images, data.publicUrl]);
      setMessage(
        "Fotografía subida. Guarda el perfume para conservar los cambios.",
      );
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "No se pudo subir la imagen.",
      );
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      brand: "",
      description: form.description,
      gender: form.gender,
      family: form.family,
      size_ml: Number(form.size_ml),
      price: Number(form.price),
      images: form.images,
      stock: Number(form.stock),
      featured: form.featured,
      is_new: form.is_new,
      notes: form.notes,
      intensity: form.intensity,
      occasions: form.occasions,
      season: form.season,
      updated_at: new Date().toISOString(),
    };
    try {
      const query =
        editing && form.id
          ? supabase.from("perfumes").update(payload).eq("id", form.id)
          : supabase.from("perfumes").insert(payload);
      const { error } = await query;
      if (error) throw error;
      setMessage("Perfume guardado correctamente.");
      await load();
      startNew();
    } catch (err) {
      const message =
        (err as { message?: string } | null)?.message ??
        "No se pudo guardar. Revisa las políticas RLS y que owner_id esté configurado.";
      setMessage(message);
    } finally {
      setBusy(false);
    }
  }
  async function toggleStock(row: Row) {
    const next = row.stock > 0 ? 0 : 1;
    const { error } = await supabase
      .from("perfumes")
      .update({ stock: next, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) setMessage(error.message);
    else
      setRows((old) =>
        old.map((p) => (p.id === row.id ? { ...p, stock: next } : p)),
      );
  }
  async function remove(row: Row) {
    if (
      !row.id ||
      !confirm(
        `¿Eliminar definitivamente “${row.name}”? Para ocultarlo normalmente, cambia su stock a cero.`,
      )
    )
      return;
    const { error } = await supabase.from("perfumes").delete().eq("id", row.id);
    if (error) setMessage(error.message);
    else {
      setRows((old) => old.filter((p) => p.id !== row.id));
      if (form.id === row.id) startNew();
      setMessage("Perfume eliminado.");
    }
  }
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }
  const visible = rows.filter((p) =>
    `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="admin-shell admin-wide">
      <header className="admin-top">
        <div>
          <h1>Perfumes</h1>
          <p className="muted">
            Gestiona productos, precios, fotografías y disponibilidad.
          </p>
        </div>
        <div className="admin-top-actions">
          <Link href="/" className="button button-outline">
            <ExternalLink size={16} /> Ver tienda
          </Link>
          <Link href="/admin/announcement" className="button button-outline">
            <Megaphone size={16} /> Anuncios
          </Link>
          <button className="button button-outline" onClick={signOut}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      <div className="admin-grid">
        <section className="panel-card">
          <div className="admin-section-heading">
            <h2>{editing ? "Editar perfume" : "Nuevo perfume"}</h2>
            <button
              type="button"
              className="button button-outline"
              onClick={startNew}
            >
              <Plus size={16} /> Nuevo
            </button>
          </div>
          <form className="admin-form" onSubmit={save}>
            <div className="admin-two">
              <label>
                Nombre
                <input
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    update("name", name);
                    update(
                      "slug",
                      name
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    );
                  }}
                />
              </label>
            </div>
            <label>
              Slug de URL
              <input
                required
                value={form.slug}
                onChange={(e) =>
                  update(
                    "slug",
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  )
                }
                placeholder="ejemplo-perfume"
              />
            </label>
            <label>
              Descripción
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </label>
            <div className="admin-three">
              <label>
                Precio
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price === 0 ? "" : form.price}
                  onChange={(e) =>
                    update("price", e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </label>
              <label>
                Tamaño (ml)
                <input
                  type="number"
                  min="1"
                  required
                  value={form.size_ml === 0 ? "" : form.size_ml}
                  onChange={(e) =>
                    update("size_ml", e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  required
                  value={form.stock === 0 ? "" : form.stock}
                  onChange={(e) =>
                    update("stock", e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </label>
            </div>
            <div className="admin-two">
              <label>
                Género
                <select
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                >
                  <option>Mujer</option>
                  <option>Hombre</option>
                  <option>Unisex</option>
                </select>
              </label>
              <label>
                Familia olfativa
                <input
                  value={form.family}
                  onChange={(e) => update("family", e.target.value)}
                />
              </label>
            </div>
            <div className="admin-two">
              <label>
                Notas de salida
                <input
                  value={form.notes.top.join(", ")}
                  onChange={(e) =>
                    update("notes", { ...form.notes, top: csv(e.target.value) })
                  }
                />
              </label>
              <label>
                Notas de corazón
                <input
                  value={form.notes.heart.join(", ")}
                  onChange={(e) =>
                    update("notes", {
                      ...form.notes,
                      heart: csv(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <label>
              Notas de fondo
              <input
                value={form.notes.base.join(", ")}
                onChange={(e) =>
                  update("notes", { ...form.notes, base: csv(e.target.value) })
                }
              />
            </label>
            <div className="admin-checks">
              <button
                type="button"
                className={form.featured ? "button button-dark" : "button button-outline"}
                onClick={() => update("featured", !form.featured)}
              >
                Destacado en portada
              </button>
              <button
                type="button"
                className={form.is_new ? "button button-dark" : "button button-outline"}
                onClick={() => update("is_new", !form.is_new)}
              >
                Nuevo
              </button>
            </div>
            <div className="upload-area">
              <div>
                <strong>Fotografías</strong>
                <p className="muted small">
                  JPG, PNG o WebP · máximo 5 MB por archivo.
                </p>
              </div>
              <label className="button button-outline upload-button">
                <Upload size={16} /> Subir foto
                <input type="file" accept="image/*" onChange={upload} hidden />
              </label>
            </div>
            {form.images.length > 0 && (
              <div className="admin-images">
                {form.images.map((src, i) => (
                  <div key={src}>
                    <img src={src} alt={`Foto ${i + 1}`} />
                    <button
                      type="button"
                      aria-label="Eliminar foto"
                      onClick={() =>
                        update(
                          "images",
                          form.images.filter((_, j) => i !== j),
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="admin-form-actions">
              <button
                disabled={busy}
                className="button button-dark"
                type="submit"
              >
                <Save size={16} />
                {busy ? "Guardando…" : "Guardar perfume"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => remove(form)}
                >
                  {" "}
                  <Trash2 size={16} /> Eliminar
                </button>
              )}
            </div>
          </form>
        </section>
        <section className="panel-card admin-list-panel">
          <div className="admin-section-heading">
            <h2>Catálogo ({rows.length})</h2>
          </div>
          <input
            className="admin-search"
            placeholder="Buscar por nombre o marca…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loading ? (
            <p className="muted">Cargando catálogo…</p>
          ) : visible.length === 0 ? (
            <p className="muted">
              No hay perfumes. Añade el primero con el formulario.
            </p>
          ) : (
            <div className="admin-product-list">
              {visible.map((row) => (
                <article key={row.id} className="admin-product-row">
                  <button
                    className="admin-product-main"
                    onClick={() => edit(row)}
                  >
                    {row.images?.[0] ? (
                      <img src={row.images[0]} alt="" />
                    ) : (
                      <span className="admin-thumb-empty">✦</span>
                    )}
                    <span>
                      <strong>{row.name}</strong>
                      <small>
                        {row.brand} · ${Number(row.price).toFixed(2)}
                      </small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={row.stock > 0 ? "button button-dark" : "button button-outline"}
                    onClick={() => toggleStock(row)}
                  >
                    {row.stock > 0 ? "Disponible" : "Agotado"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      <p className="admin-footnote">
        La tienda pública lee los productos desde Supabase cuando las variables
        de entorno están configuradas. Protege la cuenta y no compartas sus
        credenciales.
      </p>
    </div>
  );
}
