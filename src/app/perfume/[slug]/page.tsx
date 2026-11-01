import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { business, money } from "@/lib/business";
import { getPublicPerfumes, getRelatedPerfumes } from "@/lib/public-data";
import { CatalogoProductCard } from "@/components/catalogo-product-card";
import { ProductActions } from "@/components/product-actions";
import { ImageZoom } from "@/components/image-zoom";
export async function generateStaticParams() {
  const perfumes = await getPublicPerfumes();
  return perfumes.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const perfumes = await getPublicPerfumes();
  const p = perfumes.find((x) => x.slug === slug);
  return p
    ? {
        title: `${p.name} — ${p.brand}`,
        description: p.description,
        openGraph: {
          title: `${p.name} | ${p.brand}`,
          description: p.description,
          images: [p.image],
        },
      }
    : { title: "Perfume no encontrado" };
}

async function RelatedProducts({ productId }: { productId: string }) {
  const perfumes = await getRelatedPerfumes(productId);

  if (perfumes === null) {
    return (
      <p className="featured-message" role="status">
        No pudimos cargar las recomendaciones. Puedes explorar el{" "}
        <Link href="/catalogo">catálogo completo</Link>.
      </p>
    );
  }

  if (perfumes.length === 0) {
    return (
      <p className="featured-message">
        No hay otros perfumes disponibles por el momento.
      </p>
    );
  }

  return (
    <div className="product-grid">
      {perfumes.map((perfume) => (
        <CatalogoProductCard key={perfume.id} product={perfume} />
      ))}
    </div>
  );
}

function RelatedProductsFallback() {
  return (
    <div
      className="product-grid"
      aria-busy="true"
      aria-label="Cargando recomendaciones"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <div className="product-skeleton-card" key={i} aria-hidden="true">
          <div className="product-skeleton-image" />
          <div className="product-skeleton-line" />
          <div className="product-skeleton-line product-skeleton-line-short" />
        </div>
      ))}
    </div>
  );
}

export default async function PerfumePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const perfumes = await getPublicPerfumes();
  const p = perfumes.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <div className="page-shell">
      <Link className="back-link" href="/catalogo">
        <ArrowLeft size={15} /> Volver al catálogo
      </Link>
      <section className="product-detail">
        <div className="detail-gallery">
          <div className="detail-main-image" style={{ position: "relative" }}>
            <ImageZoom src={p.image} alt={p.name} />
            <span className="detail-image-label">
              La Casa Del Arabe · Perfumeria
            </span>
          </div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            {p.brand} / {p.family}
          </p>
          <h1>{p.name}</h1>
          <p className="detail-subtitle">
            {p.gender} · {p.size} ml 
          </p>
          <div className="detail-price">{money(p.price)}</div>
          <p className="detail-description">{p.description}</p>
          <div className="stock-line">
            <span className={p.stock > 0 ? "stock-dot" : "stock-dot sold"} />
            {p.stock > 0
              ? `Disponible · ${p.stock} unidades disponibles`
              : "Agotado temporalmente"}
          </div>
          <ProductActions id={p.id} stock={p.stock} />
          <a
            className="button button-outline detail-whatsapp"
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hola, quisiera consultar por ${p.name} (${p.size} ml).`)}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> Consultar por WhatsApp
          </a>
          <div className="detail-specs">
            <div>
              <span>Familia olfativa</span>
              <strong>{p.family}</strong>
            </div>
            <div>
              <span>Género</span>
              <strong>{p.gender}</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="notes-section">
        <p className="eyebrow">LA COMPOSICIÓN</p>
        <h2>
          Una historia en <em>tres actos.</em>
        </h2>
        <br></br>
        <div className="notes-pyramid">
          {[
            {
              label: "01 / SALIDA",
              title: "La primera impresión",
              items: p.notes.top,
            },
            {
              label: "02 / CORAZÓN",
              title: "El carácter",
              items: p.notes.heart,
            },
            { label: "03 / FONDO", title: "La huella", items: p.notes.base },
          ].map((n) => (
            <div className="note-block" key={n.label}>
              <span>{n.label}</span>
              <h3>{n.title}</h3>
              <p>{n.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section related-section">
        <div className="section-heading">
          <div>
            <h2>
              También te puede <em>enamorar.</em>
            </h2>
          </div>
          <Link href="/catalogo" className="text-link">
            Ver catálogo <ArrowRight size={16} />
          </Link>
        </div>
        <Suspense fallback={<RelatedProductsFallback />}>
          <RelatedProducts productId={p.id} />
        </Suspense>
      </section>
    </div>
  );
}
