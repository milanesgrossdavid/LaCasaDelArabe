import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almacenamiento local y cookies",
  description: "Información sobre almacenamiento local y cookies en el sitio de La Casa Del Arabe",
};

export default function CookiesPage() {
  return (
    <div className="page-shell">
      <div className="page-heading">
        <h1>
          Almacenamiento local <em>y cookies</em>
        </h1>
        <p>Qué información guarda este sitio en tu navegador</p>
      </div>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(2rem, 5vw, 4rem)", display: "grid", gap: "2rem" }}>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>1. Almacenamiento local</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              El catálogo guarda algunas preferencias directamente en el almacenamiento local del navegador (localStorage). No son cookies: no se envían automáticamente al servidor con cada solicitud.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>2. Qué preferencias se guardan</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8", marginBottom: "1rem" }}>
              Se usan para recordar funciones que eliges en este dispositivo:
            </p>
            <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: "620px", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-strong)" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Dato</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Finalidad</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Dónde y cuánto dura</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>perfumeria-cart</td>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>Productos y cantidades del carrito</td>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>Almacenamiento local; hasta que borres los datos del sitio</td>
                  </tr>
                  <tr style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>perfumeria-favorites</td>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>Guarda tus perfumes favoritos</td>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>Almacenamiento local; hasta que borres los datos del sitio</td>
                  </tr>
                  <tr style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>theme</td>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>Recuerda el tema claro u oscuro</td>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>Almacenamiento local; hasta que borres los datos del sitio</td>
                  </tr>
                  <tr style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>storage-notice-dismissed</td>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>Recuerda que ya viste este aviso</td>
                    <td style={{ padding: "1rem", color: "var(--text-soft)" }}>Almacenamiento local; hasta que borres los datos del sitio</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>3. Cookies y servicios externos</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              El catálogo público no usa cookies propias de análisis ni publicidad. El panel privado de administración usa cookies de autenticación de Supabase para mantener la sesión del administrador. Si continúas a WhatsApp, ese servicio puede usar sus propias tecnologías según sus políticas.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>4. Cómo borrar estos datos</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              Puedes borrar el almacenamiento local desde la configuración de privacidad de tu navegador, eliminando los datos de este sitio. Al hacerlo se borrarán también el carrito, los favoritos y el tema guardado.
            </p>
          </section>
          <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border)", color: "var(--text-soft)", fontSize: "0.9rem" }}>
            Última actualización: Octubre 2026
          </div>
        </div>
      </div>
    </div>
  );
}
