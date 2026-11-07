# Rúbrica del jurado simulado (fija toda la noche)

**Por qué esta.** El Start Camp 2026 no publica rúbrica (ver `investigacion/evento.md`). Su 1.er premio da pase a la clasificatoria nacional del Hult Prize, que puntúa **Team · Idea · Impact · Business** y, en la fase nacional, **encaje producto-mercado y salida al mercado**. Como referencia local se usa la rúbrica de otros programas de la UC3M (Impacto 30 · Innovación 20 · Viabilidad 15 · Escalabilidad 15 · Ventaja competitiva 10 · Equipo 10). Esta rúbrica junta las dos: mantiene el peso del impacto (hackathon de emprendimiento social), separa la validación porque es el punto débil que más castiga un jurado real de hackathon universitario, y añade el pitch y la demo porque en 4 + 2 minutos es lo que el jurado ve de verdad. No se cambia a mitad de la noche.

| Clave | Criterio | Peso | Qué mira el jurado | Origen |
|---|---|---|---|---|
| `problema_impacto` | Problema e impacto social | 25 | Problema real y entendido a fondo; a quién afecta; ODS concreto; impacto medible y creíble antes de 2030; riesgo de efectos perversos | Hult Impact + Idea · UC3M Impacto |
| `solucion_innovacion` | Solución, innovación y ventaja | 20 | Solución práctica; qué hace distinto frente a lo que existe; si es defendible | Hult Idea · UC3M Innovación + Ventaja |
| `negocio_viabilidad` | Modelo de negocio y viabilidad | 20 | Quién paga y por qué; precio y margen; mercado de abajo arriba; viabilidad técnica, legal y operativa; escalabilidad | Hult Business · UC3M Viabilidad + Escalabilidad |
| `validacion_gtm` | Validación y salida al mercado | 15 | Evidencia real (no inventada); qué falta y cómo se va a conseguir; primer cliente, piloto y canal | Hult nacional: encaje producto-mercado + salida al mercado |
| `equipo_ejecucion` | Equipo y ejecución | 10 | Roles claros, compromiso, capacidad de ejecutar; calidad de lo construido en 48 h | Hult Team · UC3M Equipo |
| `pitch_demo` | Pitch y demo | 10 | Historia, claridad, demo que convence, honestidad con los huecos, preparación para preguntas | Formato 4 + 2 min |

**Escala por criterio (1-10):** 1-3 débil o ausente · 4-5 flojo, con huecos graves · 6-7 correcto, con huecos que se ven · 8-9 sólido, por encima de la media de un hackathon universitario · 10 excepcional.
**Nota ponderada** = Σ (nota × peso) / 100. Además, cada jurado da una **nota global** 1-10 a ojo («¿le darías el 1.er premio?») y: lo más fuerte, el fallo principal, la pregunta que haría y qué le subiría la nota.
**Honestidad:** inventar validación o cifras sin fuente es penalización máxima en `validacion_gtm` y en `pitch_demo`. Un hueco dicho con honestidad y con una petición concreta no se castiga como un hueco escondido.

**Comparación entre rondas:** las medias se calculan con `node jurado/medias.mjs` sobre todos los jurados y, aparte, solo sobre los perfiles fijos (los que se repiten en todas las rondas).
