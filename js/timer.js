/* Libreta iO.GENIX · sonido, vibración, descanso entre series y cronómetro de WOD */
let AC = null;
function audioOn() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) {} }
function beep(freq = 880, ms = 140, vol = 0.25) {
  if (!S.perfil.sonido || !AC) return;
  try {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'sine'; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(AC.destination);
    const t = AC.currentTime; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + ms / 1000);
    o.start(t); o.stop(t + ms / 1000 + 0.02);
  } catch (e) {}
}
function buzz(p) { if (S.perfil.vibrar && navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} }
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); }
    if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { wakeLock = null; }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && (T.running || REST.end)) keepAwake(true); });

/* ---------------- Descanso entre series ---------------- */
const REST = { end: 0, total: 0, label: '', iv: null, lastBeep: -1, doneAt: 0 };
function startRest(sec, label) {
  if (!sec || sec <= 0) return;
  audioOn();
  REST.total = sec; REST.end = Date.now() + sec * 1000; REST.label = label || ''; REST.lastBeep = -1; REST.doneAt = 0;
  clearInterval(REST.iv); REST.iv = setInterval(tickRest, 250); tickRest();
}
function addRest(d) { if (!REST.end) return; REST.end += d * 1000; REST.total = Math.max(5, REST.total + d); REST.doneAt = 0; tickRest(); }
function stopRest() { clearInterval(REST.iv); REST.end = 0; REST.doneAt = 0; const el = $('#restbar'); if (el) el.classList.add('hidden'); }
function tickRest() {
  const el = $('#restbar'); if (!el) return;
  const left = (REST.end - Date.now()) / 1000;
  el.classList.toggle('hidden', typeof V !== 'undefined' && V.view !== 'sesion');
  if (left > 0) {
    el.classList.remove('end');
    const s = Math.ceil(left);
    el.querySelector('.t').textContent = fmtClock(s);
    el.querySelector('.lbl').textContent = REST.label ? `Descanso · ${REST.label}` : 'Descanso';
    el.querySelector('.bar').style.width = `${Math.max(0, Math.min(100, (1 - left / REST.total) * 100))}%`;
    if (s <= 3 && s !== REST.lastBeep) { REST.lastBeep = s; beep(660, 110); }
  } else {
    if (!REST.doneAt) { REST.doneAt = Date.now(); beep(1046, 420, 0.32); buzz([200, 100, 200]); }
    el.classList.add('end');
    el.querySelector('.t').textContent = '¡Ya!';
    el.querySelector('.lbl').textContent = 'A por la siguiente serie 💪';
    el.querySelector('.bar').style.width = '100%';
    if (Date.now() - REST.doneAt > 6000) stopRest();
  }
}

/* ---------------- Cronómetro de WOD ---------------- */
const MODOS = {
  'Descanso': { cfg: { seg: 90 }, ayuda: 'Cuenta atrás simple.' },
  'AMRAP': { cfg: { min: 12 }, ayuda: 'Máximas rondas en el tiempo. Toca «+1 ronda» al cerrar cada vuelta.' },
  'EMOM': { cfg: { min: 12, cada: 60 }, ayuda: 'Empieza el trabajo al inicio de cada intervalo y descansa lo que sobre.' },
  'For Time': { cfg: { cap: 20 }, ayuda: 'Lo más rápido posible. Toca «Terminado» al acabar (con tiempo límite).' },
  'Tabata': { cfg: { work: 20, rest: 10, rondas: 8 }, ayuda: '20 s a tope, 10 s de descanso, 8 rondas (4 min).' },
  'Intervalos': { cfg: { work: 40, rest: 20, rondas: 10 }, ayuda: 'Trabajo / descanso a tu medida.' },
};
const T = { modo: 'AMRAP', cfg: { ...MODOS.AMRAP.cfg }, phases: [], idx: 0, start: 0, paused: 0, running: false, done: false, rondas: 0, iv: null, lastBeep: -1, total: 0, finishedAt: 0, fromBlock: null };

