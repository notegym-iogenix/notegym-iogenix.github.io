/* Libreta iO.GENIX · estado, utilidades, métricas y récords */
const KEY = 'libreta_iogenix_v1';
const VERSION = '1.0.0';

const DEFAULT_STATE = () => ({
  v: 1,
  perfil: { nombre: '', proteina: 'whey', adulto: null, descanso: 90, sonido: true, vibrar: true, onb: false },
  sesiones: [],
  plantillas: [],
  custom: [],
  activa: null,
});

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE();
    const s = JSON.parse(raw);
    const d = DEFAULT_STATE();
    return { ...d, ...s, perfil: { ...d.perfil, ...(s.perfil || {}) } };
  } catch (e) { return DEFAULT_STATE(); }
}
let S = loadState();
let saveT = null;
function save(now) {
  clearTimeout(saveT);
  const w = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('No se ha podido guardar: memoria llena'); } };
  if (now) w(); else saveT = setTimeout(w, 250);
}
window.addEventListener('pagehide', () => save(true));
document.addEventListener('visibilitychange', () => { if (document.hidden) save(true); });

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v) => { if (v === '' || v == null) return NaN; const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : NaN; };
const has = (v) => !isNaN(num(v));
const r1 = (n) => Math.round(n * 10) / 10;
const fmtN = (n, d = 0) => isNaN(n) ? '–' : n.toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: 0 });
const pad = (n) => String(n).padStart(2, '0');

