# Conectar Supabase y panel de administración

## 1. Crear proyecto y variables
1. Crea un proyecto en Supabase.
2. En Project Settings > API copia Project URL y la publishable/anon key.
3. En la raíz del proyecto, copia `.env.example` como `.env.local` y rellena ambas variables.
4. Reinicia `npm run dev` después de cambiar las variables.

## 2. Crear las tablas y permisos
1. En Supabase > SQL Editor abre `supabase/schema.sql` y ejecútalo completo.
2. En Authentication > Users crea/invita la cuenta del propietario.
3. Copia el UUID del usuario y ejecuta en SQL Editor (sustituye el valor):
   `update public.app_settings set owner_id = 'UUID-REAL-DEL-DUENO' where id = 1;`
4. Configura el correo saliente de Supabase Auth para recuperación de contraseña cuando estés listo para producción.

## 3. Arrancar
```bash
npm install
npm run dev
```
- Tienda: http://localhost:3000
- Panel: http://localhost:3000/admin
- Acceso: http://localhost:3000/admin/login

## 4. Fotografías
El panel sube imágenes a Storage, bucket `product-images`. El límite del formulario es 5 MB. Para producción conviene añadir compresión en el navegador (WebP) antes de subir; este starter valida tipo y tamaño, pero no transforma aún el archivo.

## 5. Modelo 3D
La portada contiene un frasco 3D generado con geometría de Three.js, que gira en bucle y muestra ambos lados. Es un modelo genérico de demostración, no una reconstrucción exacta del producto real. Cuando el negocio elija un frasco, se puede modelar con sus proporciones, etiqueta y reverso reales.

## 6. Importante antes de publicar
- Cambia `Maison de Parfum`, el número de WhatsApp, textos y precios de ejemplo en `src/lib/data.ts`.
- Cambia `metadataBase` en `src/app/layout.tsx` al dominio real.
- La política pública permite leer productos publicados, incluso agotados, para que la tienda pueda mostrar la etiqueta “Agotado”; solo la cuenta propietaria puede modificarlos.
- El checkout sigue siendo una consulta por WhatsApp: no hay pago ni persistencia del pedido.
- Ejecuta `npm run build` y prueba login, RLS y carga de imágenes antes de desplegar.
