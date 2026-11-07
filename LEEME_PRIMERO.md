# LÉEME PRIMERO — Trama · Start Camp UC3M (pitch hoy, domingo 8-nov, 17:45)

> Estado a las **00:06** del domingo. Este archivo se actualiza durante la noche; si la sesión se corta, lo que pone aquí es lo último que está hecho.

## 1. Qué leer y en qué orden
1. **`PITCH_FINAL.md`** — el pitch de 4:00 (versión con mejor nota). *En preparación.*
2. **`PREGUNTAS.md`** — las 15 preguntas difíciles con respuestas de 25 s. *En preparación.*
3. **`LLAMADAS.md`** — ✅ listo. 20 contactos públicos verificados (7 para hoy domingo), guion de 2 min y borradores de WhatsApp/correo **sin enviar**.
4. **`MARCAS.md`** — mensajes a marcas para enviar esta noche. *En preparación.*
5. `PROBLEMAS_CERRADOS.md` (críticas del jurado y cómo se cierran) · `PRESENTACION_LOVABLE.md` (diapositivas + prompt) · `DOCUMENTO_MAESTRO.md`. *En preparación.*

## 2. Cómo arrancar la demo (sin internet una vez instalada)
```bash
cd trama-mvp
npm install        # solo la primera vez, con internet
npm run demo       # construye y arranca en http://localhost:3000
```
- Demo guiada de 18 s: `http://localhost:3000/taller/T1?demo=1` (clic o Esc para saltar).
- Si algo falla: **plan B** en `demo-backup/` (capturas PNG y vídeo `.webm`). ✅ Listo.

## 3. A quién llamar primero (detalle en `LLAMADAS.md`)
1. Gestoría de Igualada con WhatsApp de empresa (domingo desde las 10:00): ¿puede sacar cada mes el informe de plantilla media en alta y cuánto cobraría?
2. Taller de marroquinería de Ubrique que fabrica para marcas (email + Instagram, esta noche).
3. Fabricante de calzado de Elche que fabrica para marcas (email + Instagram, esta noche).
Lo más probable es que hoy conteste poca gente: el pitch tiene **versión B** del bloque de la llamada. **Nunca contéis una respuesta que no haya llegado.**

## 4. Qué falta (se irá tachando)
- [x] MVP integrado y fusionado en `main` (lint 0 · tests 96/96 · build OK · e2e 22/22, también sin internet) y plan B en `demo-backup/` (28 capturas + vídeo de 21 s).
- [ ] **Subir a GitHub (lo tenéis que hacer vosotros):** el repo PRIVADO `https://github.com/withnolan/trama-startcamp` está creado y vacío, pero el permiso de esta sesión **bloqueó el `git push`**. Todo está en commits locales. Para subirlo, desde la carpeta `STARTCAMP`:
  ```bash
  git remote add origin https://github.com/withnolan/trama-startcamp.git
  git push -u origin main
  ```
- [ ] Pitch final, preguntas, problemas cerrados, Lovable.
- [ ] Bucle de mentores + jurado simulado (hasta 4 rondas, como mucho hasta las 6:00) → `EVOLUCION.md`.
- Lo que solo podéis hacer vosotros: enviar los mensajes, hacer las llamadas, rellenar los [RELLENAR] del pitch con respuestas reales y poner nombres y roles del equipo.
