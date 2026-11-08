# g) Protección de datos y competencia

Mentor 4 · 8-nov-2026. No es asesoramiento jurídico. Fuentes completas en `investigacion/encaje_legal.md` §g y «Competencia». Para el taller con varias marcas, ver `problemas/b_varias_marcas.md` y `problemas/competencia.md` (Negocio).

## Decisión

**RGPD**
1. **Minimización.** A Trama solo llega el informe de plantilla media del taller: taller, periodo y una cifra agregada. El ITA, la RNT y las nóminas no salen de la gestoría. Trama no trata situación migratoria; del revisor solo recibe recuentos agregados.
2. **Base jurídica.**
   - Cuando el encargo es de la «propia actividad», obligación legal (art. 6.1.c): art. 42 ET y art. 16.6 LGSS, todavía ❓ para la confección.
   - En el resto, interés legítimo (art. 6.1.f), con la ponderación documentada en tres pasos.
3. **Roles.**
   - El taller es responsable del tratamiento y su gestoría, encargada.
   - Trama es encargada de cada marca para el semáforo de esa marca.
   - En el cálculo conjunto con 3 marcas o más, Trama fija un fin propio. Eso la convierte en responsable o, si se decide así, en encargada del taller (art. 28.10). Se decide con un delegado de protección de datos antes del piloto.
4. **Talleres pequeños.** Con menos de 4 personas o con un titular autónomo, la marca solo ve el semáforo, sin cifras. Las variaciones de plantilla nunca se muestran mes a mes, porque permitirían deducir las horas de una persona.
5. **Evaluación de impacto (EIPD) antes del piloto.** Hay al menos dos criterios de la lista de la AEPD: combinar datos de varios responsables y seguimiento sistemático. Además, los empleados son interesados vulnerables.
6. **Ninguna decisión solo con el semáforo** (art. 22; TJUE C-634/21, SCHUFA). Siempre revisión humana y audiencia al taller.

**Competencia**
7. **Mínimo de 3 marcas** en el taller para calcular la saturación conjunta.
8. **«Revisión abierta» con el mismo texto sea cual sea la causa:** sin cifras, sin nombres y sin decir cuántas marcas hay.
9. **Cortafuegos interno.** Quien procesa pedidos de varias marcas está separado de la parte comercial, con registro de accesos. Revisión anual por un abogado de competencia.
10. **Ningún pacto entre marcas.** Cada marca firma su propia cláusula (el 20 % es bilateral).

## Por qué
- **El dato agregado sigue siendo personal donde se puede reidentificar.** Lo es desde el punto de vista de quien lo tiene (cdo. 26 RGPD; TJUE C-413/23 P). En un taller de 1-3 personas, el total revela las horas de alguien concreto. El umbral de 4 es una decisión de diseño, no una cifra legal.
- **Minimización frente a lo que ya admite la AEPD.** La AEPD admite que una subcontrata pase nóminas y RNT a la principal cuando hay contrata de propia actividad ([FAQ-0305](https://www.aepd.es/preguntas-frecuentes/3-proteccion-de-datos-en-el-ambito-laboral/FAQ-0305-puede-cederse-los-datos-de-salarios-y-rnt-de-una-subcontrata-a-la-empresa-principal)). Trama pide mucho menos: un total.
- **Competencia: el tercero también puede responder.** Las directrices horizontales tratan el intercambio indirecto a través de un tercero (*hub-and-spoke*) y piden agregación, acceso restringido y que cada participante solo vea lo suyo ([2023/C 259/01](https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:52023XC0721(01)), §§391 y 401-408). Con solo 2 marcas, la «revisión abierta» y los pedidos propios permitirían deducir los de la otra. De ahí el mínimo de 3.

## Respuesta de 25 s (66 palabras)
> «Trama nunca ve nombres. La Seguridad Social da la plantilla del taller en una cifra; el ITA y las nóminas no salen de la gestoría. En talleres de menos de cuatro personas, la marca solo ve el semáforo. Haremos una evaluación de impacto antes del piloto. Y entre marcas no circula nada: con tres o más, solo reciben "revisión abierta", sin cifras.»

## Qué cambia en la app o en el pitch
- **Pitch.** Nada; si sale en preguntas, la respuesta de arriba.
- **App** (`src/content/legal.ts`, sección `privacidad`; solo texto; P2):
  1. En «Roles», añadir: «En el cálculo conjunto de un taller con 3 marcas o más, Trama actúa como tercero. Su papel (responsable o encargada del taller) se decidirá con un delegado de protección de datos antes del piloto.»
  2. En «talleres de menos de 4 personas», añadir «o con un titular autónomo».
  3. Añadir: «Antes del piloto se hará una evaluación de impacto (EIPD).»

## Qué sigue abierto
- El papel de Trama en el cálculo conjunto. Decidirlo con un delegado de protección de datos o un abogado.
- Si el rojo de un autónomo cuenta como dato de infracciones (art. 27 LOPDGDD).
- Italia (Garante): sin revisar.
- **El umbral de 3 marcas es un criterio de diseño.** Lo tiene que validar un abogado de competencia, sobre todo si en una zona hay muy pocos talleres.
