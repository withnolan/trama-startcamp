# Trama — prototipo de demo

Trama es una herramienta para los departamentos de cumplimiento de marcas de lujo y de sus fabricantes principales.
Cada mes compara el trabajo que la marca encarga a un taller con sus horas de alta (personal dado de alta × jornada
pactada). Si no cuadra, avisa con un semáforo (verde / ámbar / rojo): es una alerta, no una prueba. Abre una revisión y un plan de
corrección que protege a los trabajadores de toda la cadena.

> Prototipo de demostración para el pitch del Start Camp UC3M (8-nov-2026). Datos ficticios: empresas, talleres,
> personas y cifras son inventados. Sin backend: datos estáticos en `src/data` y cálculo en `src/lib/calculo`, con tests.

## Arrancar la demo

Requisitos: Node.js 22.12 o superior y npm.

```bash
npm install        # una vez, con internet
npm run demo       # compila y sirve la versión de producción en http://localhost:3000
```

- Abre `http://localhost:3000` → «Entrar como marca demo» → panel.
- Ruta de la demo guiada (~18 s, MOTION §5): **`http://localhost:3000/taller/T1?demo=1`**.
  Clic o `Esc` salta al estado final. Con «reducir movimiento» del sistema activado no hay secuencia: todo aparece al instante.
- Funciona sin internet una vez instalado: las fuentes van autoalojadas (`@fontsource-variable/*`) y no hay recursos remotos.

## Guion de la demo en directo (40–60 s; el orador explica, la pantalla no)

1. **Panel** (`/panel`, ~5 s): el taller en rojo encabeza la tabla; arriba, el indicador de trabajadores que siguen de alta.
2. **Taller** (`/taller/T1?demo=1`, ~20 s): la coreografía recorre horas → cadena → plan → protección → impacto.
   Si vas justo de tiempo, `Esc` o un clic la llevan al final.
3. **Simulador** (baja hasta «Prueba el cálculo» o abre `/taller/T1#simulador`, ~20 s):
   - «Chaquetas en el trimestre» de 2.000 a **700** → verde (750 sigue en ámbar: el verde exige ≤ 714).
   - «Parte de la facturación del taller que es de Ordessa» al 20 % → la carga total estimada pasa a rojo.
   - Botón «Caso reconstruido con datos públicos» → rojo con 240 min; baja «Minutos por chaqueta»: ámbar por debajo de
     ~135 min y verde por debajo de ~104.
   - «Restablecer» vuelve al escenario elegido. El mismo simulador está en `/como-calculamos`.

## Plan B

Si la demo en directo falla, en `../demo-backup/` (raíz del proyecto) hay:

- `1280x720/` y `1920x1080/`: capturas PNG de cada pantalla (entrada, panel, taller T1 por secciones, simulador en el
  escenario de la demo y en el caso reconstruido, T2, T6, cómo calculamos, legal).
- `demo-T1-1280x720.webm`: vídeo de la secuencia `/taller/T1?demo=1` completa.

Se regeneran con `npm run capturas`.

## Scripts

| Script             | Qué hace                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `npm run demo`     | `next build` + `next start -p 3000` (lo que se usa en el pitch)                           |
| `npm run dev`      | Servidor de desarrollo                                                                     |
| `npm run build`    | Compilación de producción                                                                  |
| `npm run start`    | Sirve la compilación de producción                                                         |
| `npm run lint`     | ESLint (configuración de Next.js)                                                          |
| `npm test`         | Tests del cálculo con Vitest                                                               |
| `npm run e2e`      | Compila y prueba con Playwright contra `next start` (:3100), sin internet: rutas a 1280×720 y 1920×1080, demo, simulador; falla con cualquier error de consola o de página |
| `npm run capturas` | Compila y regenera las capturas y el vídeo del plan B en `../demo-backup/`                 |

La primera vez que se usa Playwright hay que instalar el navegador: `npx playwright install chromium`.

## Estructura

```
src/
├── app/                 # Rutas: / · /panel · /taller/[id] · /como-calculamos · /legal
├── components/          # Componentes de presentación (y motion/ para las animaciones)
├── content/             # Textos de la interfaz y de las páginas de texto
├── data/                # seed.json y vista.ts (datos ya calculados para las páginas)
└── lib/                 # calculo/ (semáforo y métricas, con tests), formato.ts, motion/
e2e/                     # Playwright: recorrido.spec.ts y capturas.spec.ts (plan B)
```

## Licencias de dependencias

Todas las dependencias directas tienen licencia permisiva (verificado con `npm view <paquete> license`).

| Paquete                                     | Licencia   | Uso                          |
| ------------------------------------------- | ---------- | ---------------------------- |
| next, react, react-dom                      | MIT        | Framework y UI               |
| motion                                      | MIT        | Animaciones                  |
| recharts                                    | MIT        | Gráficos                     |
| lucide-react                                | ISC        | Iconos                       |
| @fontsource-variable/inter, …/source-serif-4 | OFL-1.1    | Fuentes autoalojadas         |
| @playwright/test                            | Apache-2.0 | Tests e2e y capturas (dev)   |
| vitest                                      | MIT        | Tests (dev)                  |
| typescript                                  | Apache-2.0 | Tipado (dev)                 |
| tailwindcss, @tailwindcss/turbopack         | MIT        | Estilos (dev)                |
| eslint, eslint-config-next                  | MIT        | Lint (dev)                   |
| @types/node, @types/react, @types/react-dom | MIT        | Tipos (dev)                  |

Dependencias transitivas (no añadidas por nosotros): Next.js trae `sharp` como opcional (binarios libvips, LGPL-3.0) y
`caniuse-lite` (CC-BY-4.0); las herramientas de desarrollo traen `lightningcss` y `axe-core` (MPL-2.0).

## Despliegue

Más adelante se subirá a GitHub y se desplegará en Vercel. Todavía no hay nada configurado.
