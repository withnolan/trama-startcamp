# LÉEME PRIMERO — Trama · Start Camp UC3M (pitch hoy, domingo 8-nov, 17:45-20:00)

> Estado final a las **03:20** del domingo. Todo está en commits locales en la rama `main` (y `pulido`). **No está subido a GitHub** (ver §5).

## 1. Qué leer, en este orden (5 minutos)
1. **`PITCH_FINAL.md`** — el pitch que hay que presentar (**v4**, 553 palabras, 4:00, con reparto por oradores, demo de 50 s y huecos [RELLENAR]). **Arriba del archivo hay 3 decisiones que tomar antes de las 17:30**: llamada (versión A solo con una respuesta real; si no, versión B), marcas (si no escribisteis a ninguna, esa frase no se dice) y equipo (nombres y estudios reales).
   - **Nota del jurado simulado:** v1 6,52 · v2 6,43 · **v3 6,73 (la mejor)** · v4 6,23 · pitch v5 del usuario 4,83. Recomiendo **v4** aunque puntuó menos: v3 tenía dos errores que el propio jurado encontró (llamaba «suelo» a 180 min y su meta 2030 no cuadraba). v3 está en `pitches/v3_pitch_final.md` si preferís la de mejor nota. Detalle en `EVOLUCION.md`.
2. **`PREGUNTAS.md`** — las respuestas de 25 s (J1-J5 y las de todas las rondas del jurado). Repasad las 10 primeras en voz alta.
3. **`HOJA_DATOS.md`** — todas las cifras con su fuente y lo que está «por validar». Si os preguntan una cifra, sale de aquí.
4. **`PRESENTACION_LOVABLE.md`** — 8 diapositivas + prompt para pegar en Lovable (usa las capturas 15, 16, 04 y 17 de `demo-backup/1280x720/`). Revisad la checklist del final.
5. Si hay tiempo: `PROBLEMAS_CERRADOS.md` (cada crítica y su respuesta) · `DOCUMENTO_MAESTRO.md` (mapa del jurado, agujeros, checklist del día) · `problemas/i_piloto.md` (**carta de intención** de 1 página: imprimidla).

## 2. Cómo arrancar la demo (funciona sin internet una vez instalada)
```bash
cd trama-mvp
```
```bash
npm install
```
```bash
npm run demo
```
- `npm install` solo la primera vez y con internet. `npm run demo` construye y arranca en `http://localhost:3000` (tarda ~1 min).
- **Ruta del pitch (3 clics):** pestaña 1 `http://localhost:3000/escenas` · pestaña 2 `http://localhost:3000/taller/T1`. Clic «1 · Caso Milán 2025» → «2 · Taller con 4 marcas» → `Ctrl+Tab` a la alerta de T1. Guion exacto en `trama-mvp/README.md`.
- Demo animada de 18 s (opcional): `http://localhost:3000/taller/T1?demo=1` (clic o Esc para saltar).
- **Si falla: plan B** → capturas en `demo-backup/1280x720/` (15, 16 y 04 para la ruta del pitch) y vídeo `demo-backup/demo-T1-1280x720.webm`.
- **Decid en voz alta lo que es simulado** (ya está en el pitch): marca, talleres y cifras de la app son inventados; el caso Milán usa datos de prensa anonimizados.

## 3. A quién escribir o llamar primero (nosotros no hemos enviado nada)
- **`LLAMADAS.md`**: 20 contactos públicos verificados. Primero: la gestoría de Igualada con WhatsApp de empresa (domingo desde las 10:00), un taller de marroquinería de Ubrique y un fabricante de calzado de Elche (email/Instagram). Pregunta clave: ¿puede sacar cada mes el informe de plantilla media en alta, pondera la jornada parcial y cuánto cobraría?
- **`MARCAS.md`**: 17 marcas con canal público; las 5 primeras: Aeffe, Adolfo Domínguez, Camper, Piquadro y Mascaró. Borradores listos.
- **Regla:** en el pitch solo se cuenta una respuesta que haya llegado (también los «no», que suman). Si no hay ninguna, versión B.

## 4. Qué falta (y solo podéis hacerlo vosotros)
- Rellenar los [RELLENAR] del pitch con datos reales (llamada, marcas, nombres del equipo) o usar la versión B.
- Validación con quien paga y con quien da el dato: el jurado lo pidió en las 4 rondas. Es el mayor agujero y se dice con honestidad.
- Pegar el prompt en Lovable y revisar las cifras contra `HOJA_DATOS.md`.
- Ensayar dos veces con cronómetro (máx. 4:00) y la demo en el portátil que se va a usar.

## 5. Subir a GitHub (opcional, vosotros)
El repo **privado** `https://github.com/withnolan/trama-startcamp` está creado y vacío; el permiso de esta sesión bloqueó el `git push`. Desde la carpeta `STARTCAMP`:
```bash
git remote add origin https://github.com/withnolan/trama-startcamp.git
```
```bash
git push -u origin main pulido
```
