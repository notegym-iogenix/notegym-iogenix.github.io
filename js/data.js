/* Libreta iO.GENIX · datos fijos (ejercicios, plantillas, productos y consejos)
 * Para cambiar un enlace de la tienda o un texto de producto, toca solo PRODUCTOS.
 * m = forma de medir la serie:
 *   kg   → peso + repeticiones          bw  → repeticiones (+ lastre opcional)
 *   seg  → segundos (+ peso opcional)   dist → distancia (km) + tiempo + FC
 *   m    → metros + peso + tiempo (trineo, granjero, zancadas HYROX…)
 */
const TIENDA = 'https://tienda.iogenixnutrition.com';
const UTM = 'utm_source=libreta_iogenix&utm_medium=app&utm_campaign=libreta_entreno';

const GRUPOS = ['Pecho', 'Espalda', 'Hombro', 'Pierna', 'Glúteo', 'Brazos', 'Core', 'HYROX / Funcional', 'Cardio'];

const EJERCICIOS = [
  // Pecho
  ['press-banca', 'Press banca', 'Pecho', 'kg'],
  ['press-inclinado-barra', 'Press inclinado con barra', 'Pecho', 'kg'],
  ['press-mancuernas', 'Press con mancuernas', 'Pecho', 'kg'],
  ['press-inclinado-manc', 'Press inclinado con mancuernas', 'Pecho', 'kg'],
  ['aperturas', 'Aperturas / contractora', 'Pecho', 'kg'],
  ['cruce-poleas', 'Cruce de poleas', 'Pecho', 'kg'],
  ['fondos', 'Fondos en paralelas', 'Pecho', 'bw'],
  ['flexiones', 'Flexiones', 'Pecho', 'bw'],
  ['press-maquina', 'Press en máquina', 'Pecho', 'kg'],
  // Espalda
  ['dominadas', 'Dominadas', 'Espalda', 'bw'],
  ['jalon', 'Jalón al pecho', 'Espalda', 'kg'],
  ['remo-barra', 'Remo con barra', 'Espalda', 'kg'],
  ['remo-mancuerna', 'Remo con mancuerna', 'Espalda', 'kg'],
  ['remo-polea', 'Remo en polea baja', 'Espalda', 'kg'],
  ['remo-maquina', 'Remo en máquina', 'Espalda', 'kg'],
  ['pullover-polea', 'Pullover en polea', 'Espalda', 'kg'],
  ['peso-muerto', 'Peso muerto', 'Espalda', 'kg'],
  ['face-pull', 'Face pull', 'Espalda', 'kg'],
  // Hombro
  ['press-militar', 'Press militar', 'Hombro', 'kg'],
  ['press-hombro-manc', 'Press de hombro con mancuernas', 'Hombro', 'kg'],
  ['elevaciones-laterales', 'Elevaciones laterales', 'Hombro', 'kg'],
  ['pajaros', 'Pájaros / deltoides posterior', 'Hombro', 'kg'],
  ['elevaciones-frontales', 'Elevaciones frontales', 'Hombro', 'kg'],
  // Pierna
  ['sentadilla', 'Sentadilla', 'Pierna', 'kg'],
  ['sentadilla-frontal', 'Sentadilla frontal', 'Pierna', 'kg'],
  ['sentadilla-goblet', 'Sentadilla goblet', 'Pierna', 'kg'],
  ['prensa', 'Prensa', 'Pierna', 'kg'],
  ['hack', 'Sentadilla hack', 'Pierna', 'kg'],
  ['bulgara', 'Sentadilla búlgara', 'Pierna', 'kg'],
  ['zancadas', 'Zancadas', 'Pierna', 'kg'],
  ['extension-cuadriceps', 'Extensión de cuádriceps', 'Pierna', 'kg'],
  ['curl-femoral', 'Curl femoral', 'Pierna', 'kg'],
  ['peso-muerto-rumano', 'Peso muerto rumano', 'Pierna', 'kg'],
  ['gemelo', 'Elevación de gemelos', 'Pierna', 'kg'],
  ['step-up', 'Subidas al cajón', 'Pierna', 'kg'],
  // Glúteo
  ['hip-thrust', 'Hip thrust', 'Glúteo', 'kg'],
  ['puente-gluteo', 'Puente de glúteo', 'Glúteo', 'kg'],
  ['patada-gluteo', 'Patada de glúteo en polea', 'Glúteo', 'kg'],
  ['abduccion', 'Abducción en máquina', 'Glúteo', 'kg'],
  ['peso-muerto-sumo', 'Peso muerto sumo', 'Glúteo', 'kg'],
  // Brazos
  ['curl-barra', 'Curl con barra', 'Brazos', 'kg'],
  ['curl-mancuernas', 'Curl con mancuernas', 'Brazos', 'kg'],
  ['curl-martillo', 'Curl martillo', 'Brazos', 'kg'],
  ['curl-polea', 'Curl en polea', 'Brazos', 'kg'],
  ['triceps-polea', 'Extensión de tríceps en polea', 'Brazos', 'kg'],
  ['press-frances', 'Press francés', 'Brazos', 'kg'],
  ['fondos-banco', 'Fondos en banco', 'Brazos', 'bw'],
  // Core
  ['plancha', 'Plancha', 'Core', 'seg'],
  ['plancha-lateral', 'Plancha lateral', 'Core', 'seg'],
  ['crunch', 'Crunch', 'Core', 'bw'],
  ['elevacion-piernas', 'Elevación de piernas colgado', 'Core', 'bw'],
  ['rueda', 'Rueda abdominal', 'Core', 'bw'],
  ['pallof', 'Press Pallof', 'Core', 'kg'],
  ['dead-bug', 'Dead bug', 'Core', 'bw'],
  ['russian-twist', 'Russian twist', 'Core', 'bw'],
  // HYROX / Funcional
  ['skierg', 'SkiErg', 'HYROX / Funcional', 'm'],
  ['sled-push', 'Sled push (empuje de trineo)', 'HYROX / Funcional', 'm'],
  ['sled-pull', 'Sled pull (arrastre de trineo)', 'HYROX / Funcional', 'm'],
  ['burpee-broad-jump', 'Burpee broad jump', 'HYROX / Funcional', 'm'],
  ['remo-ergometro', 'Remo ergómetro', 'HYROX / Funcional', 'm'],
  ['farmers-carry', 'Farmers carry (paseo del granjero)', 'HYROX / Funcional', 'm'],
  ['sandbag-lunges', 'Sandbag lunges', 'HYROX / Funcional', 'm'],
  ['wall-balls', 'Wall balls', 'HYROX / Funcional', 'kg'],
  ['burpees', 'Burpees', 'HYROX / Funcional', 'bw'],
  ['kettlebell-swing', 'Kettlebell swing', 'HYROX / Funcional', 'kg'],
  ['thrusters', 'Thrusters', 'HYROX / Funcional', 'kg'],
  ['box-jump', 'Box jumps', 'HYROX / Funcional', 'bw'],
  ['comba', 'Comba (saltos)', 'HYROX / Funcional', 'bw'],
  ['assault-bike', 'Assault / air bike', 'HYROX / Funcional', 'm'],
  ['clean', 'Cargada (clean)', 'HYROX / Funcional', 'kg'],
  // Cardio
  ['carrera', 'Carrera', 'Cardio', 'dist'],
  ['cinta', 'Cinta de correr', 'Cardio', 'dist'],
  ['bici', 'Bicicleta / spinning', 'Cardio', 'dist'],
  ['eliptica', 'Elíptica', 'Cardio', 'dist'],
  ['natacion', 'Natación', 'Cardio', 'dist'],
  ['caminar', 'Caminar / senderismo', 'Cardio', 'dist'],
  ['escaleras', 'Escaladora / escaleras', 'Cardio', 'dist'],
].map(([id, n, g, m]) => ({ id, n, g, m }));