function buildPhases() {
  const c = T.cfg, P = [];
  const prep = { tipo: 'prep', label: 'Prepárate', dur: 10 };
  switch (T.modo) {
    case 'Descanso': P.push({ tipo: 'rest', label: 'Descanso', dur: c.seg }); break;
    case 'AMRAP': P.push(prep, { tipo: 'work', label: 'AMRAP', dur: c.min * 60 }); break;
    case 'EMOM': { P.push(prep); const n = Math.max(1, Math.round(c.min * 60 / c.cada)); for (let i = 0; i < n; i++) P.push({ tipo: 'work', label: `Intervalo ${i + 1}/${n}`, dur: c.cada }); break; }
    case 'For Time': P.push(prep, { tipo: 'work', label: 'For Time', dur: c.cap * 60, up: true }); break;
    case 'Tabata': case 'Intervalos': P.push(prep); for (let i = 0; i < c.rondas; i++) { P.push({ tipo: 'work', label: `Trabajo ${i + 1}/${c.rondas}`, dur: c.work }); if (i < c.rondas - 1 && c.rest > 0) P.push({ tipo: 'rest', label: `Descanso ${i + 1}/${c.rondas}`, dur: c.rest }); } break;
  }
  T.phases = P; T.total = P.reduce((a, p) => a + p.dur, 0);
}
function timerStart() {
  audioOn(); keepAwake(true);
  if (T.done || !T.phases.length) { buildPhases(); T.idx = 0; T.rondas = 0; T.done = false; T.finishedAt = 0; T.start = Date.now(); }
  else if (T.paused) { T.start += Date.now() - T.paused; }
  T.paused = 0; T.running = true; T.lastBeep = -1;
  clearInterval(T.iv); T.iv = setInterval(timerTick, 200); timerTick(); paintTimerControls();
}
function timerPause() { if (!T.running) return; T.running = false; T.paused = Date.now(); clearInterval(T.iv); paintTimerControls(); }
function timerReset() { clearInterval(T.iv); T.running = false; T.paused = 0; T.done = false; T.phases = []; T.idx = 0; T.rondas = 0; T.finishedAt = 0; keepAwake(false); paintTimer(); paintTimerControls(); }
function timerFinish(manual) {
  clearInterval(T.iv); T.running = false; T.done = true; T.finishedAt = Date.now(); keepAwake(false);
  beep(1046, 600, 0.35); buzz([300, 120, 300, 120, 300]);
  paintTimer(); paintTimerControls();
  if (manual) toast('¡Terminado! 🔥');
}
/* tiempo transcurrido en la fase actual */
function phaseElapsed() {
  const now = T.paused || Date.now();
  let acc = 0; for (let i = 0; i < T.idx; i++) acc += T.phases[i].dur;
  return (now - T.start) / 1000 - acc;
}
function timerTick() {
  if (!T.running) return;
  let el = phaseElapsed(); let ph = T.phases[T.idx];
  while (ph && el >= ph.dur) { T.idx++; el -= ph.dur; ph = T.phases[T.idx]; T.lastBeep = -1; if (ph) { beep(ph.tipo === 'work' ? 988 : 523, 380, 0.32); buzz(250); paintTimerControls(); } }
  if (!ph) { timerFinish(); return; }
  const left = Math.ceil(ph.dur - el);
  if (left <= 3 && left >= 1 && left !== T.lastBeep) { T.lastBeep = left; beep(660, 110); }
  paintTimer();
}
/* tiempo de trabajo efectivo (para For Time / resultado) */
function workSeconds() {
  let acc = 0; const now = T.finishedAt || T.paused || Date.now();
  const total = (now - T.start) / 1000;
  const prep = T.phases[0] && T.phases[0].tipo === 'prep' ? T.phases[0].dur : 0;
  acc = total - prep;
  return Math.max(0, Math.min(acc, T.total - prep));
}
function paintTimer() {
  const face = $('#timer-face'); if (!face) return;
  const dig = face.querySelector('.digits'), phase = face.querySelector('.phase'), sub = face.querySelector('.sub'), ring = $('#timer-ring');
  if (!T.phases.length) {
    buildPhases();
    const p = T.phases.find((x) => x.tipo !== 'prep') || T.phases[0];
    dig.textContent = fmtClock(T.modo === 'For Time' ? 0 : p.dur); phase.textContent = 'Listo'; phase.className = 'phase'; sub.textContent = MODOS[T.modo].ayuda; ring.style.width = '0%'; T.phases = [];
    return;
  }
  if (T.done) {
    dig.textContent = T.modo === 'For Time' ? fmtClock(workSeconds()) : '0:00';
    phase.textContent = '¡Terminado!'; phase.className = 'phase work';
    sub.textContent = T.modo === 'AMRAP' ? `${T.rondas} rondas completas` : T.modo === 'For Time' ? 'Tu tiempo' : '¡Buen trabajo!';
    ring.style.width = '100%'; return;
  }
  const ph = T.phases[T.idx]; if (!ph) return;
  const el = phaseElapsed();
  dig.textContent = ph.up ? fmtClock(Math.floor(el)) : fmtClock(Math.ceil(ph.dur - el));
  phase.textContent = ph.label; phase.className = 'phase ' + (ph.tipo === 'work' ? 'work' : ph.tipo === 'rest' ? 'rest' : '');
  sub.textContent = T.modo === 'AMRAP' && ph.tipo === 'work' ? `Rondas: ${T.rondas}` : ph.up ? `Límite ${T.cfg.cap} min` : (ph.tipo === 'prep' ? 'Empieza en…' : '');
  const done = T.phases.slice(0, T.idx).reduce((a, p) => a + p.dur, 0) + el;
  ring.style.width = `${Math.min(100, done / T.total * 100)}%`;
}
function paintTimerControls() {
  const c = $('#timer-ctrl'); if (!c) return;
  const working = T.phases.length && !T.done;
  const ph = T.phases[T.idx];
  let html = '';
  if (T.modo === 'AMRAP' && working && ph && ph.tipo === 'work') html += `<button class="btn primary round-btn mt8" data-act="t-ronda">+1 ronda</button>`;
  if (T.modo === 'For Time' && working && ph && ph.tipo === 'work') html += `<button class="btn primary round-btn mt8" data-act="t-fin">Terminado</button>`;
  html += `<div class="btn-row mt12">`;
  if (!T.running) html += `<button class="btn ${working ? '' : 'primary'} big" data-act="t-start">${working ? 'Reanudar' : T.done ? 'Otra vez' : 'Empezar'}</button>`;
  else html += `<button class="btn big" data-act="t-pause">Pausa</button>`;
  if (working || T.done) html += `<button class="btn ghost big" data-act="t-reset">Reiniciar</button>`;
  html += `</div>`;
  if (T.done && T.fromBlock) html += `<button class="btn primary full big mt12" data-act="t-guardar">Guardar resultado en el entreno</button>`;
  c.innerHTML = html;
  const cfg = $('#timer-cfg'); if (cfg) cfg.classList.toggle('hidden', !!working);
  const tabs = $('#timer-tabs'); if (tabs) tabs.classList.toggle('hidden', !!working);
}
