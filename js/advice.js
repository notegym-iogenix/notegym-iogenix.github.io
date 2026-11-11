/* Libreta iO.GENIX · motor de consejos post-entreno
 * Clasifica la sesión en un perfil y propone hasta 3 productos.
 * Solo se usan alegaciones autorizadas (en PRODUCTOS) y "momento de uso". */

const PERFILES = {
  fuerza: { t: 'Sesión de fuerza', ico: '🏋️' },
  hipertrofia: { t: 'Sesión de hipertrofia', ico: '💪' },
  hiit: { t: 'Alta intensidad', ico: '⚡' },
  hyrox: { t: 'HYROX / híbrido', ico: '🔥' },
  larga: { t: 'Resistencia de larga duración', ico: '🏃' },
  cardio: { t: 'Sesión de cardio', ico: '❤️' },
  deporte: { t: 'Deporte', ico: '🎾' },
  suave: { t: 'Recuperación activa', ico: '🧘' },
};

function perfilSesion(s, m = metrics(s)) {
  const depEnd = m.dep.some((d) => ENDURANCE_DEP.includes(d));
  const depHiit = m.dep.some((d) => HIIT_DEP.includes(d));
  const depSoft = m.dep.length && m.dep.every((d) => SOFT_DEP.includes(d));
  const rpe = m.rpe || 6;
  if ((rpe <= 4 && m.dur <= 60 && !m.wodMin) || (depSoft && rpe <= 6)) return 'suave';
  const parts = {
    fuerza: m.fuerzaMin,
    cardio: m.cardioMin + (depEnd ? m.depMin : 0),
    hiit: m.wodMin + (depHiit ? m.depMin : 0),
    deporte: (!depEnd && !depHiit && !depSoft) ? m.depMin : 0,
  };
  if (m.hyrox >= 3 || (m.hyrox >= 1 && m.km >= 2)) return 'hyrox';
  const top = Object.entries(parts).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] <= 0) return m.series ? 'hipertrofia' : 'suave';
  if (top[0] === 'fuerza') {
    if (parts.cardio + parts.hiit > m.fuerzaMin * 0.6) return 'hyrox'; // sesión híbrida
    return (m.avgReps && m.avgReps <= 6) || (rpe >= 9 && m.avgReps <= 8) ? 'fuerza' : 'hipertrofia';
  }
  if (top[0] === 'hiit') return 'hiit';
  if (top[0] === 'cardio') return (m.dur >= 75 || m.km >= 12 || parts.cardio >= 75) ? 'larga' : 'cardio';
  return 'deporte';
}