const DEPORTES = ['Pádel', 'Fútbol', 'Fútbol sala', 'Baloncesto', 'Tenis', 'Running (carrera)', 'Ciclismo', 'Natación', 'Crossfit (clase)', 'HYROX (clase)', 'Artes marciales / boxeo', 'Escalada', 'Yoga / pilates', 'Clase dirigida', 'Voleibol', 'Balonmano', 'Rugby', 'Esquí / snow', 'Surf', 'Otro'];

const FORMATOS_WOD = {
  'AMRAP': 'Máximas rondas en un tiempo',
  'EMOM': 'Cada minuto, al minuto',
  'For Time': 'Lo más rápido posible',
  'Tabata': '20 s trabajo / 10 s descanso',
  'Rondas': 'X rondas, a tu ritmo',
};

/* Plantillas iO.GENIX (basadas en nuestras guías de entrenamiento)
 * s = series objetivo · r = reps/segundos/metros objetivo · d = descanso en segundos */
const PLANTILLAS_IOGENIX = [
  {
    id: 'io-fullbody', nombre: 'Full Body · Gimnasio', desc: 'Todo el cuerpo en 60 min. Ideal 2-3 días/semana.', tipo: 'fuerza',
    bloques: [
      { k: 'ej', ej: 'sentadilla', s: 4, r: 8, d: 120 },
      { k: 'ej', ej: 'press-banca', s: 4, r: 8, d: 120 },
      { k: 'ej', ej: 'remo-barra', s: 3, r: 10, d: 90 },
      { k: 'ej', ej: 'press-hombro-manc', s: 3, r: 10, d: 90 },
      { k: 'ej', ej: 'peso-muerto-rumano', s: 3, r: 10, d: 90 },
      { k: 'ej', ej: 'plancha', s: 3, r: 40, d: 45 },
    ],
  },
  {
    id: 'io-torso', nombre: 'Torso · Hipertrofia', desc: 'Pecho, espalda, hombro y brazos.', tipo: 'fuerza',
    bloques: [
      { k: 'ej', ej: 'press-inclinado-manc', s: 4, r: 10, d: 90 },
      { k: 'ej', ej: 'jalon', s: 4, r: 10, d: 90 },
      { k: 'ej', ej: 'press-maquina', s: 3, r: 12, d: 75 },
      { k: 'ej', ej: 'remo-polea', s: 3, r: 12, d: 75 },
      { k: 'ej', ej: 'elevaciones-laterales', s: 3, r: 15, d: 60 },
      { k: 'ej', ej: 'curl-mancuernas', s: 3, r: 12, d: 60 },
      { k: 'ej', ej: 'triceps-polea', s: 3, r: 12, d: 60 },
    ],
  },
  {
    id: 'io-pierna', nombre: 'Pierna y glúteo', desc: 'Cuádriceps, femoral y glúteo.', tipo: 'fuerza',
    bloques: [
      { k: 'ej', ej: 'sentadilla', s: 4, r: 8, d: 150 },
      { k: 'ej', ej: 'hip-thrust', s: 4, r: 10, d: 90 },
      { k: 'ej', ej: 'bulgara', s: 3, r: 10, d: 90 },
      { k: 'ej', ej: 'curl-femoral', s: 3, r: 12, d: 60 },
      { k: 'ej', ej: 'extension-cuadriceps', s: 3, r: 12, d: 60 },
      { k: 'ej', ej: 'gemelo', s: 4, r: 15, d: 45 },
    ],
  },
  {
    id: 'io-casa', nombre: 'En casa · Mancuernas y bandas', desc: 'Sin máquinas. De nuestra Guía en casa.', tipo: 'fuerza',
    bloques: [
      { k: 'ej', ej: 'sentadilla-goblet', s: 4, r: 12, d: 60 },
      { k: 'ej', ej: 'flexiones', s: 4, r: 12, d: 60 },
      { k: 'ej', ej: 'remo-mancuerna', s: 4, r: 12, d: 60 },
      { k: 'ej', ej: 'zancadas', s: 3, r: 12, d: 60 },
      { k: 'ej', ej: 'puente-gluteo', s: 3, r: 15, d: 45 },
      { k: 'ej', ej: 'dead-bug', s: 3, r: 12, d: 45 },
    ],
  },
  {
    id: 'io-hyrox', nombre: 'HYROX · Estaciones', desc: 'Carrera + las 8 estaciones en formato corto.', tipo: 'hyrox',
    bloques: [
      { k: 'ej', ej: 'carrera', s: 4, r: 1, d: 0 },
      { k: 'ej', ej: 'skierg', s: 1, r: 500, d: 0 },
      { k: 'ej', ej: 'sled-push', s: 2, r: 25, d: 60 },
      { k: 'ej', ej: 'sled-pull', s: 2, r: 25, d: 60 },
      { k: 'ej', ej: 'burpee-broad-jump', s: 1, r: 40, d: 0 },
      { k: 'ej', ej: 'remo-ergometro', s: 1, r: 500, d: 0 },
      { k: 'ej', ej: 'farmers-carry', s: 1, r: 100, d: 0 },
      { k: 'ej', ej: 'sandbag-lunges', s: 1, r: 50, d: 0 },
      { k: 'ej', ej: 'wall-balls', s: 1, r: 50, d: 0 },
    ],
  },
  {
    id: 'io-amrap', nombre: 'WOD · AMRAP 12', desc: 'Circuito metabólico de la Guía en casa.', tipo: 'wod',
    bloques: [
      { k: 'wod', formato: 'AMRAP', min: 12, mov: '10 sentadillas goblet\n10 flexiones\n10 kettlebell swings\n200 m carrera o 30 saltos de comba' },
    ],
  },
  {
    id: 'io-emom', nombre: 'WOD · EMOM 16', desc: '4 movimientos alternos, 4 vueltas.', tipo: 'wod',
    bloques: [
      { k: 'wod', formato: 'EMOM', min: 16, mov: 'Min 1: 12 wall balls\nMin 2: 10 burpees\nMin 3: 15 kettlebell swings\nMin 4: 12 cal remo / bici' },
    ],
  },
  {
    id: 'io-z2', nombre: 'Carrera · Rodaje suave', desc: 'Zona 2, ritmo conversacional.', tipo: 'cardio',
    bloques: [{ k: 'ej', ej: 'carrera', s: 1, r: 8, d: 0 }],
  },
  {
    id: 'io-series', nombre: 'Carrera · Series 6×800', desc: '6 repeticiones con 2 min de recuperación.', tipo: 'cardio',
    bloques: [{ k: 'ej', ej: 'carrera', s: 6, r: 0.8, d: 120 }],
  },
];

