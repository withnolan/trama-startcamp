# BRIEF — MVP de Trama (StartCamp UC3M, noviembre 2026)

## Qué es Trama
Herramienta para los departamentos de cumplimiento de marcas de lujo y de fabricantes principales que producen para ellas. Cada mes compara el trabajo que una marca encarga a un taller con las horas que ese taller cotiza a la Seguridad Social. Si no cuadra (más trabajo que plantilla cotizada), avisa con un semáforo y abre un plan de corrección que protege a los trabajadores de toda la cadena.

## Problema (caso real que inspira la demo)
- 2024-2025: el Tribunal de Milán puso bajo administración judicial a Alviero Martini, Armani Operations, Manufactures Dior, Valentino Bags Lab y Loro Piana por no controlar la explotación en talleres subcontratados.
- Loro Piana: su proveedor oficial Evergreen tenía 7 operarias y poca maquinaria pero grandes encargos; subcontrataba a Sor-Man, que pasaba la confección a dos talleres chinos a las afueras de Milán, con trabajadores irregulares y dormitorios en el taller. Chaquetas de cachemir que costaban ~100 € y se vendían por miles.
- Las auditorías sociales comparan pedidos con capacidad en visitas puntuales y avisadas, con datos del propio taller. Falta una comprobación mensual con un dato que el taller no controle.

## Cómo funciona
1. Carga mínima: pedidos de la marca a ese taller × minutos estándar por tipo de pieza.
2. Horas cotizadas: certificado mensual con el TOTAL de horas de la plantilla, sumadas por taller (nunca por trabajador), firmado por el gestor laboral (España) o el consulente del lavoro (Italia, vía Asse.Co).
3. Comparación en periodos móviles de 3 meses, con margen ámbar para picos legítimos.
4. Semáforo verde / ámbar / rojo. Es una ALERTA, no una prueba: abre una revisión.
5. Toda la cadena: un rojo obliga al proveedor a declarar sus subcontratas; cláusula y certificado se extienden a ellas.
6. Plan de corrección revisado por un tercero independiente (sindicato, ONG o consulente asseveratore). La marca no puede reducir pedidos por encima de un límite pactado ni abandonar al taller antes de intentar corregir.
7. Protección de trabajadores: cláusula anti-despido; acompañamiento de ONG/sindicato hacia la regularización (España: arraigo sociolaboral; Italia: permiso art. 18 vía social).
8. Protocolo legal si un rojo apunta a un posible delito.
- Competencia entre marcas: cada marca solo ve su propio semáforo, nunca volúmenes, precios ni nombres de otras marcas.

## Impacto (métricas)
- Principal: trabajadores de toda la cadena que, 6 meses después de la alerta, siguen empleados y dados de alta.
- Secundarias: horas regularizadas; trabajadores acompañados en su regularización; pedidos mantenidos durante el plan.
- Fallo: despido tras la alerta o caída de pedidos por encima del límite.

## Demo de 48 h (lo que el MVP debe enseñar)
Taller de 7 trabajadores que cotiza 3.360 h en el trimestre (7 × 160 × 3) frente a ~8.000 h que exigen solo los pedidos de esta marca (2.000 chaquetas × 4 h, estimación). Semáforo rojo → el proveedor declara su subcontrata → plan de corrección extendido → cláusula anti-despido y límite de reducción de pedidos → panel de trabajadores que siguen empleados y dados de alta.

## Alcance: SOLO el producto
La presentación del pitch se hará aparte (en Lovable). Este MVP es solo la herramienta que usaría un responsable de cumplimiento: no hay landing de marketing, ni historia, ni pitch. La ruta "/" entra directamente en el panel de la marca de demo (o en una pantalla mínima de "Entrar como marca demo").
Pantallas del MVP: panel de la marca (lista de talleres con semáforo y KPIs de impacto), detalle de taller (horas necesarias vs cotizadas, cadena y subcontratas, plan de corrección, protección de trabajadores), "Cómo calculamos", y página legal/avisos.

## Reglas del MVP
- TODOS los datos son inventados (empresas, talleres, personas, cifras). Nada de nombres reales de empresas ni personas en el MVP.
- Idioma de la interfaz: español.
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS; animaciones con una librería de licencia permisiva (MIT/Apache). Sin backend: datos estáticos en el repo y cálculo en una librería TypeScript con tests.
- Se ejecuta en local. Más adelante se subirá a GitHub y se desplegará en Vercel, pero NO se prepara Vercel ahora.
- Usuario: responsable de cumplimiento de una marca o fabricante. El MVP se enseñará en directo al jurado del hackathon como demo del producto.
