"use client";
import Link from "next/link";
import { Heart, Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store-provider";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const { cart, favorites } = useStore();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [messages, setMessages] = useState<string[]>([]);
  const [announcementActive, setAnnouncementActive] = useState(false);
  const count = cart.reduce((n, x) => n + x.quantity, 0);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const t = saved || "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("announcement")
          .select("active, messages")
          .eq("id", 1)
          .maybeSingle();
        if (mounted) {
          if (!error && data) {
            setMessages(
              Array.isArray(data.messages) && data.messages.length > 0
                ? data.messages
                : [],
            );
            setAnnouncementActive(!!data.active);
          } else {
            setMessages([]);
            setAnnouncementActive(false);
          }
        }
      } catch {
        if (mounted) {
          setMessages([]);
          setAnnouncementActive(false);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <header className="site-header">
      {announcementActive && (
        <div className="announcement" role="region" aria-label="Avisos de la tienda">
          <div className="announcement-track">
            {[false, true].map((duplicate) => (
              <div
                className="announcement-group"
                key={duplicate ? "duplicate" : "original"}
                aria-hidden={duplicate}
              >
                {messages.map((msg) => (
                  <span className="announcement-phrase" key={msg}>
                    {msg}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="nav-wrap">
        <Link href="/" className="wordmark" prefetch={false} onClick={() => setOpen(false)}>
          <span className="wordmark-main">LA CASA</span>
          <span className="wordmark-sub">DEL ARABE · PERFUMERÍA</span>
        </Link>
        <nav className={open ? "nav-links nav-open" : "nav-links"}>
          <Link href="/catalogo" onClick={() => setOpen(false)}>
            Catálogo
          </Link>
          <Link href="/guia" onClick={() => setOpen(false)}>
            Encuentra tu perfume
          </Link>
          <Link href="/nosotros" onClick={() => setOpen(false)}>
            Nosotros
          </Link>
          <Link href="/contacto" onClick={() => setOpen(false)}>
            Contacto
          </Link>
        </nav>
        <div className="nav-actions">
          <button aria-label="Tema" className="icon-link" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <Link aria-label="Pedido" href="/pedido" className="icon-link">
            <ShoppingBag size={19} />
            <span className="count">{count}</span>
          </Link>
          <button
            className="mobile-menu"
            aria-label="Abrir menú"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
