import type { Metadata } from "next";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso legal de La Casa Del Arabe",
};

export default function AvisoLegalPage() {
  return (
    <div className="page-shell">
      <div className="page-heading">
        <h1>
          Aviso <em>Legal</em>
        </h1>
        <p>Condiciones generales de uso del sitio web</p>
      </div>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(2rem, 5vw, 4rem)", display: "grid", gap: "2rem" }}>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>1. Identificación del titular</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              En cumplimiento con el deber de información, se informa que el titular de este sitio web es <strong>{business.name}</strong>, con domicilio en {business.address}. 
              Contacto: {business.phone} / WhatsApp: +{business.whatsapp}.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>2. Objeto</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              El presente sitio web tiene como finalidad dar a conocer la actividad comercial de {business.name}, dedicada a la venta y distribución de fragancias y perfumes, así como facilitar el contacto con los clientes.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>3. Condiciones de Uso</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              El acceso y navegación por este sitio web atribuye la condición de usuario, implicando la aceptación plena y sin reservas de todas las cláusulas incluidas en este Aviso Legal. 
              Las compras se realizan exclusivamente mediante contacto directo a través de WhatsApp, sin proceso de pago online integrado.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>4. Propiedad Intelectual e Industrial</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño gráfico) son propiedad de {business.name} o cuentan con los derechos correspondientes. 
              Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>5. Exclusión de Responsabilidad</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              {business.name} no se hace responsable de los errores u omisiones en los contenidos, ni de los daños derivados del uso del sitio web. 
              La información de productos puede estar sujeta a cambios sin previo aviso.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>6. Legislación Aplicable</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              El presente Aviso Legal se rige por la legislación vigente. Para cualquier controversia, las partes se someterán a los juzgados y tribunales que correspondan.
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
