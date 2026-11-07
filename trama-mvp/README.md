# Trama — MVP

Trama es una herramienta para los departamentos de cumplimiento de marcas de lujo y de sus fabricantes principales.
Cada mes compara el trabajo que la marca encarga a un taller con las horas que ese taller cotiza a la Seguridad Social.
Si no cuadra, avisa con un semáforo (verde / ámbar / rojo) y abre un plan de corrección que protege a los trabajadores de toda la cadena.

> Demo con datos ficticios: todas las empresas, talleres, personas y cifras son inventadas.

## Requisitos

- Node.js 22.12 o superior (lo exige Vitest 5)
- npm

## Instalación y ejecución local

```bash
npm install
npm run dev        # http://localhost:3000 (redirige a /panel)
```

Otros scripts:

| Script          | Qué hace                                  |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Servidor de desarrollo                    |
| `npm run build` | Compilación de producción                 |
| `npm run start` | Sirve la compilación de producción        |
| `npm run lint`  | ESLint (configuración de Next.js)         |
| `npm run test`  | Tests con Vitest                          |

## Estructura

```
src/
├── app/
│   ├── layout.tsx              # Layout raíz: lang="es", fuentes con next/font, AppShell
│   ├── page.tsx                # "/" → redirige a /panel
│   ├── panel/page.tsx          # Panel de la marca (talleres con semáforo y KPIs)
│   ├── taller/[id]/page.tsx    # Detalle de taller
│   ├── como-calculamos/page.tsx
│   └── legal/page.tsx          # Legal y avisos
├── components/
│   ├── AppShell.tsx            # Cabecera, navegación, aviso y pie
│   ├── AvisoDatosFicticios.tsx # "Demo con datos ficticios"
│   └── Footer.tsx
├── data/                       # Aquí irá seed.json
└── lib/
    └── calculo/
        ├── semaforo.ts         # Tipos y firmas del cálculo (lógica pendiente)
        └── semaforo.test.ts
```

Sin backend: los datos son estáticos en el repositorio y el cálculo vive en `src/lib/calculo`, con tests.

## Licencias de dependencias

Todas las dependencias directas tienen licencia permisiva (verificado con `npm view <paquete> license`).

| Paquete                 | Versión | Licencia   | Uso                      |
| ----------------------- | ------- | ---------- | ------------------------ |
| next                    | 16.4.5  | MIT        | Framework (App Router)   |
| react / react-dom       | 19.3.0  | MIT        | UI                       |
| motion                  | 14.10.1 | MIT        | Animaciones              |
| recharts                | 3.10.1  | MIT        | Gráficos                 |
| vitest                  | 5.1.0   | MIT        | Tests (dev)              |
| typescript              | 5.9.3   | Apache-2.0 | Tipado (dev)             |
| tailwindcss             | 4.3.5   | MIT        | Estilos (dev)            |
| @tailwindcss/turbopack  | 4.3.5   | MIT        | Integración Tailwind (dev) |
| eslint                  | 9.39.5  | MIT        | Lint (dev)               |
| eslint-config-next      | 16.4.5  | MIT        | Reglas de lint (dev)     |
| @types/node, @types/react, @types/react-dom | 22 / 19 | MIT | Tipos (dev)  |

Nota sobre dependencias transitivas (no añadidas por nosotros): Next.js trae `sharp` como opcional (binarios libvips, LGPL-3.0) y `caniuse-lite` (CC-BY-4.0); las herramientas de desarrollo traen `lightningcss` y `axe-core` (MPL-2.0).

## Despliegue: pendiente (GitHub y Vercel)

Más adelante se subirá a GitHub y se desplegará en Vercel. Todavía no hay nada configurado.
