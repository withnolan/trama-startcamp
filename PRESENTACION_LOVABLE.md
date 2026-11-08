# PRESENTACIÓN · Lovable · Trama

Pitch final · Start Camp UC3M · domingo 8-nov-2026, 17:45 · 4:00 + 2:00 de preguntas. Mentor 5, Diseño y comunicación. Sigue los bloques y tiempos de `PITCH_FINAL.md` (versión 3) y las cifras de `HOJA_DATOS.md`. Son **8 diapositivas y 1 anexo** para las preguntas. El razonamiento está en `mentores/v3_diseno.md`.

## Cómo usarlo en 3 pasos

1. **Copia el prompt** del apartado «Prompt para Lovable».
   - Antes de pegarlo, rellena en la diapositiva 7 los huecos `[Nombre n]`, `[Rol n]` y `[Por qué n]`, **solo con datos reales**: el rol en 2 palabras como mucho y el por qué en 3 (un hecho comprobable).
   - Confirma «Estudiantes de la UC3M». Lo que no tengáis, bórralo.
   - Pega el prompt en un proyecto nuevo de Lovable.
2. **Adjunta 4 capturas en el mismo mensaje**, todas de `demo-backup/1280x720/`:
   - para la demo, en este orden: `15-escenas-caso-milan.png`, `16-escenas-cuatro-marcas.png` y `04-taller-T1.png`;
   - para el anexo: `17-escenas-documentos.png`.
   - Envía. Si Lovable no deja adjuntar las cuatro, manda la 17 en un segundo mensaje con la frase «Esta es la captura 17, para el anexo».
3. **Revisa las cifras** contra `HOJA_DATOS.md` con la tabla «Control de cifras» y pasa el checklist del final. Después:
   - Publica y recorre la presentación entera una vez, para que se carguen las imágenes.
   - Guarda el PDF de respaldo: abre la URL publicada con `?imprimir` al final y pulsa Ctrl+P. Elige «Guardar como PDF», orientación horizontal, márgenes «Ninguno» y activa «Gráficos de fondo».

> **Aviso sobre la demo.** En la diapositiva 3 se cambia a la **app en vivo** (`http://localhost:3000/escenas`). Si falla, se usan **las capturas de la propia diapositiva 3**.
> - **Antes de subir:** ejecuta `npm run demo` en `trama-mvp`. Abre en una sola ventana tres pestañas:
>   1. la presentación publicada;
>   2. `http://localhost:3000/escenas`;
>   3. `http://localhost:3000/taller/T1` (sin `?demo=1`).
>
>   Pon la pantalla completa con **F11**: así Ctrl+Tab cambia de pestaña sin salir de ella.
> - **En vivo (ruta A):** Ctrl+Tab → el caso Milán ya está a la vista → clic en «2 · Taller con 4 marcas» → Ctrl+Tab (alerta del taller T1) → Ctrl+Tab (vuelves a la presentación) → →.
> - **Si la app falla (plan C):** no salgas de la presentación. La captura 15 ya está a la vista → clic en «2 · Taller con 4 marcas» → clic en «3 · Alerta T1» (o clic sobre la captura) → →. Las flechas nunca cambian de captura.
> - **Sin internet:** abre el PDF a pantalla completa y avanza con AvPág.

## Las 8 diapositivas (4:00)

**Recuento.** Cuentan las palabras del contenido en pantalla. No cuentan el pie de fuentes, el rótulo de simulado, la numeración ni los nombres del equipo. Los símbolos (h, %, €, M€, ×, ÷, ≈, ·) tampoco cuentan, como en el recuento del pitch. Pasa las diapositivas quien lleve el portátil (el Orador 1 en el reparto propuesto, [confirmar]), justo en la frase que indica «Entra».

### 1 · El caso · [0:00–0:42] · Orador 1
- **Entra:** al empezar («Julio de 2025…»). Cubre el caso y el problema, con las cuatro fuentes que pide el pitch.
- **Título:** «7 personas, 6.000 chaquetas al año», con el antetítulo «Milán, julio de 2025».
- **Mensaje:** con esa plantilla, el trabajo encargado no cabía, y la auditoría no lo midió.
- **En pantalla (24 palabras):** «Milán, julio de 2025» · «7 personas, 6.000 chaquetas al año» · «2 h» · «por chaqueta, con corte y plancha» · «hasta» · «3 h» · «solo en coserla (fábrica premium)»
- **Visual:** dos barras a la misma escala.
  - 2 h en gris #7A8494: lo que daba la plantilla.
  - Hasta 3 h en azul #1E3354: solo coser.
  - Son los colores de la app para horas de alta y horas necesarias. No aparece el nombre ni el logo de la marca: la nombra el orador.
