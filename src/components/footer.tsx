import Link from "next/link";
import { Clock3, Facebook, Instagram, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { business } from "@/lib/business";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link href="/" className="wordmark footer-wordmark">
            <span className="wordmark-main">La Casa</span>
            <span className="wordmark-sub">DEL ARABE · PERFUMERÍA</span>
          </Link>
          <p>El arte de encontrar un aroma que se sienta tuyo.</p>
        </div>
        <div>
          <h3>Legal</h3>
          <Link href="/aviso-legal">Aviso Legal</Link>
          <Link href="/privacidad">Política de Privacidad</Link>
          <Link href="/cookies">Política de Cookies</Link>
        </div>
        <div>
          <h3>Visítanos</h3>
          <p>
            <MapPin size={20} /> {business.address}
          </p>
          <br />
          
          <p> <Clock3 size={14} /> {business.hours}</p>
          <br />
          <p>  <PhoneCall size={14} />
           {business.phone}</p>
          <br />
          <div className="footer-social">
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} /> WhatsApp
            </a>
            {business.instagram && (
              <a href={business.instagram} target="_blank" rel="noreferrer">
                <Instagram size={17} /> Instagram
              </a>
            )}
            <a
              href="https://www.facebook.com/erick.marin.945041"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook size={17} /> Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} La Casa Del Arabe</span>
      </div>
    </footer>
  );
}