/* Por qué ese producto encaja con ESTE entreno (momento de uso, sin efectos no autorizados) */
const WHY = {
  prot: {
    fuerza: 'Tu batido de después: 30 g con agua o leche y llegas fácil a la proteína del día.',
    hipertrofia: 'Mucho volumen hoy: cierra la sesión con tu batido y reparte la proteína en las comidas.',
    hiit: 'Después de un WOD así, un batido rápido te ayuda a no quedarte corto de proteína.',
    hyrox: 'Correr + estaciones: completa tu proteína del día con un batido al terminar.',
    larga: 'No te olvides de la proteína después de rodar largo: un batido y listo.',
    cardio: 'Batido post-cardio: cómodo para llegar a tu proteína diaria.',
    deporte: 'Tras el partido, un batido es la forma más fácil de sumar proteína.',
    suave: 'Hoy toca recuperar: mantén tu proteína diaria también en los días suaves.',
  },
  casein: 'Entrenas tarde: deja la caseína para tu última toma, antes de dormir.',
  creatina: {
    fuerza: 'Series pesadas y cortas, una detrás de otra: justo el terreno de la creatina. 3 g al día, también en descanso.',
    hipertrofia: 'Muchas series seguidas de alta intensidad: suma tus 3 g diarios de creatina.',
    hiit: 'Esfuerzos breves y muy intensos encadenados: aquí la creatina juega en casa. 3 g cada día.',
    hyrox: 'Trineo, wall balls y burpees son esfuerzos explosivos repetidos: tus 3 g diarios de creatina.',
  },
  arroz: {
    hipertrofia: 'Tu comida post en un minuto: crema de arroz + un cacito de proteína.',
    hiit: 'Has vaciado el depósito: repón hidratos con una crema de arroz con tu proteína.',
    hyrox: 'Para reponer hidratos tras correr y empujar: crema de arroz en tu comida post.',
    larga: 'Tras una sesión larga, prioriza los hidratos: crema de arroz con fruta o tu proteína.',
    deporte: 'Partido largo: una crema de arroz en tu siguiente comida para reponer hidratos.',
  },
  avena: {
    cardio: 'Para tu próximo desayuno antes de correr: avena en harina, lista en segundos.',
    larga: 'Antes de tu próxima tirada larga: desayuno de avena con tiempo para digerirlo.',
  },
  hydra: {
    hyrox: 'Para la próxima sesión: Hydra Train en el bidón y ve bebiendo durante el entreno.',
    larga: 'En sesiones de más de una hora, lleva tu bidón con Hydra Train y ve bebiendo a sorbos.',
    cardio: 'Si aprieta el calor o sudas mucho, prepara Hydra Train para beber durante el entreno.',
    deporte: 'Para tu próximo partido: Hydra Train en el bidón para beber en los descansos.',
    hiit: 'Sesión larga y sudada: prepara Hydra Train para ir bebiendo durante el entreno.',
  },
  intra: 'Sesión de más de hora y cuarto: para la próxima, un Intra-Work en el bidón.',
  mag3: {
    cardio: 'Para el día a día: tu dosis de MAG-3 en una infusión o un vaso de agua.',
    suave: 'Día tranquilo, buen momento para tu rutina de magnesio con MAG-3.',
    deporte: 'Entre partido y partido, mantén tu rutina de magnesio con MAG-3.',
    larga: 'Mucho volumen de entreno esta semana: mantén tu magnesio con MAG-3.',
  },
  vitc: {
    larga: 'Tras un esfuerzo largo e intenso, tu cápsula diaria de vitamina C.',
    hyrox: 'Semana de esfuerzos intensos: tu cápsula diaria de vitamina C.',
    deporte: 'Mucha intensidad esta semana: mantén tu vitamina C diaria.',
  },
};

/* Consejos de alimentación (sin producto) */
const TIPS = {
  fuerza: ['Reparte la proteína en 3-4 comidas a lo largo del día.', 'Duerme 7-9 horas: el descanso también es entreno.'],
  hipertrofia: ['Incluye una ración de proteína y otra de hidratos en tu comida post.', 'Apunta los kilos: la próxima vez intenta superar una serie.'],
  hiit: ['Bebe agua a lo largo del día para compensar lo que has sudado.', 'Mañana, si lo notas cargado, mete una sesión suave o movilidad.'],
  hyrox: ['Hidratos + proteína en tu siguiente comida, y agua a sorbos durante la tarde.', 'Anota tus tiempos por estación para ver dónde mejoras.'],
  larga: ['Repón agua de forma progresiva durante las próximas horas.', 'Prioriza los hidratos en las próximas comidas.'],
  cardio: ['Bebe agua después del entreno y a lo largo del día.', 'Alterna días suaves y días de calidad para progresar.'],
  deporte: ['Hidrátate bien antes, durante y después del partido.', 'Si juegas varios días seguidos, cuida el descanso entre medias.'],
  suave: ['Los días suaves también suman: movilidad, paseo y buen descanso.', 'Mantén tu alimentación habitual, sin necesidad de compensar.'],
};

