"use client";
import { Suspense, useMemo, useState } from "react";
import { HeartIcon, HeartOffIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { CatalogoProductCard } from "@/components/catalogo-product-card";
import { useStore } from "@/components/store-provider";

type SortOrder = "catalog" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

function CatalogoContent() {
  const { favorites, perfumes, perfumesLoading, perfumesError, reload } = useStore();
  const searchParams = useSearchParams();
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [brand, setBrand] = useState("Todas");
  const [gender, setGender] = useState("Todos");
  const [family, setFamily] = useState("Todas");
  const [stock, setStock] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState("150");
  const [sortOrder, setSortOrder] = useState<SortOrder>("catalog");
  const brands = [...new Set(perfumes.map((p) => p.brand).filter(Boolean))];
  const families = [...new Set(perfumes.map((p) => p.family?.trim()).filter(Boolean))].sort();
  const list = useMemo(
    () => {
      const filtered = perfumes.filter(
        (p) =>
          (!onlyFavorites || favorites.includes(p.id)) &&
          `${p.name}`.toLowerCase().includes(search.toLowerCase()) &&
          (brand === "Todas" || p.brand === brand) &&
          (gender === "Todos" || p.gender === gender) &&
          (family === "Todas" || (p.family?.trim() || "") === family) &&
          (stock === "Todos" ||
            (stock === "Disponibles" ? p.stock > 0 : p.stock === 0)) &&
          Number(p.price) <= Number(maxPrice),
      );

      if (sortOrder === "catalog") return filtered;

      return [...filtered].sort((a, b) => {
        if (sortOrder === "price-asc") return a.price - b.price;
        if (sortOrder === "price-desc") return b.price - a.price;

        const nameOrder = a.name.localeCompare(b.name, "es", {
          sensitivity: "base",
        });
        return sortOrder === "name-asc" ? nameOrder : -nameOrder;
      });
    },
    [
      search,
      brand,
      gender,
      family,
      stock,
      maxPrice,
      sortOrder,
      onlyFavorites,
      favorites,
      perfumes,
    ],
  );
  const reset = () => {
    setOnlyFavorites(false);
    setSearch("");
    setBrand("Todas");
    setGender("Todos");
    setFamily("Todas");
    setStock("Todos");
    setMaxPrice("150");
    setSortOrder("catalog");
  };
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtersContent = (
    <>
      <h3>Refinar selección</h3>
      <label>
        Género
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          {["Todos", "Mujer", "Hombre", "Unisex"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Familia olfativa
        <select value={family} onChange={(e) => setFamily(e.target.value)}>
          <option>Todas</option>
          {families.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Disponibilidad
        <select value={stock} onChange={(e) => setStock(e.target.value)}>
          {["Todos", "Disponibles", "Agotados"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Ordenar por
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        >
          <option value="catalog">Orden del catálogo</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
        </select>
      </label>
      <label>
        Precio máximo <strong>${maxPrice}</strong>
        <input
          className="range"
          type="range"
          min="30"
          max="150"
          step="5"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <span className="filter-caption">$30 — $150 USD</span>
      </label>
    </>
  );

  return (
    <div className="page-shell">
      <div className="page-heading">
        <h1>
          {onlyFavorites ? "Tus favoritos" : "Encuentra tu "}
          <em>{onlyFavorites ? "selección" : "fragancia."}</em>
        </h1>
        <p>Explora aromas para cada personalidad, ocasión y momento.</p>
      </div>
      <div className="catalog-toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
          />
          <span>{list.length} resultados</span>
        </label>
        <div className="catalog-toolbar-actions">
          <button
            className={
              onlyFavorites ? "filter-reset active-filter" : "filter-reset"
            }
            onClick={() => setOnlyFavorites((v) => !v)}
          >
            {onlyFavorites ? (
              <>
                <HeartOffIcon size={18} /> Ver todo
              </>
            ) : (
              <>
                <HeartIcon size={18} /> Solo favoritos
              </>
            )}
          </button>
          <button
            className="filter-reset filter-toggle-btn"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal size={15} /> Filtros
          </button>
          <button className="filter-reset" onClick={reset}>
            <SlidersHorizontal size={15} /> Limpiar filtros
          </button>
        </div>
      </div>
<div className="catalog-layout">
        <aside className="filters">{filtersContent}</aside>
        <div className="catalog-results">
          {perfumesLoading ? (
            <div className="product-grid" aria-busy="true" aria-label="Cargando perfumes">
              {Array.from({ length: 8 }, (_, i) => (
                <div className="product-skeleton-card" key={i} aria-hidden="true">
                  <div className="product-skeleton-image" />
                  <div className="product-skeleton-line" />
                  <div className="product-skeleton-line product-skeleton-line-short" />
                </div>
              ))}
            </div>
          ) : perfumesError ? (
            <div className="empty-state" role="alert">
              <h2>No pudimos cargar los perfumes.</h2>
              <p>{perfumesError}</p>
              <button className="button button-dark" onClick={() => void reload()}>
                Intentar de nuevo
              </button>
            </div>
          ) : list.length ? (
            <div className="product-grid">
              {list.map((p) => (
                <CatalogoProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No encontramos ese aroma.</h2>
              <p>Prueba con otra búsqueda o elimina alguno de los filtros.</p>
              <button className="button button-dark" onClick={reset}>
                Ver todos los perfumes
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`filters-drawer${filtersOpen ? " filters-drawer-open" : ""}`}
        aria-hidden={!filtersOpen}
      >
        <div className="filters-drawer-header">
          <h3>Refinar selección</h3>
          <button
            className="filters-drawer-close"
            onClick={() => setFiltersOpen(false)}
            aria-label="Closing filters"
          >
            <X size={18} />
          </button>
        </div>
        <div className="filters-drawer-body">
          <label>
            Género
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              {["Todos", "Mujer", "Hombre", "Unisex"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Familia olfativa
            <select value={family} onChange={(e) => setFamily(e.target.value)}>
              <option>Todas</option>
              {families.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Disponibilidad
            <select value={stock} onChange={(e) => setStock(e.target.value)}>
              {["Todos", "Disponibles", "Agotados"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Ordenar por
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="catalog">Orden del catálogo</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
            </select>
          </label>
          <label>
            Precio máximo <strong>${maxPrice}</strong>
            <input
              className="range"
              type="range"
              min="30"
              max="150"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <span className="filter-caption">$30 — $150 USD</span>
          </label>
        </div>
      </div>
      {filtersOpen && (
        <div
          className="filters-drawer-backdrop"
          onClick={() => setFiltersOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default function Catalogo() {
  return (
    <Suspense fallback={
      <div className="page-shell">
        <div className="product-grid" aria-busy="true" aria-label="Cargando catálogo">
          {Array.from({ length: 8 }, (_, i) => (
            <div className="product-skeleton-card" key={i} aria-hidden="true">
              <div className="product-skeleton-image" />
              <div className="product-skeleton-line" />
              <div className="product-skeleton-line product-skeleton-line-short" />
            </div>
          ))}
        </div>
      </div>
    }>
      <CatalogoContent />
    </Suspense>
  );
}