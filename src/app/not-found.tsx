import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page-shell" style={{ textAlign: "center", padding: "6rem 1.5rem" }}>
      <p className="eyebrow">ERROR 404</p>
      <h1 style={{ fontSize: "clamp(4rem, 12vw, 10rem)", margin: "1rem 0" }}>404</h1>
      <h2>Página no encontrada</h2>
      <p style={{ margin: "1rem auto 2rem", maxWidth: "420px" }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link className="button button-dark" href="/">
        <Home size={16} /> Volver al inicio
      </Link>
    </div>
  );
}