- **Pie:** «Fuentes: Il Giorno, 14-7-2025 · Il Post, 15-7-2025 · Startmag, 28-7-2025 (6.000-7.000 chaquetas al año, según su cotitular) · Milano Finanza, 17-4-2026 · Création Gross en FashionUnited, 2021 (hasta 180 min de costura). 2 h: cálculo propio (7 × ≈ 1.750 h ÷ 6.000). Medida preventiva, no multa.»

### 2 · La solución · [0:42–1:13] · Orador 2
- **Entra:** «Somos Trama…»
- **Título:** «Cada mes, en toda la cadena».
- **Mensaje:** cada mes, Trama compara las horas que piden los pedidos con las horas de alta. Los minutos no bajan de un suelo externo y las horas salen de la Seguridad Social.
- **En pantalla (25 palabras):** «Trama» · «Cada mes, en toda la cadena» · «Horas necesarias» · «pedidos × minutos, nunca bajo un suelo externo» · «÷» · «Horas de alta» · «Seguridad Social, jornada de cada contrato»
- **Visual:** la fórmula en dos tarjetas, con un «÷» grande en azul. Sin capturas: la demo llega 31 s después.
- **Pie:** «Suelo para americana forrada: 126 min industrial (BUFT 2023) · 180 min premium o lujo (Création Gross, FashionUnited 2021); piel y calzado, aún sin suelo. Horas de alta: informe de plantilla media de trabajadores en alta (TGSS, Sistema RED); a Trama solo llega el total.»

### 3 · Demo · [1:13–1:57] · habla el Orador 2 y clica el Orador 1
- **Entra:** «Lo simulado…». Aquí se cambia a la app (ver el aviso de arriba).
- **Título:** ninguno en pantalla. Manda la captura, con su rótulo.
- **Mensaje:** la cuenta ya funciona. El caso Milán reconstruido da rojo, y el taller con cuatro marcas también, sin que ninguna vea los datos de otra.
- **En pantalla (12 palabras):** «1 · Caso Milán 2025» · «2 · Taller con 4 marcas» · «3 · Alerta T1». Rótulo: «Caso reconstruido con datos públicos, anonimizado» con la captura 15 y «Datos simulados» con la 16 y la 04.
- **Visual:**
  - Capturas **15 → 16 → 04**, en el orden de los clics del pitch. Se ven enteras, a unos 1040 × 585 px.
  - El clic cambia de captura y las teclas cambian de diapositiva. Así, al volver de la app no salen pasos ocultos.
- **Pie (solo con la captura 15):** «Cifras de prensa anonimizadas (Startmag, 28-7-2025). 180 min: suelo de lujo elegido por nosotros (Création Gross, FashionUnited 2021).»

### 4 · Si sale rojo · [1:57–2:34] · Orador 3
- **Entra:** «Un rojo abre…»
- **Título:** la píldora roja «Revisar» (icono y texto) hace de titular.
- **Mensaje:** un rojo abre una corrección que paga la marca y que protege a quien trabaja en el taller.
- **En pantalla (25 palabras):** «Revisar» · «Paga la marca» · «1.000-3.000 €» · «por alerta» · «Revisor independiente» · «Recuento sin nombres» · «Taller» · «No pierde al cliente de golpe» · «A 6 meses» · «¿Siguen de alta?»
- **Visual:** cuatro tarjetas (2 × 2) en el orden en que se dicen. El rojo solo aparece en la píldora.
- **Pie:** «1.000-3.000 € por alerta: estimación por validar (2-3 jornadas de revisor a 500-1.000 €; tarifas de referencia de SA8000 y SMETA). Revisor: sindicato u ONG; ninguno confirmado todavía.»

