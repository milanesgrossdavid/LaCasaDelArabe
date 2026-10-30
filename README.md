# Maison de Parfum — starter visual

Starter de tienda de perfumes con Next.js, TypeScript y Tailwind CSS. Contiene datos de ejemplo, catálogo con filtros, fichas, favoritos y carrito guardados localmente, guía de elección y pedido por WhatsApp.

## Requisitos
- Node.js 20.9 o posterior recomendado
- npm

## Instalación
```bash
npm install
npm run dev
```
Abre http://localhost:3000.

## Antes de publicar
1. Cambia `Maison de Parfum` por el nombre real en `src/lib/data.ts` y el wordmark de `src/components/header.tsx` y `src/components/footer.tsx`.
2. Cambia `business.whatsapp` por el número real en formato internacional, solo dígitos y sin `+` ni espacios.
3. Sustituye precios, disponibilidad, descripciones y fotografías de ejemplo por datos reales. Los enlaces de fotos actuales son imágenes externas de muestra.
4. Actualiza `metadataBase` en `src/app/layout.tsx` cuando tengas dominio.
5. Esta versión NO conecta a base de datos y no valida stock contra un servidor. La disponibilidad se simula con `src/lib/data.ts`; antes de vender en producción hay que conectar Supabase y validar stock en el servidor.

## Páginas
- `/` portada
- `/catalogo` catálogo y filtros
- `/perfume/vanilla-amber` ficha de ejemplo
- `/pedido` carrito / WhatsApp
- `/guia` selector de fragancias
- `/nosotros` historia y contacto

## Pruebas
```bash
npm run build
```
