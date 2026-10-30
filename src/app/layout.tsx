import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { SiteChrome } from "@/components/site-chrome";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BackToTop } from "@/components/back-to-top";
export const metadata: Metadata = {
  title: {
    default: "La Casa Del Arabe | Perfumería ",
    template: "%s | La Casa Del Arabe",
  },
  description:
    "Descubre fragancias seleccionadas para cada momento. Explora perfumes frescos, florales, amaderados y gourmand.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lacasadelarabe.com"),
  openGraph: {
    title: "La Casa Del Arabe",
    description: "Encuentra una fragancia que se sienta tuya.",
    type: "website",
    images: [{ url: "/favicon.svg", width: 64, height: 64, alt: "La Casa Del Arabe" }],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          <SiteChrome>
            {children}
            <ScrollReveal />
            <BackToTop />
          </SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