### 5 · Lo que no hacemos, y por qué ya · [2:34–2:50] · Orador 3
- **Entra:** «No detectamos…»
- **Título:** «No detectamos trabajo forzoso ni damos sellos».
- **Mensaje:** medimos un riesgo de capacidad, no trabajo forzoso, y la presión ya está aquí.
- **En pantalla (24 palabras):** «No detectamos trabajo forzoso ni damos sellos» · «más de» · «120.000» · «empleos irregulares aflorados, España 2025» · «2027» · «la UE prohibirá los productos con trabajo forzoso»
- **Visual:** dos cifras grandes separadas por una línea fina, sin color de semáforo.
- **Pie:** «Inspección de Trabajo: 131.645 empleos aflorados en 2025 (memoria; Europa Press vía El Derecho, 7-10-2026) y 122.146 (balance de marzo; Bolsamanía); todos los sectores. Reglamento (UE) 2024/3015, aplicable desde el 14-12-2027; no obliga a usar ninguna herramienta. Ningún indicador aislado confirma trabajo forzoso (OIT, 2025).»

### 6 · Negocio · [2:50–3:23] · Orador 4
- **Entra:** «Paga la marca…»
- **Título:** «Paga la marca», con la etiqueta «Supuestos por validar».
- **Mensaje:** paga la marca, 60 € por taller y mes, en un mercado de 8,6 M€ al año. Todo son supuestos por validar.
- **En pantalla (25 palabras):** «Paga la marca» · «Supuestos por validar» · «60 €» · «por taller y mes» · «80 %» · «margen bruto» · «8,6 M€» · «mercado anual» · «Meta 2030» · «40 marcas · 1.500 talleres · ≈ 15.000 personas»
- **Visual:** tres cifras en tarjetas y, debajo, la meta 2030 en una franja. Si vais tarde y no decís la meta, se queda igualmente en pantalla.
- **Pie:** «Mercado: 165 fabricantes españoles de confección, piel y calzado con 50 o más asalariados (INE, DIRCE a 1-1-2025, tabla 73019) + 175 grupos italianos de moda de más de 100 M€ (Mediobanca), × 30-40 talleres cada uno × 720 € al año. Margen: coste de servir ≈ 12 € por taller y mes, a escala; el informe de la gestoría, aparte y a coste. Fiscalía de Milán: documentos pedidos a 22 marcas, ninguna investigada (AGI; Milano Finanza).»

### 7 · Equipo · [3:23–≈3:44] · Orador 4
- **Entra:** «Lo que falta…» (o «Esta mañana…» con la versión A de la llamada).
  - La validación se dice, pero no se escribe: depende de la versión A o B, que se decide a las 17:30.
- **Título:** «Equipo», con «Estudiantes de la UC3M» debajo [confirmar].
- **Mensaje:** quiénes somos y por qué podemos hacerlo; lo que aún no hemos validado se dice en voz alta.
- **En pantalla (≤ 25 palabras sin los nombres):** «Equipo» · «Estudiantes de la UC3M» · «[Nombre 1]» · «[Rol 1]» · «[Por qué 1]» · «[Nombre 2]» · «[Rol 2]» · «[Por qué 2]» · «[Nombre 3]» · «[Rol 3]» · «[Por qué 3]» · «[Nombre 4]» · «[Rol 4]» · «[Por qué 4]». El rol lleva 2 palabras como mucho y el por qué, 3.
- **Visual:** cuatro columnas, sin fotos ni iconos.
  - Responde a la crítica J3/j: nombres, roles y por qué, sin inventar nada.
  - Los estudios del pitch («Derecho laboral, Informática, ADE y Diseño») están por confirmar.
  - Si hay un asesor real, añadid en la diapositiva 7 del prompt una línea «Nos asesora: nombre, cargo»; si no, nada.
- **Pie:** ninguno.

### 8 · Petición y cierre · [≈3:44–4:00] y preguntas · Orador 4 y Orador 1
- **Entra:** «Pedimos…». Se queda en pantalla durante las preguntas. La tecla → lleva al anexo.
- **Título:** «Pedimos», con la petición debajo.
- **Mensaje:** una carta de intención para un piloto gratuito de 3 meses con 5-10 talleres.
- **En pantalla (23 palabras):** «Pedimos» · «Una carta de intención para un piloto gratuito de 3 meses con 5-10 talleres» · «Trama: ver a tiempo, corregir antes de cortar.»
- **Visual:** la petición en grande y el lema del cierre al pie, en azul.
- **Pie:** ninguno.

