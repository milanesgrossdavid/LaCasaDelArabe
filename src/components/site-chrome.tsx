"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { CookieBanner } from "@/components/cookie-banner";
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const admin = path.startsWith("/admin");
  return (
    <>
      {!admin && <Header />}
      <main>{children}</main>
      {!admin && (
        <>
          <Footer />
          <WhatsAppFloat />
          <CookieBanner />
        </>
      )}
    </>
  );
}