function fmtClock(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
function fmtMin(min) {
  if (!min) return '0 min';
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  return h ? `${h} h ${m ? m + ' min' : ''}`.trim() : `${m} min`;
}
/* "45" → 45 min · "4:30" → 4 min 30 s · "1:02:10" → h:mm:ss. Devuelve segundos */
function parseTime(v) {
  if (v == null || v === '') return NaN;
  const p = String(v).trim().replace(',', '.').split(/[:'.]/).map(Number);
  if (p.some(isNaN)) return NaN;
  if (p.length === 1) return p[0] * 60;
  if (p.length === 2) return p[0] * 60 + p[1];
  return p[0] * 3600 + p[1] * 60 + (p[2] || 0);
}
const fmtPace = (secPerKm) => isFinite(secPerKm) && secPerKm > 0 ? `${Math.floor(secPerKm / 60)}:${pad(Math.round(secPerKm % 60))} /km` : '–';

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
function startOfWeek(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return d.getTime(); }
function fmtFecha(t, larga) {
  const d = new Date(t);
  const base = `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`;
  return larga ? `${base} ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}` : base;
}

/* ---------- ejercicios ---------- */
function ejMap() { return Object.fromEntries([...EJERCICIOS, ...S.custom].map((e) => [e.id, e])); }
let EJ = ejMap();
const ej = (id) => EJ[id] || { id, n: id, g: 'Otros', m: 'kg' };

/* Columnas por forma de medir: [campo a, campo b, campo c] */
const COLS = {
  kg: [['Kg', 'decimal'], ['Reps', 'numeric'], ['RPE', 'decimal']],
  bw: [['Reps', 'numeric'], ['+Kg', 'decimal'], ['RPE', 'decimal']],
  seg: [['Seg', 'numeric'], ['Kg', 'decimal'], ['RPE', 'decimal']],
  dist: [['Km', 'decimal'], ['Tiempo', 'text'], ['FC', 'numeric']],
  m: [['Metros', 'numeric'], ['Kg', 'decimal'], ['Tiempo', 'text']],
};
const ROW_LABEL = { kg: 'Serie', bw: 'Serie', seg: 'Serie', dist: 'Vuelta / tramo', m: 'Ronda' };

/* ---------- métricas de una sesión ---------- */
const e1rm = (kg, reps) => (kg > 0 && reps > 0 && reps <= 12) ? kg * (1 + reps / 30) : NaN;
const ENDURANCE_DEP = ['Running (carrera)', 'Ciclismo', 'Natación', 'Esquí / snow', 'Surf'];
const HIIT_DEP = ['Crossfit (clase)', 'HYROX (clase)', 'Artes marciales / boxeo'];
const SOFT_DEP = ['Yoga / pilates'];

function rowsDone(b) { return (b.series || []).filter((r) => r.hecho || has(r.a)); }

function metrics(s) {
  const m = { dur: s.dur || 0, series: 0, reps: 0, vol: 0, km: 0, cardioMin: 0, wodMin: 0, depMin: 0, hyrox: 0, kgSeries: 0, repsKg: 0, fuerzaSeries: 0, dep: [], ejercicios: 0, rpe: s.rpe || 0 };
  const hyroxIds = new Set();
  for (const b of s.bloques || []) {
    if (b.k === 'ej') {
      const e = ej(b.ej); const rows = rowsDone(b);
      if (!rows.length) continue;
      m.ejercicios++;
      if (e.g === 'HYROX / Funcional') hyroxIds.add(b.ej);
      for (const r of rows) {
        if (e.m === 'kg') { const kg = num(r.a), reps = num(r.b); m.series++; m.fuerzaSeries++; if (reps > 0) { m.reps += reps; m.kgSeries++; m.repsKg += reps; } if (kg > 0 && reps > 0) m.vol += kg * reps; }
        else if (e.m === 'bw') { const reps = num(r.a), kg = num(r.b); m.series++; m.fuerzaSeries++; if (reps > 0) { m.reps += reps; m.kgSeries++; m.repsKg += reps; } if (kg > 0 && reps > 0) m.vol += kg * reps; }
        else if (e.m === 'seg') { m.series++; m.fuerzaSeries++; }
        else if (e.m === 'dist') { const km = num(r.a), t = parseTime(r.b); if (km > 0) m.km += km; if (t > 0) m.cardioMin += t / 60; else if (km > 0) m.cardioMin += km * 6; }
        else if (e.m === 'm') { m.series++; const t = parseTime(r.c); m.wodMin += t > 0 ? t / 60 : 1.5; const kg = num(r.b), mt = num(r.a); if (e.id === 'remo-ergometro' || e.id === 'skierg') m.km += (mt || 0) / 1000; }
      }
    } else if (b.k === 'wod') {
      const min = num(b.min) || (parseTime(b.tiempo) / 60) || 0; if (min > 0 || b.mov) m.wodMin += min || 10;
    } else if (b.k === 'dep') {
      const min = num(b.min) || 0; m.depMin += min; if (b.dep) m.dep.push(b.dep);
    }
  }
  m.hyrox = hyroxIds.size;
  m.avgReps = m.kgSeries ? m.repsKg / m.kgSeries : 0;
  m.fuerzaMin = m.fuerzaSeries * 2.5;
  if (!m.dur) m.dur = Math.round(m.fuerzaMin + m.cardioMin + m.wodMin + m.depMin);
  return m;
}

/* ---------- récords ---------- */
/* Mejor marca de un ejercicio en un conjunto de sesiones */
function bestOf(sesiones, ejId) {
  const e = ej(ejId); const best = { e1rm: 0, kg: 0, reps: 0, seg: 0, km: 0, pace: Infinity, lastre: 0 };
  let any = false;
  for (const s of sesiones) for (const b of s.bloques || []) {
    if (b.k !== 'ej' || b.ej !== ejId) continue;
    for (const r of rowsDone(b)) {
      any = true;
      if (e.m === 'kg') { const kg = num(r.a), reps = num(r.b); const x = e1rm(kg, reps); if (x > best.e1rm) best.e1rm = x; if (kg > best.kg) best.kg = kg; if (reps > best.reps) best.reps = reps; }
      else if (e.m === 'bw') { const reps = num(r.a), kg = num(r.b) || 0; if (reps > best.reps && kg === 0) best.reps = reps; if (kg > best.lastre) best.lastre = kg; }
      else if (e.m === 'seg') { const sg = num(r.a); if (sg > best.seg) best.seg = sg; const kg = num(r.b); if (kg > best.kg) best.kg = kg; }
      else if (e.m === 'dist') { const km = num(r.a), t = parseTime(r.b); if (km > best.km) best.km = km; if (km >= 1 && t > 0 && t / km < best.pace) best.pace = t / km; }
      else if (e.m === 'm') { const kg = num(r.b); if (kg > best.kg) best.kg = kg; }
    }
  }
  return any ? best : null;
}

/* Récords batidos por la sesión s frente a todo lo anterior */
function recordsOf(s) {
  const prev = S.sesiones.filter((x) => x.id !== s.id && x.inicio < s.inicio);
  const out = []; const seen = new Set();
  for (const b of s.bloques || []) {
    if (b.k !== 'ej' || seen.has(b.ej)) continue; seen.add(b.ej);
    const before = bestOf(prev, b.ej); if (!before) continue;
    const now = bestOf([{ bloques: (s.bloques || []).filter((x) => x.k === 'ej' && x.ej === b.ej) }], b.ej); if (!now) continue;
    const e = ej(b.ej);
    if (e.m === 'kg') {
      if (now.kg > before.kg) out.push({ ej: b.ej, txt: `${fmtN(now.kg, 1)} kg de peso máximo`, tipo: 'kg' });
      else if (now.e1rm > before.e1rm * 1.001) out.push({ ej: b.ej, txt: `1RM estimado ${fmtN(now.e1rm, 1)} kg`, tipo: 'e1rm' });
    } else if (e.m === 'bw') {
      if (now.reps > before.reps) out.push({ ej: b.ej, txt: `${now.reps} repeticiones seguidas`, tipo: 'reps' });
      else if (now.lastre > before.lastre) out.push({ ej: b.ej, txt: `+${fmtN(now.lastre, 1)} kg de lastre`, tipo: 'kg' });
    } else if (e.m === 'seg') {
      if (now.seg > before.seg) out.push({ ej: b.ej, txt: `${now.seg} s aguantando`, tipo: 'seg' });
    } else if (e.m === 'dist') {
      if (now.km > before.km) out.push({ ej: b.ej, txt: `${fmtN(now.km, 2)} km de distancia`, tipo: 'km' });
      if (now.pace < before.pace) out.push({ ej: b.ej, txt: `mejor ritmo: ${fmtPace(now.pace)}`, tipo: 'pace' });
    } else if (e.m === 'm') {
      if (now.kg > before.kg) out.push({ ej: b.ej, txt: `${fmtN(now.kg, 1)} kg de carga`, tipo: 'kg' });
    }
  }
  return out;
}

/* Últimos valores usados en un ejercicio (para sugerir) */
function lastRowsFor(ejId, exceptId) {
  for (const s of S.sesiones) {
    if (s.id === exceptId) continue;
    const b = (s.bloques || []).find((x) => x.k === 'ej' && x.ej === ejId && rowsDone(x).length);
    if (b) return rowsDone(b);
  }
  return null;
}

/* ---------- semana ---------- */
function sesionesSemana(t = Date.now()) {
  const a = startOfWeek(t), z = a + 7 * 864e5;
  return S.sesiones.filter((s) => s.inicio >= a && s.inicio < z);
}
function rachaSemanas() {
  // semanas seguidas (hasta la actual o la anterior) con al menos 1 entreno
  let n = 0; let w = startOfWeek(Date.now());
  if (!sesionesSemana(w).length) w -= 7 * 864e5;
  while (sesionesSemana(w).length) { n++; w -= 7 * 864e5; }
  return n;
}