### Anexo · De dónde salen los datos · solo si preguntan
- **En pantalla (5 palabras):** «De dónde salen los datos» · rótulo «Datos simulados»
- **Visual:** la captura **17**: plantilla media, escandallo y modelo 347, con el sello SIMULADO.
- **Pie:** «Informe de plantilla media de trabajadores en alta: TGSS, Sistema RED (Noticias RED 2011/13). Es un esquema, no el formato oficial.»

## Prompt para Lovable

Cópialo entero. Antes de pegarlo, rellena los corchetes de la diapositiva 7.

```text
Crea una presentación de diapositivas para un pitch de 4 minutos de la startup Trama. Es una presentación (una diapositiva cada vez, a pantalla completa), no una web con scroll. Idioma: español de España.

CONTENIDO: SOLO LO QUE ESTÁ EN ESTE MENSAJE
- Todo texto que va en pantalla está aquí entre comillas latinas «». Cópialo exactamente, sin las comillas, con sus tildes, mayúsculas, signos y números. No lo traduzcas, resumas ni reformules.
- No añadas nada más: ni textos, ni cifras, ni eslóganes, ni logos, ni iconos decorativos, ni emojis, ni fotos, ni avatares, ni ilustraciones. Tampoco portada, índice ni diapositiva de gracias.
- Escribe los números tal cual: punto para los miles y coma para los decimales («6.000», «8,6 M€»).
- Los corchetes [ ] son huecos que rellenará el equipo. Si aparecen, muéstralos tal cual. No inventes nombres ni datos.

FORMATO Y NAVEGACIÓN
- Lienzo fijo de 1280 × 720 px (16:9), centrado y escalado para llenar la ventana sin deformarse. El espacio sobrante va en el color papel #F7F5F1.
- Teclado:
  · siguiente con →, ↓, Espacio o AvPág (PageDown), que es lo que envían los mandos de presentación;
  · anterior con ←, ↑ o RePág (PageUp);
  · la tecla Inicio (Home) lleva a la diapositiva 1 y Fin (End), a la 8.
- El clic no cambia de diapositiva. No pongas flechas, barras, menús ni miniaturas visibles.
- Numeración discreta abajo a la derecha, de «1 / 8» a «8 / 8» (Inter, 16 px, #57524A). En el anexo pone «Anexo».
- La URL guarda la diapositiva (#1 … #8 y #anexo): al recargar, se queda en la misma.
- Sin transiciones ni animaciones.
- Imágenes:
  · usa las 4 capturas adjuntas como imágenes del proyecto, enteras (object-fit: contain);
  · no las recortes ni recrees su contenido en HTML;
  · no uses carga diferida: precárgalas al abrir.
- Vista para PDF: si la URL lleva ?imprimir, muestra todas las diapositivas seguidas, sin escalar.
  · Una por página de 1280 × 720 (@page con size 1280px 720px y margin 0), imprimiendo los colores de fondo.
  · La diapositiva 3 ocupa tres páginas, una por captura y con su rótulo. El anexo ocupa una. Total: 11 páginas.
- Título de la pestaña del navegador: Trama.

ESTÉTICA: INFORME DE CUMPLIMIENTO DE UNA CASA DE LUJO
- Colores:
  · fondo papel #F7F5F1; texto tinta #1B1A18; texto secundario #57524A; acento #1E3354;
  · bordes finos de 1 px en #DDD6CB;
  · tarjetas blancas #FFFFFF con borde de 1 px #DDD6CB y radio de 10 px;
  · gris de gráfico #7A8494, solo para una barra de la diapositiva 1.
- Semáforo. Es el único color fuerte y lleva siempre icono y texto, nunca solo color. Iconos de lucide-react:
  · verde: texto #1D6B3E sobre #E5F2EA, icono CircleCheck;
  · ámbar: texto #8A5300 sobre #FCF0D8, icono TriangleAlert;
  · rojo: texto #A11D1D sobre #FBE8E6, icono OctagonAlert (en versiones antiguas, AlertOctagon).
  · En esta presentación solo aparece el rojo, en la diapositiva 4.
- Tipografía de Google Fonts:
  · titulares en Source Serif 4, peso 600;
  · todo lo demás (cuerpo, etiquetas y cifras) en Inter 400, 500 y 600, con números tabulares (font-variant-numeric: tabular-nums).
- Legible proyectada: titulares de 40 px o más, cifras clave de 64 px o más, cuerpo de 24 px o más. Solo el pie de fuentes y la numeración van a 16 px.
- Márgenes de 80 px a los lados y 64 px arriba; en la diapositiva 3 y en el anexo, 24 px. Mucho aire y todo alineado a la izquierda.
- Sin degradados ni sombras gruesas (como mucho, 0 1px 2px rgba(27,26,24,.06)).
- Pie de fuentes: abajo a la izquierda, en Inter 16 px y #57524A, 3 líneas como mucho, con una línea de 1 px #DDD6CB encima.
- Estilo sello para los rótulos de datos simulados: borde de 2 px #1B1A18, radio de 4 px, fondo #FFFFFF, Inter 600 de 20 px, #1B1A18.

CAPTURAS ADJUNTAS (pueden llegar con otro nombre: reconócelas por lo que muestran)
- Captura 15 (15-escenas-caso-milan.png): escena Caso Milán 2025 con tres tarjetas: Marca de lujo, Proveedor A con el símbolo infinito y Subproveedor B con 1,47×.
- Captura 16 (16-escenas-cuatro-marcas.png): escena Taller con 4 marcas: a la izquierda, lo que ve Ordessa (0,40×); a la derecha, cuatro barras verdes y la suma, 1,30×.
- Captura 04 (04-taller-T1.png): ficha del taller Manifattura Lince S.r.l. con la píldora Revisar y las listas Por qué salta y Qué comprobaría una persona.
- Captura 17 (17-escenas-documentos.png): tres documentos de ejemplo, cada uno con el sello SIMULADO.

DIAPOSITIVA 1 (El caso)
- Antetítulo (Inter 600, 24 px, mayúsculas, espaciado de 0,08 em, #57524A): «Milán, julio de 2025»
- Titular (Source Serif 4, 56 px): «7 personas, 6.000 chaquetas al año»
- Dos barras horizontales, una encima de otra, que empiezan en el mismo punto. Miden 56 px de alto y tienen esquinas de 4 px.
  · A la izquierda de cada barra, en una columna de 220 px, va su cifra (Inter 600, 72 px, tabular).
  · Bajo cada barra va su texto (Inter, 24 px, #1B1A18).
  · Fila A: cifra «2 h»; barra de 506 px de largo en #7A8494; texto «por chaqueta, con corte y plancha».
  · Fila B: cifra «3 h», con la palabra «hasta» encima (Inter, 24 px, #57524A); barra de 760 px en #1E3354; texto «solo en coserla (fábrica premium)».
- Pie de fuentes: «Fuentes: Il Giorno, 14-7-2025 · Il Post, 15-7-2025 · Startmag, 28-7-2025 (6.000-7.000 chaquetas al año, según su cotitular) · Milano Finanza, 17-4-2026 · Création Gross en FashionUnited, 2021 (hasta 180 min de costura). 2 h: cálculo propio (7 × ≈ 1.750 h ÷ 6.000). Medida preventiva, no multa.»

DIAPOSITIVA 2 (La solución)
- Arriba a la izquierda, la palabra «Trama» (Source Serif 4, 600, 32 px, #1E3354).
- Titular (Source Serif 4, 56 px): «Cada mes, en toda la cadena»
- Debajo, dos tarjetas blancas iguales, una al lado de la otra, con el signo «÷» entre ellas (Inter 600, 72 px, #1E3354).
  · En cada tarjeta va el término (Inter 600, 48 px, #1B1A18) y, debajo, su explicación (Inter, 24 px, #57524A).
  · Tarjeta izquierda: «Horas necesarias» y «pedidos × minutos, nunca bajo un suelo externo».
  · Tarjeta derecha: «Horas de alta» y «Seguridad Social, jornada de cada contrato».
- Pie de fuentes: «Suelo para americana forrada: 126 min industrial (BUFT 2023) · 180 min premium o lujo (Création Gross, FashionUnited 2021); piel y calzado, aún sin suelo. Horas de alta: informe de plantilla media de trabajadores en alta (TGSS, Sistema RED); a Trama solo llega el total.»

DIAPOSITIVA 3 (Demo; el equipo cambia aquí a la app en vivo y esta diapositiva es el respaldo)
- Sin titular.
- Franja superior de 56 px:
  · a la izquierda, el rótulo con estilo sello;
  · a la derecha, tres botones de texto: «1 · Caso Milán 2025», «2 · Taller con 4 marcas» y «3 · Alerta T1» (Inter 500, 20 px, #1B1A18; el activo, con un subrayado de 2 px #1E3354).
- Debajo, la captura activa, centrada y lo más grande posible sin recortarla (unos 1040 × 585 px), con un borde de 1 px #DDD6CB.
- Comportamiento:
  · al entrar en la diapositiva, se ve siempre la captura 15;
  · clic en un botón: muestra su captura (botón 1 → captura 15; botón 2 → captura 16; botón 3 → captura 04);
  · clic sobre la captura: pasa a la siguiente (15 → 16 → 04 → 15);
  · las teclas nunca cambian de captura: siempre cambian de diapositiva.
- Rótulo: con la captura 15, «Caso reconstruido con datos públicos, anonimizado»; con la 16 y la 04, «Datos simulados».
- Pie de fuentes, solo con la captura 15: «Cifras de prensa anonimizadas (Startmag, 28-7-2025). 180 min: suelo de lujo elegido por nosotros (Création Gross, FashionUnited 2021).»

DIAPOSITIVA 4 (Si sale rojo)
- Titular: la píldora del estado rojo, en grande. Lleva el icono OctagonAlert de 40 px y la palabra «Revisar» (Inter 600, 44 px), con texto #A11D1D sobre fondo #FBE8E6, borde de 1 px #A11D1D y forma redondeada del todo.
- Debajo, una cuadrícula de 2 × 2 tarjetas blancas. Cada tarjeta lleva una etiqueta (Inter 600, 24 px, #57524A) y un texto principal (Inter 600, 36 px, #1B1A18):
  · «Paga la marca» y «1.000-3.000 €» (esta cifra, a 64 px y tabular), con «por alerta» a su lado (24 px);
  · «Revisor independiente» y «Recuento sin nombres»;
  · «Taller» y «No pierde al cliente de golpe»;
  · «A 6 meses» y «¿Siguen de alta?».
- Pie de fuentes: «1.000-3.000 € por alerta: estimación por validar (2-3 jornadas de revisor a 500-1.000 €; tarifas de referencia de SA8000 y SMETA). Revisor: sindicato u ONG; ninguno confirmado todavía.»

DIAPOSITIVA 5 (Lo que no hacemos, y por qué ya)
- Titular (Source Serif 4, 48 px): «No detectamos trabajo forzoso ni damos sellos»
- Debajo, dos columnas separadas por una línea vertical de 1 px #DDD6CB. Cada columna lleva una cifra grande (Inter 600, 80 px, tabular) y su texto debajo (Inter, 24 px, #1B1A18):
  · «más de» (Inter, 24 px, #57524A, encima de la cifra), la cifra «120.000» y el texto «empleos irregulares aflorados, España 2025»;
  · la cifra «2027» y el texto «la UE prohibirá los productos con trabajo forzoso».
- Pie de fuentes: «Inspección de Trabajo: 131.645 empleos aflorados en 2025 (memoria; Europa Press vía El Derecho, 7-10-2026) y 122.146 (balance de marzo; Bolsamanía); todos los sectores. Reglamento (UE) 2024/3015, aplicable desde el 14-12-2027; no obliga a usar ninguna herramienta. Ningún indicador aislado confirma trabajo forzoso (OIT, 2025).»

DIAPOSITIVA 6 (Negocio)
- Titular (Source Serif 4, 48 px): «Paga la marca». A su derecha, una etiqueta con borde de 1,5 px #57524A, radio de 4 px, Inter 600 de 24 px y color #57524A: «Supuestos por validar».
- Tres tarjetas blancas iguales, en fila. Cada una lleva la cifra (Inter 600, 72 px, tabular, #1B1A18) y su texto debajo (Inter, 24 px, #57524A):
  · «60 €» y «por taller y mes»;
  · «80 %» y «margen bruto»;
  · «8,6 M€» y «mercado anual».
- Debajo, a todo el ancho y con una línea de 1 px #DDD6CB encima, en la misma línea:
  · la etiqueta «Meta 2030» (Inter 600, 24 px, #57524A);
  · el texto «40 marcas · 1.500 talleres · ≈ 15.000 personas» (Inter 600, 36 px, #1B1A18, tabular).
- Pie de fuentes: «Mercado: 165 fabricantes españoles de confección, piel y calzado con 50 o más asalariados (INE, DIRCE a 1-1-2025, tabla 73019) + 175 grupos italianos de moda de más de 100 M€ (Mediobanca), × 30-40 talleres cada uno × 720 € al año. Margen: coste de servir ≈ 12 € por taller y mes, a escala; el informe de la gestoría, aparte y a coste. Fiscalía de Milán: documentos pedidos a 22 marcas, ninguna investigada (AGI; Milano Finanza).»

DIAPOSITIVA 7 (Equipo)
- Titular (Source Serif 4, 48 px): «Equipo». Debajo, en Inter de 24 px y #57524A: «Estudiantes de la UC3M».
- Cuatro columnas iguales, separadas por líneas verticales de 1 px #DDD6CB. En cada columna, de arriba abajo, van el nombre (Source Serif 4, 600, 32 px, #1B1A18), el rol (Inter 600, 24 px, #1E3354) y el por qué (Inter, 24 px, #57524A):
  · «[Nombre 1]», «[Rol 1]» y «[Por qué 1]»;
  · «[Nombre 2]», «[Rol 2]» y «[Por qué 2]»;
  · «[Nombre 3]», «[Rol 3]» y «[Por qué 3]»;
  · «[Nombre 4]», «[Rol 4]» y «[Por qué 4]».
- Sin fotos, avatares, iconos ni pie de fuentes.

DIAPOSITIVA 8 (Petición y cierre; se queda en pantalla durante las preguntas)
- Antetítulo (Inter 600, 24 px, mayúsculas, espaciado de 0,08 em, #57524A): «Pedimos»
- Frase principal (Source Serif 4, 600, 56 px, #1B1A18): «Una carta de intención para un piloto gratuito de 3 meses con 5-10 talleres»
- Abajo, tras una línea de 1 px #DDD6CB a todo el ancho: «Trama: ver a tiempo, corregir antes de cortar.» (Source Serif 4, 600, 36 px, #1E3354).
- Sin pie de fuentes.

ANEXO (va después de la 8; solo se enseña si preguntan de dónde salen los datos)
- Franja superior con el rótulo «Datos simulados», con estilo sello, y, a su derecha, el titular «De dónde salen los datos» (Source Serif 4, 40 px).
- Debajo, la captura 17, centrada y lo más grande posible sin recortarla, con un borde de 1 px #DDD6CB.
- Pie de fuentes: «Informe de plantilla media de trabajadores en alta: TGSS, Sistema RED (Noticias RED 2011/13). Es un esquema, no el formato oficial.»

ANTES DE TERMINAR, COMPRUEBA
1. Hay 8 diapositivas y el anexo, en este orden, con los textos exactos de este mensaje y nada más.
2. Los números se ven como aquí: 6.000; 8,6 M€; 1.000-3.000 €; 120.000; ≈ 15.000.
3. Nada se corta ni se desborda a 1280 × 720.
4. En la diapositiva 3, las teclas cambian de diapositiva y el clic cambia de captura; el rótulo cambia con la captura.
5. Con ?imprimir salen 11 páginas.
```

