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

- Abre `http://localhost:3000` → «Entrar como marca demo» → panel. Las escenas (caso Milán, taller con 4 marcas,
  documentos simulados) están en `http://localhost:3000/escenas`.
- Ruta de la demo guiada (~18 s, MOTION §5): **`http://localhost:3000/taller/T1?demo=1`**.
  Clic o `Esc` salta al estado final. Con «reducir movimiento» del sistema activado no hay secuencia: todo aparece al instante.
- Funciona sin internet una vez instalado: las fuentes van autoalojadas (`@fontsource-variable/*`) y no hay recursos remotos.

## Guion de la demo en directo (40–60 s; el orador explica, la pantalla no)

Pantalla de 1280×720 o más, zoom del navegador al 100 %. Antes de subir: `npm run demo` y dos pestañas abiertas.

### Ruta del pitch (50 s, 3 clics) · es la «Ruta A» de `PITCH_FINAL.md`

| Paso | Clic exacto | Qué se ve |
| --- | --- | --- |
| Preparar | Pestaña 1: `http://localhost:3000/escenas` · Pestaña 2: `http://localhost:3000/taller/T1` (sin `?demo=1`) | 1: el caso Milán entero. 2: «Por qué salta» y «Qué comprobaría una persona» |
| Clic 1 | Botón **«1 · Caso Milán 2025»** (barra fija bajo el aviso; se puede omitir: ya está a la vista) | Marca → Proveedor A: **∞**, sin taller propio, rojo desde el primer pedido → Subproveedor B: **1,47×** (18.000 h ÷ 12.250 h), «Rojo a partir de ≈135 min por chaqueta» |
| Clic 2 | Botón **«2 · Taller con 4 marcas»** | Izquierda, «Lo que ve Ordessa»: En margen **0,40×** + «Revisión abierta». Derecha, «Lo que calcula Trama como tercero»: cuatro verdes y «Suma de las 4: **1,30×** Revisar» |
| Clic 3 | `Ctrl+Tab` → pestaña 2 | Alerta del taller T1: «Por qué salta» (3.ª línea: 8.000 h frente a 3.360 h) y «Qué comprobaría una persona» |

Los botones de escena siguen visibles al bajar: el orden de los clics da igual. «3 · Documentos» enseña los tres
documentos simulados (plantilla media, escandallo, modelo 347) si sale la pregunta «¿de dónde salen los datos?».

### Recorrido completo (≈ 60 s; mentoría o si sobra tiempo)

1. `http://localhost:3000` → **«Entrar como marca demo»** (1 s).
2. Panel → botón **«Rojo (1)»**: el taller en rojo y su subcontrata arriba (5 s).
3. Clic en **«Manifattura Lince S.r.l.»** → «Revisar», «Por qué salta» (8.000 h frente a 3.360 h en la alerta) y
   «Qué comprobaría una persona» (12 s).
4. Rueda del ratón hasta **«Prueba el cálculo»** (bajo el gráfico de «Horas»): escribir **700** en «Chaquetas en el
   trimestre» → En margen, 0,8× (750 sigue en ámbar: el verde exige ≤ 714). Bajar un poco y arrastrar «Parte de la
   facturación del taller que es de Ordessa» hasta **20 %** → «Toda la carga del taller…: 4,2×» y «Abre una revisión»: la cuota no da rojo, abre una revisión (20 s).
5. Navegación **«Escenas»** → caso Milán; botón **«2 · Taller con 4 marcas»** (20 s).

Si vas justo, sáltate el paso 4: el taller con 4 marcas cuenta lo mismo con más claridad (y su tercera tarjeta da la
alternativa de la cuota). Más del simulador: «Caso reconstruido con datos públicos» → rojo con 180 min (1,5×); ámbar por
debajo de ~135 min y verde por debajo de ~105; «Restablecer» vuelve al escenario elegido. El mismo simulador está en
`/como-calculamos`.

### Demo guiada (alternativa)

`http://localhost:3000/taller/T1?demo=1` (~18 s, MOTION §5): horas → cadena → plan → protección → impacto. Clic o `Esc`
la llevan al final.

## Plan B

Si la demo en directo falla, en `../demo-backup/` (raíz del proyecto) hay:

- `1280x720/` y `1920x1080/`: capturas PNG de cada pantalla (entrada, panel, taller T1 por secciones, simulador en el
  escenario de la demo y en el caso reconstruido, T2, T6, cómo calculamos, legal) y de las escenas: `15-escenas-caso-milan`,
  `16-escenas-cuatro-marcas` y `17-escenas-documentos`. Para la ruta del pitch sin app: capturas 15, 16 y 04.
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
├── app/                 # Rutas: / · /panel · /taller/[id] · /escenas · /como-calculamos · /legal
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
