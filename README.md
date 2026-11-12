# Libreta de entreno iO.GENIX

Regalo para la comunidad de iO.GENIX: una libreta de entrenamiento instalable (PWA) que funciona sin conexión y sin registro.

**App:** https://ayolabsia-lab.github.io/notegym-iogenix/

## Qué hace
- Registro de fuerza (kg × reps × RPE), peso corporal, isométricos, cardio por vueltas (km, tiempo, FC, ritmo), estaciones HYROX (metros, kg, tiempo), WODs (AMRAP, EMOM, For Time, Tabata) y deportes (pádel, fútbol…).
- Sugerencias con los datos de la última vez, descanso automático entre series y descanso real medido.
- Cronómetro: descanso, AMRAP con contador de rondas, EMOM, For Time, Tabata e intervalos.
- Récords personales (peso máximo, 1RM estimado, reps, distancia, ritmo) y gráficas por ejercicio y por semana.
- Rutinas propias y rutinas iO.GENIX listas para usar.
- Imagen 1080×1920 para stories con mención a @io.genix.
- Consejo post-entreno: clasifica la sesión y recomienda hasta 3 productos iO.GENIX con su alegación autorizada.
- Copia de seguridad (JSON) y exportación a Excel (CSV).

## Datos y privacidad
Todo se guarda en el `localStorage` del dispositivo. No hay cuentas, cookies ni analítica. Los enlaces a la tienda llevan `utm_source=libreta_iogenix&utm_medium=app&utm_campaign=libreta_entreno` para medir en GA4.

## Mantenimiento
- **Productos, enlaces y alegaciones:** `js/data.js` → `PRODUCTOS` (solo claims del Reg. UE 432/2012 o texto de composición). Cuando cambie la web, actualizar `TIENDA` y las rutas.
- **Lógica del consejo:** `js/advice.js` (perfiles y textos «por qué»).
- **Rutinas iO.GENIX:** `js/data.js` → `PLANTILLAS_IOGENIX`.
- **Publicar cambios:** subir `?v=` en `index.html` y `CACHE` en `sw.js` para que los móviles cojan la versión nueva.

AYOLABS, S.L.