## Control de cifras (paso 3)

| En pantalla o en el pie | Diap. | Pitch v3 | `HOJA_DATOS.md` |
|---|---|---|---|
| 7 personas · 6.000 chaquetas al año | 1 | «siete trabajadores: unas 6.000 al año» | Cifras clave, Loro Piana: 7 · 6.000-7.000 |
| 2 h · hasta 3 h (180 min) · 1.750 h | 1 | «dos horas por chaqueta» · «hasta tres solo en coserla» | Loro Piana (7 × 1.750 h, unas 2 h) · Minutos: 180 min |
| 126 y 180 min | 2 | Fuentes, «suelo externo» | Minutos por pieza: el suelo |
| 1,47× · 0,40 · 0,35 · 0,30 · 0,25 → 1,30× (en las capturas) | 3 | Demo, clics 1 y 2 | Qué es simulado en la demo |
| 1.000-3.000 € por alerta · 6 meses | 4 | «unos mil a tres mil euros por alerta» · «a los seis meses» | Cuentas: coste de corregir · Personas sin alta |
| más de 120.000 · 2025 · 131.645 · 122.146 | 5 | «más de 120.000 empleos irregulares» | España: tamaño del problema |
| 2027 (14-12-2027 en el pie) | 5 | «en 2027 la UE prohibirá…» | Horizonte UE |
| 60 € por taller y mes · 80 % · ≈ 12 € | 6 | «60 euros por taller y mes» · «margen bruto del 80 %, por validar» | Cuota de vigilancia · Margen |
| 8,6 M€ · 165 + 175 · 30-40 talleres · 720 € | 6 | «165… 175… con 30 a 40 talleres cada uno, 8,6 millones al año» | Mercado en marcas que compran |
| 40 marcas · 1.500 talleres · ≈ 15.000 personas | 6 | «Meta 2030: 40 marcas, 1.500 talleres y unas 15.000 personas» | Meta 2030 |
| 22 marcas, ninguna investigada | 6 | «pidió documentos a 22, ninguna investigada» | Cifras clave, Milán |
| 3 meses · 5-10 talleres | 8 | «piloto gratuito de tres meses con 5 a 10 talleres» | Petición |