function consejo(s) {
  const m = metrics(s);
  const perfil = perfilSesion(s, m);
  const pref = { whey: 'whey', iso: 'iso', vegana: 'vegan' }[S.perfil.proteina] || 'whey';
  const fin = (s.fin || s.inicio + (s.dur || 60) * 60000);
  const noche = new Date(fin).getHours() >= 20 || new Date(fin).getHours() < 4;
  let picks = [];
  const add = (key, why) => { if (why && !picks.find((p) => p.key === key)) picks.push({ key, why }); };
  const prot = () => add(pref, WHY.prot[perfil]);
  switch (perfil) {
    case 'fuerza': prot(); add('creatina', WHY.creatina.fuerza); break;
    case 'hipertrofia': prot(); add('arroz', WHY.arroz.hipertrofia); if (m.series >= 15) add('creatina', WHY.creatina.hipertrofia); break;
    case 'hiit': add('creatina', WHY.creatina.hiit); prot(); if (m.dur >= 60) add('hydra', WHY.hydra.hiit); else add('arroz', WHY.arroz.hiit); break;
    case 'hyrox': add('arroz', WHY.arroz.hyrox); prot(); add(m.dur >= 60 ? 'hydra' : 'creatina', m.dur >= 60 ? WHY.hydra.hyrox : WHY.creatina.hyrox); break;
    case 'larga': add('arroz', WHY.arroz.larga); add('hydra', WHY.hydra.larga); if ((s.rpe || 6) >= 7) add('vitc', WHY.vitc.larga); else prot(); break;
    case 'cardio': prot(); add('avena', WHY.avena.cardio); add((s.rpe || 6) >= 7 ? 'hydra' : 'mag3', (s.rpe || 6) >= 7 ? WHY.hydra.cardio : WHY.mag3.cardio); break;
    case 'deporte': add('hydra', WHY.hydra.deporte); prot(); if (m.dur >= 80) add('arroz', WHY.arroz.deporte); else add('mag3', WHY.mag3.deporte); break;
    case 'suave': add('mag3', WHY.mag3.suave); prot(); break;
  }
  if (noche && perfil !== 'suave') {
    picks = picks.filter((p) => !['whey', 'iso', 'vegan'].includes(p.key) || pref === 'vegan');
    if (pref !== 'vegan') picks.splice(1, 0, { key: 'casein', why: WHY.casein });
  }
  picks = picks.slice(0, 3);
  if (S.perfil.adulto !== true) picks = [];
  return { perfil, m, picks, tips: TIPS[perfil] || [], noche };
}

/* Mensaje de "buen trabajo" */
function mensajeOk(s, m, prs) {
  const n = (S.perfil.nombre || '').trim().split(' ')[0];
  const seed = parseInt(String(s.id).slice(-4), 36) || 0;
  let f = FRASES_OK[seed % FRASES_OK.length];
  f = n ? f.replace('{n}', esc(n)) : f.replace(', {n}', '');
  const partes = [];
  if (m.series) partes.push(`${m.series} series`);
  if (m.vol >= 1) partes.push(`${fmtN(m.vol)} kg movidos`);
  if (m.km >= 0.1) partes.push(`${fmtN(m.km, 2)} km`);
  if (m.dep.length) partes.push(m.dep.join(' + '));
  partes.push(fmtMin(m.dur));
  let extra = '';
  const sem = sesionesSemana(s.inicio).filter((x) => x.inicio <= s.inicio).length;
  if (sem >= 2) extra = `Llevas ${sem} entrenos esta semana. ¡Esa constancia es la que marca la diferencia!`;
  else extra = 'Primer entreno de la semana: lo más difícil ya está hecho.';
  // comparación con la última sesión del mismo nombre
  const prev = S.sesiones.find((x) => x.id !== s.id && x.inicio < s.inicio && x.nombre && x.nombre === s.nombre);
  if (prev) {
    const pm = metrics(prev);
    if (pm.vol > 0 && m.vol > 0) { const d = Math.round((m.vol / pm.vol - 1) * 100); if (d > 0) extra = `+${d} % de volumen respecto a la última vez que hiciste «${esc(s.nombre)}». 📈`; }
  }
  if (prs.length) extra = `${prs.length === 1 ? 'Has batido 1 récord' : `Has batido ${prs.length} récords`} hoy. 🏆 ` + extra;
  return { titulo: f, linea: partes.join(' · '), extra };
}
