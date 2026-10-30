import type { Metadata } from "next";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de La Casa Del Arabe",
};

export default function PrivacidadPage() {
  return (
    <div className="page-shell">
      <div className="page-heading">
        <h1>
          Política de <em>Privacidad</em>
        </h1>
        <p>Protección y tratamiento de tus datos personales</p>
      </div>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(2rem, 5vw, 4rem)", display: "grid", gap: "2rem" }}>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>1. Quién somos</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              {business.name}, con domicilio en {business.address}, atiende las consultas de la tienda. Puedes contactarnos por WhatsApp al {business.phone}.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>2. Información que maneja el sitio</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8", marginBottom: "1rem" }}>
              El sitio no tiene una cuenta de cliente ni envía los pedidos a una base de datos. Para recordar tu selección y tus preferencias en este dispositivo, guarda en el almacenamiento local del navegador:
            </p>
            <ul style={{ color: "var(--text-soft)", lineHeight: "1.8", display: "grid", gap: "0.5rem", paddingLeft: "1.5rem" }}>
              <li>Los productos y cantidades del carrito.</li>
              <li>Tus perfumes favoritos y la preferencia de tema claro u oscuro.</li>
              <li>La confirmación de que ya viste el aviso de almacenamiento.</li>
            </ul>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8", marginTop: "1rem" }}>
              Esta información permanece en el navegador hasta que la borres o limpies sus datos del sitio. El catálogo público se carga desde Supabase; el acceso al panel privado de administración usa su servicio de autenticación.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>3. Pedidos y contacto por WhatsApp</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              Al preparar un pedido o completar el formulario de contacto, el sitio crea un mensaje con los datos que escribiste y abre WhatsApp. No se envía hasta que tú lo confirmes y envíes desde WhatsApp. Si lo haces, WhatsApp/Meta y {business.name} recibirán la información incluida en el mensaje y la tratarán conforme a sus propias políticas. No se realizan pagos ni se confirma la compra desde este sitio.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>4. Conservación y control</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              Puedes borrar el carrito, los favoritos y otras preferencias desde el navegador limpiando los datos del sitio. Los mensajes enviados por WhatsApp quedan sujetos a las opciones de conservación y eliminación de WhatsApp y del negocio; el sitio no conserva una copia del pedido en un servidor.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>5. Consultas</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              Si tienes dudas sobre la información que nos enviaste por WhatsApp o quieres solicitar su actualización o eliminación, escríbenos al {business.phone}. Las solicitudes se atenderán conforme a la normativa aplicable.
            </p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>6. Revisión legal</h2>
            <p style={{ color: "var(--text-soft)", lineHeight: "1.8" }}>
              Esta información describe las funciones actuales del sitio y no sustituye asesoría legal. Debe revisarse según la legislación aplicable al lugar donde opera la tienda.
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