## Si Lovable se desvía (pega la frase que toque)

- «Deja solo los textos de mi primer mensaje, exactamente como los escribí: quita cualquier texto, cifra, icono, logo o imagen que hayas añadido.»
- «Escribe los números como en mi primer mensaje: punto para los miles y coma decimal (6.000; 8,6 M€; 1.000-3.000 €).»
- «En la diapositiva 3, las teclas siempre cambian de diapositiva y solo el clic cambia de captura; al entrar en la 3 se ve la captura 15.»
- «Muestra las capturas adjuntas como imágenes enteras (object-fit: contain), sin recrearlas en HTML ni recortarlas.»
- «Si algo no cabe a 1280 × 720, reduce el espacio entre bloques, no la letra: titulares de 40 px o más, cifras de 64 px o más, cuerpo de 24 px o más.»

## Checklist antes de presentar (6 puntos)

1. **Cifras.** Cada cifra de la pantalla y de los pies coincide con la tabla «Control de cifras» y va escrita a la española (6.000; 8,6 M€). Lovable no ha añadido ninguna cifra ni ninguna frase.
2. **Rótulos de simulado.**
   - Diapositiva 3: «Caso reconstruido con datos públicos, anonimizado» con la captura 15 y «Datos simulados» con la 16 y la 04.
   - Anexo: «Datos simulados».
   - El caso Milán lleva sus fuentes al pie en las diapositivas 1 y 3.
