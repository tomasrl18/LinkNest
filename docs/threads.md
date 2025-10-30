# Threads (Hilos de enlaces)

Agrupa varios enlaces en un hilo temático, tipo mini colección o cronología. Ejemplo: “Aprender Next.js” → incluye artículos, vídeos y repos. Visualización tipo cronología (timeline) o tarjetas apiladas.

## Esquema de base de datos (Supabase)

Ejecuta el SQL `supabase/schema/threads.sql` en el editor de Supabase. Crea:

- Tabla `threads` con RLS (visibles por su propietario o públicas)
- Tabla `thread_links` para asociar enlaces a hilos con orden (`position`)
- Políticas RLS para que sólo el propietario gestione su hilo

## Rutas de la app

- Listado de hilos: `/threads`
- Crear hilo: `/threads/new`
- Detalle del hilo: `/threads/:id` (cambia entre “Cronología” y “Tarjetas apiladas”)

## Notas de implementación

- Tipos: `frontend/src/types/thread.ts`
- Servicios: `frontend/src/lib/threads.service.ts`
- Hooks: `frontend/src/hooks/useThreads.ts`, `frontend/src/hooks/useThread.ts`
- Páginas: `frontend/src/pages/Threads/*`
- Componentes: `frontend/src/components/threads/*`