/* ------------------------------------------------------------------
 * PRODUCTOS · solo alegaciones autorizadas (Reg. UE 432/2012) o texto
 * de composición / momento de uso. No añadir efectos sin claim.
 * img → carpeta img/. url → ficha en la tienda (se le añade la UTM).
 * ------------------------------------------------------------------ */
const PRODUCTOS = {
  whey: {
    n: 'WHEY 80 Professional', img: 'img/whey.webp',
    url: TIENDA + '/nutricion-deportiva/1404-whey-80-professional-1-kg.html',
    comp: 'Concentrado de proteína de suero LACTOMIN® con enzimas digestivas DigeZyme® y vitamina B6.',
    claim: 'Las proteínas contribuyen a que aumente la masa muscular.',
  },
  iso: {
    n: 'ISOLUXE CFM', img: 'img/isoluxe.webp',
    url: TIENDA + '/proteinas/9197-isoluxe-cfm-500g.html',
    comp: 'Aislado de suero ISOLAC® + hidrolizado OPTIPEP®, bajo en lactosa y sin gluten.',
    claim: 'Las proteínas contribuyen a que aumente la masa muscular.',
  },
  vegan: {
    n: 'VEGAN PROTEIN', img: 'img/vegan.webp',
    url: TIENDA + '/nutricion-deportiva/8973-vegan-protein-900g.html',
    comp: 'Aislado de proteína de guisante y arroz, 100 % vegetal y sin soja.',
    claim: 'Las proteínas contribuyen a que aumente la masa muscular.',
  },
  casein: {
    n: 'CASEIN Professional', img: 'img/casein.webp',
    url: TIENDA + '/nutricion-deportiva/1601-casein-professional-900g.html',
    comp: 'Caseína de liberación sostenida, perfecta como última toma antes de dormir.',
    claim: 'Las proteínas contribuyen a conservar la masa muscular.',
  },
  creatina: {
    n: 'CREALUXE · Creapure®', img: 'img/crealuxe.webp',
    url: TIENDA + '/inicio/9132-crealuxe-500g.html',
    comp: 'Creatina monohidrato 100 % Creapure®, micronizada. Dosis diaria: 3 g, también en días de descanso.',
    claim: 'La creatina aumenta el rendimiento físico en series sucesivas de ejercicios breves de alta intensidad. El efecto beneficioso se obtiene con una ingesta diaria de 3 g de creatina.',
  },
  arroz: {
    n: 'Crema de Arroz', img: 'img/arroz.webp',
    url: TIENDA + '/nutricion-deportiva/4942-crema-de-arroz.html',
    comp: 'Harina de arroz precocida: unos 37 g de hidratos por cada 50 g. Lista en segundos con agua, leche o bebida vegetal.',
    claim: '',
  },
  avena: {
    n: 'Delicious Oatmeal', img: 'img/oat.webp',
    url: TIENDA + '/nutricion-deportiva/2398-delicious-oatmeal.html',
    comp: 'Harina 100 % de avena, neutra o de sabores, para tu desayuno o tus tortitas.',
    claim: '',
  },
  hydra: {
    n: 'HYDRA TRAIN', img: 'img/hydra.webp',
    url: TIENDA + '/special-athlete-edition/9144-hydra-train.html',
    comp: 'Bebida para tomar durante el entreno con agua de coco, minerales y alanil-glutamina.',
    claim: '',
  },
  intra: {
    n: 'INTRA-WORK Professional', img: 'img/intra.webp',
    url: TIENDA + '/nutricion-deportiva/706-intrawork-professional.html',
    comp: 'Bebida intra-entreno con Cluster Dextrin™ (hidratos), BCAA 2:1:1 y citrato de magnesio.',
    claim: '',
  },
  mag3: {
    n: 'MAG-3 Triple Magnesium', img: 'img/mag3.webp',
    url: TIENDA + '/inicio/9241-mag-3-triple-magnesium-250g.html',
    comp: 'Bisglicinato, citrato y malato de magnesio + vitamina B6 (50 % VRN de cada uno por dosis).',
    claim: 'El magnesio contribuye a disminuir el cansancio y la fatiga y al funcionamiento normal de los músculos.',
  },
  vitc: {
    n: 'VITAMIN C 1000 mg', img: 'img/vitc.webp',
    url: TIENDA + '/vitaminas-y-minerales/2898-vitamin-c-1000mg-8435569301077.html',
    comp: 'Vitamina C pura, 1000 mg por cápsula.',
    claim: 'La vitamina C contribuye a mantener el funcionamiento normal del sistema inmunitario durante el ejercicio físico intenso y después de este. El efecto beneficioso se obtiene con una ingesta diaria de 200 mg además de la ingesta diaria recomendada.',
  },
};

const GUIAS = [
  { n: 'Guía de entrenamiento híbrido', url: TIENDA + '/inicio/9273-ebook-guia-de-entrenamiento-hibrido.html' },
  { n: 'Guía para optimizar la ganancia de masa muscular', url: TIENDA + '/seminarios/9175-ebook-guia-para-optimizar-la-ganancia-de-masa-muscular.html' },
  { n: 'Guía de entrenamiento', url: TIENDA + '/seminarios/8965-ebook-guia-de-entrenamiento.html' },
];

const AVISO_LEGAL = 'Los complementos alimenticios no deben utilizarse como sustitutos de una dieta variada y equilibrada y de un estilo de vida saludable. No superar la dosis diaria recomendada. Información general para adultos sanos: para una pauta personalizada consulta a un dietista-nutricionista o a tu médico. Revisa alérgenos y trazas en la etiqueta.';

const FRASES_OK = [
  '¡Buen trabajo, {n}! 💪', '¡Entreno a la saca, {n}! 🔥', '¡Así se hace, {n}! 👏', '¡Otro ladrillo más, {n}! 🧱', '¡Hoy has cumplido, {n}! ✅', '¡Qué sesión, {n}! ⚡',
];