3. **Sin logos reales.**
   - No hay logos de marcas, medios, la UC3M ni Start UC3M.
   - Tampoco el distintivo de Lovable en la versión publicada. Si aparece y vuestro plan no deja quitarlo, presentad desde el PDF.
   - No hay fotos ni iconos, salvo la píldora «Revisar».
4. **Equipo.** No queda ningún corchete a la vista: los huecos de la diapositiva 7 están rellenos con datos reales o borrados. «Estudiantes de la UC3M» y los estudios están confirmados, y Lovable no ha puesto ningún nombre.
5. **Legible a 1280 × 720.** Con la ventana o el proyector a 1280 × 720 y el zoom al 100 %:
   - nada sale cortado ni desbordado;
   - los titulares miden 40 px o más, las cifras clave 64 px o más y el cuerpo 24 px o más;
   - las capturas se ven enteras.
   Si podéis, comprobadlo desde el fondo de la sala.
6. **Tiempo.**
   - Haced dos ensayos con cronómetro y con la presentación real: 4:00 como mucho, y cada cambio de diapositiva en su frase de «Entra».
   - Ensayad una vez cada uno la demo en vivo (Ctrl+Tab de ida y de vuelta) y el plan C (los clics en la diapositiva 3).
   - Guardad el PDF.
   - Si pasáis de 4:00, cortad lo que se dice siguiendo el orden de «Si vamos tarde». Las diapositivas no cambian.
