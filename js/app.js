/* Libreta iO.GENIX · vistas y acciones */
const IC = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18M6 16l4-5 3 3 5-7"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/></svg>',
  timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5M19 6.5l1.5-1.5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
};

/* ---------------- router ---------------- */
let V = { view: 'hoy', id: null };
function parseHash() { const [, view = 'hoy', id = null] = (location.hash || '#/hoy').split('/'); return { view, id }; }
function go(view, id) { const h = `#/${view}${id ? '/' + id : ''}`; if (location.hash === h) render(); else location.hash = h; }
window.addEventListener('hashchange', () => { closeSheet(); V = parseHash(); render(); window.scrollTo(0, 0); });

const NAV = [['hoy', 'Hoy', IC.home], ['historial', 'Historial', IC.cal], ['go', 'Entrenar', IC.plus], ['progreso', 'Progreso', IC.chart], ['cronos', 'Crono', IC.timer]];
function renderNav() {
  const hide = ['sesion', 'onb'].includes(V.view);
  const nav = $('#tabs'); nav.classList.toggle('hidden', hide);
  if (hide) return;
  nav.innerHTML = `<div class="in">${NAV.map(([k, l, ic]) => k === 'go'
    ? `<button class="go" data-act="${S.activa ? 'continuar' : 'empezar'}" aria-label="${S.activa ? 'Continuar entreno' : 'Empezar entreno'}"><span class="circle">${S.activa ? IC.timer : IC.plus}</span><small>${S.activa ? 'En curso' : l}</small></button>`
    : `<button class="${V.view === k || (k === 'progreso' && V.view === 'rutinas' && false) ? 'on' : ''}" data-act="nav" data-v="${k}">${ic}<span>${l}</span></button>`).join('')}</div>`;
}

function render() {
  if (!S.perfil.onb && V.view !== 'onb') V = { view: 'onb', id: null };
  const fn = VIEWS[V.view] || VIEWS.hoy;
  $('#app').innerHTML = fn(V.id);
  renderNav();
  if (V.view === 'sesion') startClock(); else stopClock();
  if (V.view === 'cronos') { paintTimer(); paintTimerControls(); }
  if (REST.end && V.view === 'sesion') tickRest(); else if (V.view !== 'sesion') $('#restbar').classList.add('hidden');
}

/* ---------------- helpers de UI ---------------- */
function toast(msg, ms = 2400) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg; document.body.appendChild(t); setTimeout(() => t.remove(), ms); }
function sheet(html, onClose) {
  closeSheet();
  const bg = document.createElement('div'); bg.className = 'sheet-bg'; bg.id = 'sheet';
  bg.innerHTML = `<div class="sheet" role="dialog"><div class="grab"></div>${html}</div>`;
  bg.addEventListener('click', (e) => { if (e.target === bg) closeSheet(); });
  bg._onClose = onClose; document.body.appendChild(bg); document.body.style.overflow = 'hidden';
  return bg;
}
function closeSheet() { const s = $('#sheet'); if (s) { if (s._onClose) s._onClose(); s.remove(); } document.body.style.overflow = ''; }
function confirmar(msg, okTxt, fn, danger = true) {
  sheet(`<h2>${msg}</h2><div class="btn-row mt16"><button class="btn ghost big" data-act="close">Cancelar</button><button class="btn ${danger ? 'danger' : 'primary'} big" id="cf-ok">${okTxt}</button></div>`);
  $('#cf-ok').onclick = () => { closeSheet(); fn(); };
}
const topbar = (left = '', right = '') => `<div class="topbar">${left || `<img class="logo" src="img/logo.svg" alt="iO.GENIX">`}${right}</div>`;
const backBtn = (to = 'hoy') => `<button class="icon-btn" data-act="nav" data-v="${to}" aria-label="Volver">${IC.back}</button>`;
const gearBtn = () => `<button class="icon-btn" data-act="nav" data-v="ajustes" aria-label="Ajustes">${IC.gear}</button>`;

function isStandalone() { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone; }
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; if (V.view === 'hoy') render(); });

/* ================= VISTAS ================= */
const VIEWS = {};

/* ---------- Onboarding ---------- */
VIEWS.onb = () => `
  <div class="onb">
    <img class="logo-big" src="img/logo.svg" alt="iO.GENIX">
    <p class="eyebrow center">Regalo para la comunidad</p>
    <h1 class="center">Tu libreta <span class="g">de entreno</span></h1>
    <p class="muted center">Apunta tus series, kilos, tiempos y vueltas. Mira cómo progresas y recibe un consejo después de cada sesión.</p>
    <ul class="feature-list">
      <li>🏋️ <span><b>Gimnasio, cardio, WOD o tu deporte</b>: pádel, fútbol, running, HYROX…</span></li>
      <li>⏱️ <span><b>Descanso automático</b> entre series y cronómetro AMRAP · EMOM · Tabata.</span></li>
      <li>🏆 <span><b>Récords y gráficas</b> de cada ejercicio.</span></li>
      <li>📲 <span><b>Comparte tu entreno</b> en stories y menciona a @io.genix.</span></li>
      <li>🔒 <span><b>Sin registro</b>: tus datos se quedan solo en tu móvil.</span></li>
    </ul>
    <div class="card">
      <label class="f" for="o-nombre">¿Cómo te llamamos? <span class="dim">(opcional)</span></label>
      <input class="input" id="o-nombre" maxlength="30" placeholder="Tu nombre" autocomplete="given-name">
      <label class="f">¿Qué proteína te sienta mejor?</label>
      <div class="chips" id="o-prot">
        <button class="chip on" data-act="pick" data-g="o-prot" data-v="whey">Whey (suero)</button>
        <button class="chip" data-act="pick" data-g="o-prot" data-v="iso">Baja en lactosa</button>
        <button class="chip" data-act="pick" data-g="o-prot" data-v="vegana">Vegana</button>
      </div>
      <label class="check"><input type="checkbox" id="o-adulto"><span>Tengo 18 años o más. <span class="dim">Si no, la libreta funciona igual pero sin recomendaciones de complementos.</span></span></label>
    </div>
    <button class="btn primary big full" data-act="onb-fin">Empezar a entrenar 💪</button>
    <p class="legal center">Al usar la libreta aceptas que tus datos se guarden solo en este dispositivo. iO.GENIX no recibe ninguna información.</p>
  </div>`;

/* ---------- Hoy ---------- */
VIEWS.hoy = () => {
  const n = (S.perfil.nombre || '').split(' ')[0];
  const sem = sesionesSemana(); const ws = startOfWeek(Date.now());
  const done = new Set(sem.map((s) => dayKey(s.inicio)));
  const today = dayKey(Date.now());
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((l, i) => { const t = ws + i * 864e5; const k = dayKey(t); return `<div class="day ${done.has(k) ? 'done' : ''} ${k === today ? 'today' : ''}">${l}<b>${new Date(t).getDate()}</b></div>`; }).join('');
  const ms = sem.map((s) => metrics(s));
  const min = ms.reduce((a, m) => a + m.dur, 0), vol = ms.reduce((a, m) => a + m.vol, 0), km = ms.reduce((a, m) => a + m.km, 0);
  const racha = rachaSemanas();
  const last = S.sesiones[0];
  let html = topbar('', gearBtn());
  html += `<p class="eyebrow">${n ? `Hola, ${esc(n)}` : 'Hola'} 👋</p><h1>${sem.length ? 'Sigue <span class="g">así</span>' : 'A por <span class="g">la semana</span>'}</h1>`;
  if (S.activa) html += `<div class="card gold tap mt12" data-act="continuar"><div class="row between"><div><p class="eyebrow mb0">Entreno en curso</p><h3>${esc(S.activa.nombre || 'Entreno libre')}</h3><p class="small muted mb0">Empezado ${fmtFecha(S.activa.inicio, true).split(' · ')[1]} · ${S.activa.bloques.length} bloques</p></div><span class="btn primary sm">Continuar</span></div></div>`;
  html += `<h2>Esta semana ${racha >= 2 ? `<span class="tag">🔥 ${racha} semanas seguidas</span>` : ''}</h2><div class="week">${days}</div>
    <div class="stats mt12"><div class="stat"><b>${sem.length}</b><span>Entrenos</span></div><div class="stat"><b>${fmtN(min)}′</b><span>Minutos</span></div>${km >= 1 && km * 1000 > vol ? `<div class="stat"><b>${fmtN(km, 1)}</b><span>Km</span></div>` : `<div class="stat"><b>${vol >= 10000 ? fmtN(vol / 1000, 1) + 't' : fmtN(vol)}</b><span>Kg movidos</span></div>`}</div>`;
  if (!S.activa) html += `<button class="btn primary big full mt16" data-act="empezar">${IC.plus} Empezar entreno</button>`;
  // rutinas rápidas
  const rq = [...S.plantillas.slice(0, 3).map((p) => ({ id: p.id, n: p.nombre, mine: true })), ...PLANTILLAS_IOGENIX.slice(0, 4).map((p) => ({ id: p.id, n: p.nombre }))].slice(0, 6);
  html += `<h2>Empieza desde una rutina</h2><div class="scroll-x">${rq.map((p) => `<button class="chip" data-act="usar-plantilla" data-id="${p.id}">${p.mine ? '⭐ ' : ''}${esc(p.n)}</button>`).join('')}<button class="chip" data-act="nav" data-v="rutinas">Ver todas →</button></div>`;
  if (last) {
    const lm = metrics(last); const pf = PERFILES[last.perfil] || PERFILES.hipertrofia;
    html += `<h2>Tu último entreno</h2><div class="hist-item" data-act="nav" data-v="detalle" data-id="${last.id}"><div class="hist-date"><b>${new Date(last.inicio).getDate()}</b><span>${MESES[new Date(last.inicio).getMonth()]}</span></div><div class="grow"><h3>${esc(last.nombre || pf.t)}</h3><p class="small muted mb0">${pf.ico} ${pf.t} · ${fmtMin(lm.dur)}${lm.series ? ' · ' + lm.series + ' series' : ''}</p></div><span class="chev">›</span></div>`;
  }
  // instalar
  if (!isStandalone()) {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    html += `<div class="card mt16"><div class="install"><img src="img/icon-192.png" alt=""><div class="grow"><h3>Llévala como una app</h3><p class="small muted mb0">${deferredPrompt ? 'Instálala en tu pantalla de inicio y ábrela con un toque, incluso sin conexión.' : ios ? 'En Safari: botón <b>Compartir</b> → <b>Añadir a pantalla de inicio</b>.' : 'En el menú del navegador: <b>Instalar app</b> o <b>Añadir a pantalla de inicio</b>.'}</p></div></div>${deferredPrompt ? '<button class="btn primary full mt12" data-act="instalar">Instalar</button>' : ''}</div>`;
  }
  html += `<div class="card tap mt12" data-act="nav" data-v="rutinas"><div class="row"><span style="font-size:1.5rem">📘</span><div class="grow"><h3>Rutinas y guías iO.GENIX</h3><p class="small muted mb0">Full body, torso, pierna, en casa, HYROX, WODs y carrera.</p></div><span class="chev">›</span></div></div>`;
  return html;
};

/* ---------- Empezar (sheet) ---------- */
function sheetEmpezar() {
  const mine = S.plantillas.map((p) => `<div class="ex-item" data-act="usar-plantilla" data-id="${p.id}"><span>⭐ ${esc(p.nombre)}</span><span class="chev">›</span></div>`).join('');
  sheet(`<h2>¿Qué toca hoy?</h2>
    <div class="list-item" data-act="nueva" data-tipo="libre"><div class="ico">🏋️</div><div class="grow"><h3>Gimnasio / fuerza</h3><p class="small muted mb0">Añade ejercicios y apunta tus series</p></div></div>
    <div class="list-item" data-act="nueva" data-tipo="cardio"><div class="ico">🏃</div><div class="grow"><h3>Cardio</h3><p class="small muted mb0">Carrera, bici, natación… con vueltas y tiempos</p></div></div>
    <div class="list-item" data-act="nueva" data-tipo="wod"><div class="ico">⚡</div><div class="grow"><h3>WOD / funcional</h3><p class="small muted mb0">AMRAP, EMOM, For Time, Tabata</p></div></div>
    <div class="list-item" data-act="nueva" data-tipo="dep"><div class="ico">🎾</div><div class="grow"><h3>Deporte</h3><p class="small muted mb0">Pádel, fútbol, tenis, clases…</p></div></div>
    ${mine ? `<p class="group-title">Mis rutinas</p>${mine}` : ''}
    <p class="group-title">Rutinas iO.GENIX</p>
    ${PLANTILLAS_IOGENIX.map((p) => `<div class="ex-item" data-act="usar-plantilla" data-id="${p.id}"><span>${esc(p.nombre)}<br><span class="tiny dim">${esc(p.desc)}</span></span><span class="chev">›</span></div>`).join('')}`);
}

/* ---------- Sesión activa ---------- */
VIEWS.sesion = () => {
  const a = S.activa; if (!a) { setTimeout(() => go('hoy')); return ''; }
  let html = `<div class="sess-head"><div class="row"><button class="icon-btn" data-act="nav" data-v="hoy" aria-label="Salir">${IC.back}</button><div class="grow"><input class="name-input" data-bind="nombre" value="${esc(a.nombre)}" placeholder="Nombre del entreno" maxlength="40"><div class="small muted">${fmtFecha(a.inicio)} · <span class="clock" id="clock" style="font-size:1rem">0:00</span></div></div><button class="btn primary sm" data-act="terminar">Terminar</button></div></div>`;
  if (!a.bloques.length) html += `<div class="card center"><p class="muted">Añade tu primer ejercicio, un WOD o tu deporte 👇</p></div>`;
  a.bloques.forEach((b, i) => { html += renderBloque(b, i, a.bloques.length); });
  html += `<div class="btn-row"><button class="btn full" data-act="add-ej">${IC.plus} Ejercicio</button></div>
    <div class="btn-row mt8"><button class="btn sm" data-act="add-wod">+ WOD</button><button class="btn sm" data-act="add-dep">+ Deporte</button><button class="btn sm" data-act="nav" data-v="cronos">⏱️ Crono</button></div>
    <div class="btn-row mt16"><button class="btn danger sm" data-act="descartar">Descartar entreno</button></div>`;
  return html;
};

function renderBloque(b, i, n) {
  const ctrl = `<button class="link-btn dim" data-act="mover" data-i="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Subir">↑</button><button class="link-btn dim" data-act="mover" data-i="${i}" data-d="1" ${i === n - 1 ? 'disabled' : ''} aria-label="Bajar">↓</button><button class="link-btn dim" data-act="quitar-bloque" data-i="${i}" aria-label="Quitar">✕</button>`;
  if (b.k === 'wod') {
    return `<div class="block"><div class="block-head"><span class="tag">WOD</span><h3>${esc(b.formato)}</h3>${ctrl}</div>
      <div class="chips">${Object.keys(FORMATOS_WOD).map((f) => `<button class="chip ${b.formato === f ? 'on' : ''}" data-act="wod-formato" data-b="${b.id}" data-v="${f}">${f}</button>`).join('')}</div>
      <div class="cfg mt8"><div><label class="f">${b.formato === 'For Time' ? 'Límite (min)' : 'Minutos'}</label><input class="input" inputmode="decimal" data-bind="b:${b.id}:min" value="${esc(b.min)}" placeholder="12"></div>
      ${b.formato === 'For Time' ? `<div><label class="f">Tu tiempo</label><input class="input" data-bind="b:${b.id}:tiempo" value="${esc(b.tiempo)}" placeholder="mm:ss"></div>` : `<div><label class="f">${b.formato === 'AMRAP' ? 'Rondas + reps' : 'Rondas hechas'}</label><input class="input" data-bind="b:${b.id}:rondas" value="${esc(b.rondas)}" placeholder="${b.formato === 'AMRAP' ? '6 + 12' : '—'}"></div>`}</div>
      <label class="f">Movimientos, pesos y escalados</label><textarea class="input" data-bind="b:${b.id}:mov" placeholder="10 thrusters 40 kg\n15 burpees\n200 m carrera">${esc(b.mov)}</textarea>
      <div class="block-foot"><button class="btn sm" data-act="wod-crono" data-b="${b.id}">⏱️ Abrir cronómetro</button></div></div>`;
  }
  if (b.k === 'dep') {
    return `<div class="block"><div class="block-head"><span class="tag">Deporte</span><h3>${esc(b.dep || 'Elige deporte')}</h3>${ctrl}</div>
      <select class="input" data-bind="b:${b.id}:dep">${DEPORTES.map((d) => `<option ${b.dep === d ? 'selected' : ''}>${d}</option>`).join('')}</select>
      <div class="cfg mt8"><div><label class="f">Minutos</label><input class="input" inputmode="numeric" data-bind="b:${b.id}:min" value="${esc(b.min)}" placeholder="90"></div><div><label class="f">Resultado / marcador</label><input class="input" data-bind="b:${b.id}:res" value="${esc(b.res)}" placeholder="6-4 / 3-6 / 7-5"></div></div>
      <label class="f">Notas</label><input class="input" data-bind="b:${b.id}:nota" value="${esc(b.nota)}" placeholder="Cómo te has sentido, qué mejorar…"></div>`;
  }
  const e = ej(b.ej); const cols = COLS[e.m]; const last = lastRowsFor(b.ej, S.activa && S.activa.editId);
  const lastTxt = last ? (e.m === 'kg' ? last.map((r) => `${fmtN(num(r.a), 1)}×${fmtN(num(r.b))}`).join(' · ') : e.m === 'dist' ? last.map((r) => `${fmtN(num(r.a), 2)} km ${r.b || ''}`).join(' · ') : last.map((r) => r.a + (r.b ? ` (${r.b})` : '')).join(' · ')) : '';
  let rows = '';
  b.series.forEach((r, j) => {
    const ph = placeholders(b, j, last, e);
    const restNote = j > 0 && r.t && b.series[j - 1].t && r.t - b.series[j - 1].t >= 5000 ? `<tr><td colspan="5" class="rest-note">⏱ descanso real ${fmtClock((r.t - b.series[j - 1].t) / 1000)}</td></tr>` : '';
    rows += `${restNote}<tr class="${r.hecho ? 'done' : ''}" data-row="${j}"><td class="n">${j + 1}</td>
      ${cols.map(([lbl, mode], c) => { const f = 'abc'[c]; return `<td><input inputmode="${mode}" data-bind="s:${b.id}:${j}:${f}" value="${esc(r[f])}" placeholder="${esc(ph[f] ?? '')}" aria-label="${lbl} serie ${j + 1}"></td>`; }).join('')}
      <td style="width:46px"><button class="ok-btn ${r.hecho ? 'on' : ''}" data-act="hecho" data-b="${b.id}" data-j="${j}" aria-label="Serie hecha">${IC.check}</button></td></tr>`;
  });
  return `<div class="block" data-block="${b.id}"><div class="block-head"><h3>${esc(e.n)}</h3>${ctrl}</div>
    ${lastTxt ? `<p class="hint">Última vez: ${esc(lastTxt)}</p>` : ''}
    <table class="sets"><thead><tr><th>${e.m === 'dist' ? '#' : e.m === 'm' ? '#' : 'Serie'}</th>${cols.map(([l]) => `<th>${l}</th>`).join('')}<th>✓</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="block-foot"><button class="link-btn" data-act="add-serie" data-b="${b.id}">+ ${e.m === 'dist' ? 'Vuelta' : 'Serie'}</button>${b.series.length > 1 ? `<button class="link-btn dim" data-act="del-serie" data-b="${b.id}">− Quitar</button>` : ''}<span class="grow"></span><button class="rest-pill" data-act="descanso" data-b="${b.id}">⏱ ${b.d ? fmtClock(b.d) : 'sin descanso'}</button></div>
    <input class="input mt8" data-bind="b:${b.id}:nota" value="${esc(b.nota)}" placeholder="Nota (agarre, máquina, sensaciones…)" style="padding:8px 10px"></div>`;
}
function placeholders(b, j, last, e) {
  const p = {};
  const cur = j > 0 && b.series[j - 1] && has(b.series[j - 1].a) ? b.series[j - 1] : null;
  const src = (last && last[j]) || cur || (last && last[last.length - 1]);
  if (src) { p.a = src.a || ''; p.b = src.b || ''; p.c = e.m === 'kg' || e.m === 'bw' || e.m === 'seg' ? '' : (src.c || ''); }
  if (b.obj) {
    if (e.m === 'kg') p.b = p.b || String(b.obj);
    else if (['bw', 'seg', 'm', 'dist'].includes(e.m)) p.a = p.a || String(b.obj);
  }
  return p;
}

/* ---------- Resumen / detalle ---------- */
VIEWS.resumen = (id) => detalle(id, true);
VIEWS.detalle = (id) => detalle(id, false);
function detalle(id, hero) {
  const s = S.sesiones.find((x) => x.id === id); if (!s) { setTimeout(() => go('historial')); return ''; }
  const m = metrics(s); const prs = s.prs || []; const c = consejo(s); const pf = PERFILES[c.perfil];
  const msg = mensajeOk(s, m, prs);
  let html = topbar(backBtn(hero ? 'hoy' : 'historial'), `<button class="icon-btn" data-act="story" data-id="${s.id}" aria-label="Compartir">${IC.share}</button>`);
  if (hero) html += `<div class="hero-done"><div class="big">${prs.length ? '🏆' : '💪'}</div><h1 class="mt8">${(() => { const mt = msg.titulo.match(/^(.*?)\s*([\p{Extended_Pictographic}‍️]+)$/u); return mt ? `<span class="g">${mt[1]}</span> ${mt[2]}` : `<span class="g">${msg.titulo}</span>`; })()}</h1><p class="muted mb0">${esc(msg.linea)}</p><p class="small mt8">${msg.extra}</p></div>`;
  else html += `<p class="eyebrow">${fmtFecha(s.inicio, true)}</p><h1>${esc(s.nombre || pf.t)}</h1>`;
  html += `<div class="stats mt12"><div class="stat"><b>${fmtN(m.dur)}′</b><span>Duración</span></div>${m.vol >= 1 ? `<div class="stat"><b>${m.vol >= 10000 ? fmtN(m.vol / 1000, 1) + 't' : fmtN(m.vol)}</b><span>Kg movidos</span></div>` : m.km >= 0.1 ? `<div class="stat"><b>${fmtN(m.km, 2)}</b><span>Km</span></div>` : (() => { const w = s.bloques.find((b) => b.k === 'wod'); if (!m.dep.length && w && !m.series) return `<div class="stat"><b>${esc(w.rondas || w.tiempo || (w.min ? w.min + '′' : '✓'))}</b><span>${w.rondas ? 'Rondas' : w.tiempo ? 'Tiempo' : 'WOD'}</span></div>`; return `<div class="stat"><b>${m.dep.length ? fmtN(m.depMin) + '′' : m.series}</b><span>${m.dep.length ? esc(m.dep[0]) : 'Series'}</span></div>`; })()}<div class="stat"><b>${s.rpe ? s.rpe + '/10' : '–'}</b><span>Esfuerzo</span></div></div>`;
  if (prs.length) html += `<div class="card gold mt12"><p class="eyebrow">Nuevos récords</p><ul class="pr-list">${prs.map((p) => `<li>🏆 <span><b>${esc(ej(p.ej).n)}</b> · ${esc(p.txt)}</span></li>`).join('')}</ul></div>`;
  // consejo
  html += `<h2>${hero ? 'Tu consejo iO.GENIX' : 'Consejo para este entreno'}</h2><div class="card"><p class="eyebrow mb0">Tipo de sesión</p><p class="profile-tag mt0 mb0">${pf.ico} ${pf.t}</p>
    ${c.picks.length ? `<p class="small muted">Para un entreno como este, tu mejor combinación iO.GENIX sería:</p>${c.picks.map((p) => prodCard(p)).join('')}` : ''}
    ${c.tips.map((t) => `<div class="tip">💡 <span>${esc(t)}</span></div>`).join('')}
    ${c.picks.length ? `<p class="legal">${AVISO_LEGAL}</p>` : ''}</div>`;
  // bloques
  html += `<h2>Detalle</h2>`;
  for (const b of s.bloques) html += bloqueLectura(b);
  if (s.notas || s.sensacion) html += `<div class="card"><p class="eyebrow">Notas</p><p class="mb0">${s.sensacion ? esc(s.sensacion) + ' ' : ''}${esc(s.notas || '')}</p></div>`;
  html += `<div class="btn-row mt16"><button class="btn primary" data-act="story" data-id="${s.id}">${IC.share} Compartir en stories</button></div>
    <div class="btn-row mt8"><button class="btn" data-act="repetir" data-id="${s.id}">Repetir</button><button class="btn" data-act="guardar-rutina" data-id="${s.id}">Guardar como rutina</button></div>
    <div class="btn-row mt8"><button class="btn ghost sm" data-act="editar" data-id="${s.id}">Editar</button><button class="btn danger sm" data-act="borrar" data-id="${s.id}">Eliminar</button></div>`;
  return html;
}
function prodCard(p) {
  const P = PRODUCTOS[p.key]; if (!P) return '';
  const url = P.url + (P.url.includes('?') ? '&' : '?') + UTM;
  return `<div class="prod"><img src="${P.img}" alt="${esc(P.n)}" loading="lazy"><div class="grow"><h3>${esc(P.n)}</h3><p class="why">${esc(p.why)}</p><p class="comp">${esc(P.comp)}</p>${P.claim ? `<p class="claim">${esc(P.claim)}</p>` : ''}<a class="btn sm" href="${url}" target="_blank" rel="noopener">Ver en la tienda ↗</a></div></div>`;
}
function bloqueLectura(b) {
  if (b.k === 'wod') return `<div class="block"><div class="block-head"><span class="tag">WOD</span><h3>${esc(b.formato)} ${b.min ? esc(b.min) + ' min' : ''}</h3></div>${b.rondas ? `<p class="mb0"><b>Resultado:</b> ${esc(b.rondas)}${b.formato === 'AMRAP' ? ' rondas' : ''}</p>` : ''}${b.tiempo ? `<p class="mb0"><b>Tiempo:</b> ${esc(b.tiempo)}</p>` : ''}${b.mov ? `<p class="small muted" style="white-space:pre-line">${esc(b.mov)}</p>` : ''}</div>`;
  if (b.k === 'dep') return `<div class="block"><div class="block-head"><span class="tag">Deporte</span><h3>${esc(b.dep)}</h3></div><p class="mb0">${b.min ? esc(b.min) + ' min' : ''}${b.res ? ' · ' + esc(b.res) : ''}</p>${b.nota ? `<p class="small muted mb0">${esc(b.nota)}</p>` : ''}</div>`;
  const e = ej(b.ej); const cols = COLS[e.m]; const rows = rowsDone(b); if (!rows.length) return '';
  let extra = '';
  if (e.m === 'dist') { const km = rows.reduce((a, r) => a + (num(r.a) || 0), 0), t = rows.reduce((a, r) => a + (parseTime(r.b) || 0), 0); if (km && t) extra = `<p class="small muted mb0">Total ${fmtN(km, 2)} km en ${fmtClock(t)} · ritmo medio ${fmtPace(t / km)}</p>`; }
  return `<div class="block"><div class="block-head"><h3>${esc(e.n)}</h3>${b.d ? `<span class="tiny dim">⏱ ${fmtClock(b.d)}</span>` : ''}</div>
    <table class="sets"><thead><tr><th>#</th>${cols.map(([l]) => `<th>${l}</th>`).join('')}${e.m === 'dist' ? '<th>Ritmo</th>' : ''}</tr></thead><tbody>
    ${rows.map((r, j) => `<tr><td class="n">${j + 1}</td><td>${esc(r.a || '–')}</td><td>${esc(r.b || '–')}</td><td>${esc(r.c || '–')}</td>${e.m === 'dist' ? `<td class="small">${has(r.a) && parseTime(r.b) ? fmtPace(parseTime(r.b) / num(r.a)) : '–'}</td>` : ''}</tr>`).join('')}
    </tbody></table>${extra}${b.nota ? `<p class="small muted mb0">📝 ${esc(b.nota)}</p>` : ''}</div>`;
}

/* ---------- Historial ---------- */
let HIST_MES = null;
VIEWS.historial = () => {
  const now = new Date(); if (!HIST_MES) HIST_MES = { y: now.getFullYear(), m: now.getMonth() };
  const { y, m } = HIST_MES;
  const first = new Date(y, m, 1), dim = new Date(y, m + 1, 0).getDate(), off = (first.getDay() + 6) % 7;
  const daysOn = new Set(S.sesiones.map((s) => dayKey(s.inicio)));
  let cal = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => `<div class="h">${d}</div>`).join('');
  for (let i = 0; i < off; i++) cal += '<div class="c empty"></div>';
  for (let d = 1; d <= dim; d++) { const k = `${y}-${pad(m + 1)}-${pad(d)}`; cal += `<div class="c ${daysOn.has(k) ? 'on' : ''}">${d}</div>`; }
  const delMes = S.sesiones.filter((s) => { const d = new Date(s.inicio); return d.getFullYear() === y && d.getMonth() === m; });
  let html = topbar('', gearBtn()) + `<h1>Historial</h1>
    <div class="card"><div class="row between"><button class="icon-btn" data-act="mes" data-d="-1" aria-label="Mes anterior">${IC.back}</button><b>${MESES_L[m].replace(/^./, (c) => c.toUpperCase())} ${y}</b><button class="icon-btn" data-act="mes" data-d="1" aria-label="Mes siguiente" style="transform:scaleX(-1)">${IC.back}</button></div>
    <div class="month mt12">${cal}</div><p class="small muted mb0 mt8">${delMes.length} ${delMes.length === 1 ? 'entreno' : 'entrenos'} este mes · ${fmtMin(delMes.reduce((a, s) => a + metrics(s).dur, 0))}</p></div>`;
  if (!S.sesiones.length) html += `<div class="card center"><p class="muted">Aquí aparecerán tus entrenos. ¡El primero es el más importante!</p><button class="btn primary" data-act="empezar">Empezar entreno</button></div>`;
  html += delMes.map((s) => { const mm = metrics(s); const pf = PERFILES[s.perfil] || PERFILES.hipertrofia; return `<div class="hist-item" data-act="nav" data-v="detalle" data-id="${s.id}"><div class="hist-date"><b>${new Date(s.inicio).getDate()}</b><span>${DIAS[new Date(s.inicio).getDay()]}</span></div><div class="grow"><h3>${esc(s.nombre || pf.t)} ${(s.prs || []).length ? '🏆' : ''}</h3><p class="small muted mb0">${pf.ico} ${fmtMin(mm.dur)}${mm.series ? ' · ' + mm.series + ' series' : ''}${mm.vol >= 1 ? ' · ' + fmtN(mm.vol) + ' kg' : ''}${mm.km >= 0.1 ? ' · ' + fmtN(mm.km, 1) + ' km' : ''}${mm.dep.length ? ' · ' + esc(mm.dep.join(', ')) : ''}</p></div><span class="chev">›</span></div>`; }).join('');
  return html;
};

/* ---------- Progreso ---------- */
let PROG_EJ = null;
VIEWS.progreso = () => {
  let html = topbar('', gearBtn()) + `<h1>Tu <span class="g">progreso</span></h1>`;
  if (!S.sesiones.length) return html + `<div class="card center"><p class="muted">Cuando registres tus entrenos verás aquí tus récords y gráficas.</p><button class="btn primary" data-act="empezar">Empezar entreno</button></div>`;
  // semanas
  const ws = startOfWeek(Date.now()); const weeks = [];
  for (let i = 7; i >= 0; i--) { const a = ws - i * 7 * 864e5; const ss = S.sesiones.filter((s) => s.inicio >= a && s.inicio < a + 7 * 864e5); const d = new Date(a); weeks.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, v: Math.round(ss.reduce((x, s) => x + metrics(s).dur, 0)), n: ss.length }); }
  const all = S.sesiones.map((s) => metrics(s));
  html += `<div class="stats"><div class="stat"><b>${S.sesiones.length}</b><span>Entrenos</span></div><div class="stat"><b>${fmtN(all.reduce((a, m) => a + m.dur, 0) / 60, 1)}h</b><span>Entrenadas</span></div><div class="stat"><b>${rachaSemanas()}</b><span>Semanas seguidas</span></div></div>`;
  html += `<h2>Minutos por semana</h2><div class="card">${barChart(weeks)}</div>`;
  // tipos
  const cnt = {}; S.sesiones.forEach((s) => { cnt[s.perfil] = (cnt[s.perfil] || 0) + 1; });
  html += `<div class="chips mb0">${Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span class="chip">${(PERFILES[k] || PERFILES.hipertrofia).ico} ${(PERFILES[k] || PERFILES.hipertrofia).t} · ${v}</span>`).join('')}</div>`;
  // ejercicios con historial
  const ids = []; S.sesiones.forEach((s) => s.bloques.forEach((b) => { if (b.k === 'ej' && rowsDone(b).length && !ids.includes(b.ej)) ids.push(b.ej); }));
  if (ids.length) {
    if (!PROG_EJ || !ids.includes(PROG_EJ)) PROG_EJ = ids[0];
    const e = ej(PROG_EJ);
    html += `<h2>Por ejercicio</h2><select class="input" data-act-change="prog-ej">${ids.map((id) => `<option value="${id}" ${id === PROG_EJ ? 'selected' : ''}>${esc(ej(id).n)}</option>`).join('')}</select>`;
    const pts = []; const pts2 = [];
    [...S.sesiones].reverse().forEach((s) => s.bloques.forEach((b) => {
      if (b.k !== 'ej' || b.ej !== PROG_EJ) return; const rows = rowsDone(b); if (!rows.length) return;
      if (e.m === 'kg') { const x = Math.max(...rows.map((r) => e1rm(num(r.a), num(r.b)) || 0)); if (x) pts.push({ x: s.inicio, y: r1(x) }); const v = rows.reduce((a, r) => a + (num(r.a) * num(r.b) || 0), 0); if (v) pts2.push({ x: s.inicio, y: Math.round(v) }); }
      else if (e.m === 'bw') pts.push({ x: s.inicio, y: Math.max(...rows.map((r) => num(r.a) || 0)) });
      else if (e.m === 'seg') pts.push({ x: s.inicio, y: Math.max(...rows.map((r) => num(r.a) || 0)) });
      else if (e.m === 'dist') { const km = rows.reduce((a, r) => a + (num(r.a) || 0), 0), t = rows.reduce((a, r) => a + (parseTime(r.b) || 0), 0); pts.push({ x: s.inicio, y: r1(km) }); if (km && t) pts2.push({ x: s.inicio, y: Math.round(t / km) }); }
      else if (e.m === 'm') { const kg = Math.max(...rows.map((r) => num(r.b) || 0)); pts.push({ x: s.inicio, y: kg }); }
    }));
    const titles = { kg: ['1RM estimado (kg)', 'Volumen por sesión (kg)'], bw: ['Máximo de repeticiones'], seg: ['Máximo de segundos'], dist: ['Distancia por sesión (km)', 'Ritmo medio (min/km)'], m: ['Carga máxima (kg)'] }[e.m];
    html += `<div class="card mt12"><p class="eyebrow">${titles[0]}</p>${lineChart(pts.slice(-20))}</div>`;
    if (pts2.length && titles[1]) html += `<div class="card"><p class="eyebrow">${titles[1]}</p>${lineChart(pts2.slice(-20), e.m === 'dist' ? { fmt: (v) => fmtPace(v).replace(' /km', ''), invert: true } : {})}</div>`;
    const best = bestOf(S.sesiones, PROG_EJ);
    if (best) {
      const recs = [];
      if (e.m === 'kg') { recs.push(['Peso máximo', fmtN(best.kg, 1) + ' kg']); if (best.e1rm) recs.push(['1RM estimado', fmtN(best.e1rm, 1) + ' kg']); recs.push(['Más reps', best.reps]); }
      if (e.m === 'bw') { recs.push(['Más reps', best.reps]); if (best.lastre) recs.push(['Más lastre', '+' + fmtN(best.lastre, 1) + ' kg']); }
      if (e.m === 'seg') recs.push(['Más tiempo', best.seg + ' s']);
      if (e.m === 'dist') { recs.push(['Tramo más largo', fmtN(best.km, 2) + ' km']); if (isFinite(best.pace)) recs.push(['Mejor ritmo (≥1 km)', fmtPace(best.pace)]); }
      if (e.m === 'm') recs.push(['Carga máxima', fmtN(best.kg, 1) + ' kg']);
      html += `<div class="card"><p class="eyebrow">Tus récords</p><ul class="pr-list">${recs.map(([l, v]) => `<li><span class="grow">${l}</span><b class="g">${v}</b></li>`).join('')}</ul>${e.m === 'kg' ? '<p class="legal">1RM estimado con la fórmula de Epley a partir de series de hasta 12 repeticiones.</p>' : ''}</div>`;
    }
  }
  html += `<div class="card tap" data-act="nav" data-v="rutinas"><div class="row"><span style="font-size:1.4rem">📘</span><div class="grow"><h3>Mis rutinas</h3><p class="small muted mb0">Guarda tus entrenos para repetirlos</p></div><span class="chev">›</span></div></div>`;
  return html;
};

/* ---------- Rutinas ---------- */
VIEWS.rutinas = () => {
  let html = topbar(backBtn('hoy'), gearBtn()) + `<h1>Rutinas</h1>`;
  html += `<h2>Mis rutinas</h2>`;
  if (!S.plantillas.length) html += `<p class="small muted">Aún no tienes. Al terminar un entreno pulsa <b>Guardar como rutina</b>, o crea una aquí.</p>`;
  html += S.plantillas.map((p) => `<div class="list-item"><div class="ico">⭐</div><div class="grow" data-act="usar-plantilla" data-id="${p.id}"><h3>${esc(p.nombre)}</h3><p class="small muted mb0">${p.bloques.map((b) => b.k === 'ej' ? ej(b.ej).n : b.k === 'wod' ? 'WOD ' + b.formato : b.dep).slice(0, 4).map(esc).join(' · ')}${p.bloques.length > 4 ? '…' : ''}</p></div><button class="link-btn dim" data-act="borrar-rutina" data-id="${p.id}" aria-label="Borrar rutina">✕</button></div>`).join('');
  html += `<button class="btn full" data-act="crear-rutina">${IC.plus} Crear rutina</button>`;
  html += `<h2>Rutinas iO.GENIX</h2>`;
  html += PLANTILLAS_IOGENIX.map((p) => `<div class="list-item" data-act="usar-plantilla" data-id="${p.id}"><div class="ico">${p.tipo === 'hyrox' ? '🔥' : p.tipo === 'wod' ? '⚡' : p.tipo === 'cardio' ? '🏃' : '🏋️'}</div><div class="grow"><h3>${esc(p.nombre)}</h3><p class="small muted mb0">${esc(p.desc)}</p></div><span class="chev">›</span></div>`).join('');
  html += `<h2>Guías iO.GENIX</h2>` + GUIAS.map((g) => `<a class="list-item" style="text-decoration:none;color:inherit" href="${g.url}?${UTM}" target="_blank" rel="noopener"><div class="ico">📘</div><div class="grow"><h3>${esc(g.n)}</h3><p class="small muted mb0">Ebook en la tienda iO.GENIX</p></div><span class="chev">↗</span></a>`).join('');
  return html;
};

/* ---------- Cronómetro ---------- */
VIEWS.cronos = () => {
  const c = T.cfg;
  const step = (k, lbl, d, unit = '') => `<div><label class="f">${lbl}</label><div class="stepper"><button data-act="t-step" data-k="${k}" data-d="-${d}">−</button><span>${c[k]}${unit}</span><button data-act="t-step" data-k="${k}" data-d="${d}">+</button></div></div>`;
  const cfg = { 'Descanso': step('seg', 'Segundos', 15, ' s'), 'AMRAP': step('min', 'Minutos', 1), 'EMOM': step('min', 'Minutos totales', 1) + step('cada', 'Cada', 15, ' s'), 'For Time': step('cap', 'Límite (min)', 1), 'Tabata': step('work', 'Trabajo', 5, ' s') + step('rest', 'Descanso', 5, ' s') + step('rondas', 'Rondas', 1), 'Intervalos': step('work', 'Trabajo', 5, ' s') + step('rest', 'Descanso', 5, ' s') + step('rondas', 'Rondas', 1) }[T.modo];
  return topbar(S.activa ? `<button class="btn sm" data-act="continuar">${IC.back} Volver al entreno</button>` : '', gearBtn()) + `
    <h1>Crono<span class="g">metro</span></h1>
    <div class="scroll-x" id="timer-tabs">${Object.keys(MODOS).map((k) => `<button class="chip ${T.modo === k ? 'on' : ''}" data-act="t-modo" data-v="${k}">${k}</button>`).join('')}</div>
    <div class="card mt12"><div class="timer-face" id="timer-face"><div class="phase"></div><div class="digits">0:00</div><div class="sub"></div></div><div class="ring"><i id="timer-ring"></i></div>
    <div class="cfg" id="timer-cfg">${cfg}</div><div id="timer-ctrl"></div></div>
    <p class="small muted center">Mantén la pantalla encendida: la libreta lo intenta por ti mientras corre el crono.</p>`;
};

/* ---------- Ajustes ---------- */
VIEWS.ajustes = () => {
  const p = S.perfil;
  return topbar(backBtn('hoy')) + `<h1>Ajustes</h1>
    <div class="card"><label class="f" for="a-nombre">Nombre</label><input class="input" id="a-nombre" data-bind="perfil:nombre" value="${esc(p.nombre)}" maxlength="30" placeholder="Tu nombre">
      <label class="f">Proteína preferida para los consejos</label><div class="chips">${[['whey', 'Whey (suero)'], ['iso', 'Baja en lactosa'], ['vegana', 'Vegana']].map(([k, l]) => `<button class="chip ${p.proteina === k ? 'on' : ''}" data-act="set" data-k="proteina" data-v="${k}">${l}</button>`).join('')}</div>
      <label class="check"><input type="checkbox" data-act-change="adulto" ${p.adulto ? 'checked' : ''}><span>Tengo 18 años o más (muestra recomendaciones de complementos)</span></label>
      <label class="f">Descanso por defecto entre series</label><div class="chips">${[45, 60, 90, 120, 180].map((s) => `<button class="chip ${p.descanso === s ? 'on' : ''}" data-act="set" data-k="descanso" data-v="${s}">${fmtClock(s)}</button>`).join('')}</div>
      <label class="check"><input type="checkbox" data-act-change="sonido" ${p.sonido ? 'checked' : ''}><span>Sonido en descansos y cronómetro</span></label>
      <label class="check"><input type="checkbox" data-act-change="vibrar" ${p.vibrar ? 'checked' : ''}><span>Vibración (Android)</span></label></div>
    <h2>Tus datos</h2>
    <div class="card"><p class="small muted mt0">Todo se guarda <b>solo en este dispositivo</b>. Si cambias de móvil o borras los datos del navegador, se pierden: haz una copia de vez en cuando.</p>
      <div class="btn-row"><button class="btn" data-act="exportar">Copia de seguridad</button><button class="btn" data-act="importar">Restaurar copia</button></div>
      <button class="btn full mt8" data-act="csv">Exportar a Excel (CSV)</button>
      <input type="file" id="file-in" accept="application/json,.json" class="hidden">
      <p class="small dim mb0 mt8">${S.sesiones.length} entrenos · ${S.plantillas.length} rutinas guardadas</p></div>
    <div class="card"><h3>Privacidad</h3><p class="small muted mb0">La libreta no usa cuentas, cookies ni analítica. iO.GENIX no recibe tus entrenos. Los enlaces a la tienda llevan una etiqueta de campaña (UTM) para saber que vienes desde la libreta.</p></div>
    <div class="card"><h3>Aviso</h3><p class="small muted mb0">Las recomendaciones son orientativas y generales para personas adultas sanas. No sustituyen el consejo de un profesional sanitario, dietista-nutricionista o entrenador. ${esc(AVISO_LEGAL)}</p></div>
    <button class="btn danger full" data-act="reset">Borrar todos mis datos</button>
    <p class="legal center mt16">Libreta iO.GENIX v${VERSION} · AYOLABS, S.L.<br><a href="${TIENDA}/?${UTM}" target="_blank" rel="noopener">tienda.iogenixnutrition.com</a> · <a href="https://www.instagram.com/io.genix/" target="_blank" rel="noopener">@io.genix</a></p>`;
};

/* ================= ACCIONES ================= */
function nuevaSesion(nombre = '', bloques = [], plantilla = null) {
  S.activa = { id: uid(), inicio: Date.now(), nombre, bloques, plantilla };
  save(true); go('sesion');
}
function bloqueEj(ejId, obj = null, s = 3, d = null) {
  const e = ej(ejId);
  const desc = d != null ? d : (e.m === 'dist' ? 0 : e.m === 'm' ? 60 : S.perfil.descanso);
  return { id: uid(), k: 'ej', ej: ejId, d: desc, obj, nota: '', series: Array.from({ length: Math.max(1, s) }, () => ({ a: '', b: '', c: '', hecho: false, t: null })) };
}
function desdePlantilla(p) {
  return p.bloques.map((b) => b.k === 'ej' ? bloqueEj(b.ej, b.r ?? null, b.s || 3, b.d ?? null)
    : b.k === 'wod' ? { id: uid(), k: 'wod', formato: b.formato || 'AMRAP', min: b.min || '', rondas: '', tiempo: '', mov: b.mov || '' }
      : { id: uid(), k: 'dep', dep: b.dep || 'Pádel', min: b.min || '', res: '', nota: '' });
}
function findBlock(id) { return S.activa && S.activa.bloques.find((b) => b.id === id); }

function sheetEjercicios(onPick, multi) {
  const picked = new Set();
  const draw = (q = '') => {
    const ql = q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const list = [...EJERCICIOS, ...S.custom].filter((e) => !ql || e.n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(ql));
    const groups = [...GRUPOS, 'Mis ejercicios'];
    let html = '';
    for (const g of groups) { const items = list.filter((e) => (e.custom ? 'Mis ejercicios' : e.g) === g); if (!items.length) continue; html += `<p class="group-title">${g}</p>` + items.map((e) => `<div class="ex-item" data-pick="${e.id}"><span>${esc(e.n)}</span><span class="${picked.has(e.id) ? 'g' : 'chev'}">${multi ? (picked.has(e.id) ? '✓' : '+') : '+'}</span></div>`).join(''); }
    if (!list.length) html = `<p class="muted small">No lo encontramos. Créalo abajo 👇</p>`;
    $('#ex-list').innerHTML = html;
  };
  const bg = sheet(`<h2>${multi ? 'Elige ejercicios' : 'Añadir ejercicio'}</h2><div class="search"><input class="input" id="ex-q" placeholder="Buscar: sentadilla, remo, carrera…" autocomplete="off"></div><div id="ex-list"></div>
    <div class="card mt12"><p class="eyebrow">¿No está? Créalo</p><input class="input" id="ex-new" placeholder="Nombre del ejercicio" maxlength="40"><div class="chips mt8" id="ex-m">${[['kg', 'Peso y reps'], ['bw', 'Solo reps'], ['seg', 'Tiempo (s)'], ['dist', 'Distancia'], ['m', 'Metros + tiempo']].map(([k, l], i) => `<button class="chip ${i ? '' : 'on'}" data-act="pick" data-g="ex-m" data-v="${k}">${l}</button>`).join('')}</div><button class="btn full mt8" id="ex-create">Crear y añadir</button></div>
    ${multi ? '<button class="btn primary full big mt12" id="ex-done">Listo</button>' : ''}`);
  draw();
  $('#ex-q').addEventListener('input', (e) => draw(e.target.value));
  $('#ex-list').addEventListener('click', (e) => { const it = e.target.closest('[data-pick]'); if (!it) return; const id = it.dataset.pick; if (multi) { picked.has(id) ? picked.delete(id) : picked.add(id); draw($('#ex-q').value); } else { closeSheet(); onPick([id]); } });
  $('#ex-create').onclick = () => {
    const n = $('#ex-new').value.trim(); if (!n) return toast('Escribe un nombre');
    const m = ($('#ex-m .chip.on') || {}).dataset?.v || 'kg';
    const id = 'c-' + uid(); S.custom.push({ id, n, g: 'Mis ejercicios', m, custom: true }); EJ = ejMap(); save();
    if (multi) { picked.add(id); draw($('#ex-q').value); $('#ex-new').value = ''; } else { closeSheet(); onPick([id]); }
  };
  if (multi) $('#ex-done').onclick = () => { closeSheet(); onPick([...picked]); };
  return bg;
}

function sheetTerminar() {
  const a = S.activa; const elapsed = Math.max(1, Math.round((Date.now() - a.inicio) / 60000));
  const est = metrics({ bloques: a.bloques }).dur;
  const mins = a.editId ? (S.sesiones.find((x) => x.id === a.editId) || {}).dur || elapsed : (elapsed < 15 && est > elapsed ? Math.round(est) : elapsed);
  const d0 = new Date(a.inicio); const local = `${d0.getFullYear()}-${pad(d0.getMonth() + 1)}-${pad(d0.getDate())}T${pad(d0.getHours())}:${pad(d0.getMinutes())}`;
  const pend = a.bloques.filter((b) => b.k === 'ej').reduce((n, b) => n + b.series.filter((r) => !r.hecho && has(r.a)).length, 0);
  sheet(`<h2>¿Qué tal ha ido?</h2>
    ${pend ? `<p class="small muted">Tienes ${pend} ${pend === 1 ? 'serie' : 'series'} con datos sin marcar: se guardarán igualmente.</p>` : ''}
    <div class="cfg"><div><label class="f">Duración (min)</label><input class="input" id="t-dur" inputmode="numeric" value="${mins}"></div><div><label class="f">Fecha y hora</label><input class="input" id="t-fecha" type="datetime-local" value="${local}" style="padding:10px 8px"></div></div>
    <label class="f">Esfuerzo de la sesión: <b id="t-rpe-v">7</b>/10 <span class="dim" id="t-rpe-l">· duro</span></label><input type="range" id="t-rpe" min="1" max="10" value="7">
    <label class="f">Sensaciones</label><div class="chips" id="t-sens">${['😫 Fatal', '😕 Regular', '🙂 Bien', '😀 Muy bien', '🔥 Brutal'].map((x, i) => `<button class="chip ${i === 2 ? 'on' : ''}" data-act="pick" data-g="t-sens" data-v="${x}">${x}</button>`).join('')}</div>
    <label class="f">Notas</label><textarea class="input" id="t-notas" placeholder="Dormí poco, me noté fuerte en sentadilla…"></textarea>
    <button class="btn primary big full mt16" id="t-ok">Guardar entreno</button>`);
  const lbl = ['muy suave', 'muy suave', 'suave', 'moderado', 'algo duro', 'duro', 'duro', 'muy duro', 'muy duro', 'máximo'];
  $('#t-rpe').oninput = (e) => { $('#t-rpe-v').textContent = e.target.value; $('#t-rpe-l').textContent = '· ' + lbl[e.target.value - 1]; };
  $('#t-ok').onclick = () => finalizar({ inicio: new Date($('#t-fecha').value).getTime() || a.inicio, dur: parseInt($('#t-dur').value, 10) || mins, rpe: parseInt($('#t-rpe').value, 10), sensacion: ($('#t-sens .chip.on') || {}).dataset?.v || '', notas: $('#t-notas').value.trim() });
}

function finalizar({ inicio, dur, rpe, sensacion, notas }) {
  const a = S.activa;
  const bloques = a.bloques.map((b) => {
    if (b.k === 'ej') { const series = b.series.filter((r) => r.hecho || has(r.a)).map((r) => ({ ...r, hecho: true })); return series.length ? { ...b, series } : null; }
    if (b.k === 'wod') return (b.min || b.rondas || b.tiempo || b.mov) ? b : null;
    if (b.k === 'dep') return b.min || b.res || b.nota ? b : null;
    return null;
  }).filter(Boolean);
  if (!bloques.length) { closeSheet(); return confirmar('El entreno está vacío. ¿Lo descartamos?', 'Descartar', () => { S.activa = null; stopRest(); save(true); go('hoy'); }); }
  const ini = inicio || a.inicio;
  const s = { id: a.editId || a.id, inicio: ini, fin: ini + dur * 60000, dur, rpe, sensacion, notas, nombre: (a.nombre || '').trim(), bloques, plantilla: a.plantilla };
  if (a.editId) S.sesiones = S.sesiones.filter((x) => x.id !== a.editId);
  S.sesiones.push(s); S.sesiones.sort((x, y) => y.inicio - x.inicio);
  s.prs = recordsOf(s);
  s.perfil = perfilSesion(s);
  S.activa = null; stopRest(); closeSheet(); save(true);
  buzz([80, 60, 80]);
  go('resumen', s.id);
}

async function compartirStory(id) {
  const s = S.sesiones.find((x) => x.id === id); if (!s) return;
  const bg = sheet(`<h2>Compártelo en stories</h2><p class="small muted">Súbelo y menciona a <b>@io.genix</b> para que lo veamos 🙌</p><div id="st-prev" class="center muted small">Creando imagen…</div><div class="btn-row mt12" id="st-btns"></div>`);
  const c = await storyCanvas(s);
  const url = c.toDataURL('image/png');
  if (!document.body.contains(bg)) return;
  $('#st-prev').innerHTML = `<img src="${url}" alt="Resumen del entreno" style="width:62%;margin:0 auto;border-radius:14px;border:1px solid var(--line)">`;
  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  const file = new File([blob], `entreno-iogenix-${dayKey(s.inicio)}.png`, { type: 'image/png' });
  const canShare = navigator.canShare && navigator.canShare({ files: [file] });
  $('#st-btns').innerHTML = `${canShare ? '<button class="btn primary big" id="st-share">Compartir</button>' : ''}<a class="btn ${canShare ? '' : 'primary'} big" href="${url}" download="${file.name}">Descargar</a>`;
  if (canShare) $('#st-share').onclick = async () => { try { await navigator.share({ files: [file], title: 'Mi entreno', text: 'Entreno completado con mi libreta @io.genix 💪' }); } catch (e) {} };
}

function descargar(nombre, contenido, tipo) {
  const blob = new Blob([contenido], { type: tipo }); const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function exportCSV() {
  const L = [['fecha', 'entreno', 'tipo', 'bloque', 'ejercicio', 'serie', 'campo1', 'valor1', 'campo2', 'valor2', 'campo3', 'valor3', 'descanso_s', 'rpe_sesion', 'duracion_min', 'notas']];
  for (const s of [...S.sesiones].reverse()) {
    const base = [fmtFecha(s.inicio, true), s.nombre || '', (PERFILES[s.perfil] || {}).t || ''];
    s.bloques.forEach((b, i) => {
      if (b.k === 'ej') { const e = ej(b.ej); const cols = COLS[e.m]; rowsDone(b).forEach((r, j) => L.push([...base, i + 1, e.n, j + 1, cols[0][0], r.a, cols[1][0], r.b, cols[2][0], r.c, b.d || '', s.rpe || '', s.dur || '', b.nota || ''])); }
      else if (b.k === 'wod') L.push([...base, i + 1, 'WOD ' + b.formato, '', 'min', b.min, 'rondas', b.rondas, 'tiempo', b.tiempo, '', s.rpe || '', s.dur || '', (b.mov || '').replace(/\n/g, ' / ')]);
      else L.push([...base, i + 1, b.dep, '', 'min', b.min, 'resultado', b.res, '', '', '', s.rpe || '', s.dur || '', b.nota || '']);
    });
  }
  const csv = '﻿' + L.map((r) => r.map((v) => { v = String(v ?? ''); return /[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(';')).join('\n');
  descargar(`libreta-iogenix-${dayKey(Date.now())}.csv`, csv, 'text/csv;charset=utf-8');
}

const ACT = {
  nav: (t) => { closeSheet(); go(t.dataset.v, t.dataset.id); },
  close: () => closeSheet(),
  pick: (t) => { $$(`#${t.dataset.g} .chip`).forEach((c) => c.classList.toggle('on', c === t)); },
  'onb-fin': () => {
    S.perfil.nombre = $('#o-nombre').value.trim(); S.perfil.proteina = ($('#o-prot .chip.on') || {}).dataset?.v || 'whey';
    S.perfil.adulto = $('#o-adulto').checked; S.perfil.onb = true; save(true); go('hoy');
  },
  empezar: () => sheetEmpezar(),
  continuar: () => { closeSheet(); go('sesion'); },
  instalar: async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; render(); },
  nueva: (t) => {
    closeSheet(); const tipo = t.dataset.tipo;
    if (tipo === 'wod') return nuevaSesion('WOD', [{ id: uid(), k: 'wod', formato: 'AMRAP', min: '', rondas: '', tiempo: '', mov: '' }]);
    if (tipo === 'dep') return nuevaSesion('', [{ id: uid(), k: 'dep', dep: 'Pádel', min: '', res: '', nota: '' }]);
    if (tipo === 'cardio') return nuevaSesion('Cardio', [bloqueEj('carrera', null, 1)]);
    nuevaSesion('', []); setTimeout(() => ACT['add-ej'](), 60);
  },
  'usar-plantilla': (t) => {
    const p = [...S.plantillas, ...PLANTILLAS_IOGENIX].find((x) => x.id === t.dataset.id); if (!p) return;
    closeSheet();
    const go2 = () => nuevaSesion(p.nombre, desdePlantilla(p), p.id);
    if (S.activa) return confirmar('Ya tienes un entreno en marcha. ¿Lo descartas y empiezas esta rutina?', 'Empezar nueva', go2);
    go2();
  },
  'add-ej': () => sheetEjercicios((ids) => { ids.forEach((id) => S.activa.bloques.push(bloqueEj(id, null, ej(id).m === 'dist' ? 1 : 3))); save(); render(); setTimeout(() => { const bl = $$('.block'); if (bl.length) bl[bl.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); }),
  'add-wod': () => { S.activa.bloques.push({ id: uid(), k: 'wod', formato: 'AMRAP', min: '', rondas: '', tiempo: '', mov: '' }); save(); render(); },
  'add-dep': () => { S.activa.bloques.push({ id: uid(), k: 'dep', dep: 'Pádel', min: '', res: '', nota: '' }); save(); render(); },
  'add-serie': (t) => { const b = findBlock(t.dataset.b); b.series.push({ a: '', b: '', c: '', hecho: false, t: null }); save(); render(); },
  'del-serie': (t) => { const b = findBlock(t.dataset.b); if (b.series.length > 1) b.series.pop(); save(); render(); },
  mover: (t) => { const i = +t.dataset.i, d = +t.dataset.d, B = S.activa.bloques; if (i + d < 0 || i + d >= B.length) return; [B[i], B[i + d]] = [B[i + d], B[i]]; save(); render(); },
  'quitar-bloque': (t) => confirmar('¿Quitar este bloque del entreno?', 'Quitar', () => { S.activa.bloques.splice(+t.dataset.i, 1); save(); render(); }),
  hecho: (t) => {
    const b = findBlock(t.dataset.b); const j = +t.dataset.j; const r = b.series[j]; const e = ej(b.ej);
    audioOn();
    if (!r.hecho) {
      // si está vacío, acepta lo sugerido (última vez / objetivo)
      const tr = t.closest('tr');
      ['a', 'b', 'c'].forEach((f) => { if (!has(r[f]) && !r[f]) { const inp = tr.querySelector(`[data-bind$=":${f}"]`); if (inp && inp.placeholder) r[f] = inp.placeholder; } });
      if (!r.a) { toast(`Apunta primero ${COLS[e.m][0][0].toLowerCase()}`); return; }
      r.hecho = true; r.t = Date.now();
      // ¿récord?
      const prev = bestOf(S.sesiones.filter((s) => s.id !== (S.activa.editId || '')), b.ej);
      if (prev) {
        let pr = false;
        if (e.m === 'kg') pr = num(r.a) > prev.kg || (e1rm(num(r.a), num(r.b)) > prev.e1rm * 1.001 && prev.e1rm > 0);
        else if (e.m === 'bw') pr = (!num(r.b) && num(r.a) > prev.reps);
        else if (e.m === 'seg') pr = num(r.a) > prev.seg;
        else if (e.m === 'dist') pr = num(r.a) > prev.km;
        if (pr) { toast('🏆 ¡Nuevo récord en ' + esc(e.n) + '!'); buzz([60, 40, 60, 40, 120]); beep(1318, 160); }
      }
      const isLast = j === b.series.length - 1;
      if (b.d > 0) startRest(b.d, e.n + (isLast ? ' · último' : ''));
    } else { r.hecho = false; r.t = null; }
    save(); render();
  },
  descanso: (t) => {
    const b = findBlock(t.dataset.b);
    sheet(`<h2>Descanso en ${esc(ej(b.ej).n)}</h2><div class="chips">${[0, 30, 45, 60, 75, 90, 120, 150, 180, 240, 300].map((s) => `<button class="chip ${b.d === s ? 'on' : ''}" data-act="set-desc" data-b="${b.id}" data-v="${s}">${s ? fmtClock(s) : 'Sin descanso'}</button>`).join('')}</div><p class="small muted mt12">Al marcar una serie como hecha arranca la cuenta atrás. Te avisamos con sonido${navigator.vibrate ? ' y vibración' : ''}.</p>`);
  },
  'set-desc': (t) => { const b = findBlock(t.dataset.b); b.d = +t.dataset.v; save(); closeSheet(); render(); },
  'rest-add': (t) => addRest(+t.dataset.d),
  'rest-skip': () => stopRest(),
  'wod-formato': (t) => { const b = findBlock(t.dataset.b); b.formato = t.dataset.v; save(); render(); },
  'wod-crono': (t) => {
    const b = findBlock(t.dataset.b); const min = num(b.min) || 12;
    const map = { AMRAP: ['AMRAP', { min }], EMOM: ['EMOM', { min, cada: 60 }], 'For Time': ['For Time', { cap: min }], Tabata: ['Tabata', { work: 20, rest: 10, rondas: 8 }], Rondas: ['For Time', { cap: min }] };
    const [modo, cfg] = map[b.formato] || map.AMRAP;
    timerReset(); T.modo = modo; T.cfg = { ...MODOS[modo].cfg, ...cfg }; T.fromBlock = b.id; go('cronos');
  },
  terminar: () => sheetTerminar(),
  descartar: () => confirmar('¿Descartar este entreno? Se perderá lo apuntado.', 'Descartar', () => { S.activa = null; stopRest(); save(true); go('hoy'); }),
  story: (t) => compartirStory(t.dataset.id),
  repetir: (t) => {
    const s = S.sesiones.find((x) => x.id === t.dataset.id); if (!s) return;
    const bl = s.bloques.map((b) => b.k === 'ej' ? bloqueEj(b.ej, null, rowsDone(b).length, b.d) : { ...b, id: uid(), rondas: '', tiempo: '', res: '' });
    const go2 = () => nuevaSesion(s.nombre, bl, s.plantilla);
    S.activa ? confirmar('Ya tienes un entreno en marcha. ¿Lo descartas?', 'Empezar nueva', go2) : go2();
  },
  'guardar-rutina': (t) => {
    const s = S.sesiones.find((x) => x.id === t.dataset.id); if (!s) return;
    sheet(`<h2>Guardar como rutina</h2><label class="f">Nombre</label><input class="input" id="r-n" value="${esc(s.nombre || 'Mi rutina')}" maxlength="40"><button class="btn primary big full mt16" id="r-ok">Guardar</button>`);
    $('#r-ok').onclick = () => {
      const nombre = $('#r-n').value.trim() || 'Mi rutina';
      S.plantillas.unshift({ id: 'p-' + uid(), nombre, tipo: s.perfil, bloques: s.bloques.map((b) => b.k === 'ej' ? { k: 'ej', ej: b.ej, s: rowsDone(b).length, d: b.d } : b.k === 'wod' ? { k: 'wod', formato: b.formato, min: b.min, mov: b.mov } : { k: 'dep', dep: b.dep, min: b.min }) });
      save(true); closeSheet(); toast('⭐ Rutina guardada');
    };
  },
  'crear-rutina': () => {
    sheetEjercicios((ids) => {
      if (!ids.length) return;
      sheet(`<h2>Nueva rutina</h2><p class="small muted">${ids.map((id) => esc(ej(id).n)).join(' · ')}</p><label class="f">Nombre</label><input class="input" id="r-n" placeholder="Torso A, Pierna, Pádel + core…" maxlength="40"><label class="f">Series por ejercicio</label><div class="chips" id="r-s">${[2, 3, 4, 5].map((n) => `<button class="chip ${n === 3 ? 'on' : ''}" data-act="pick" data-g="r-s" data-v="${n}">${n}</button>`).join('')}</div><button class="btn primary big full mt16" id="r-ok">Guardar rutina</button>`);
      $('#r-ok').onclick = () => {
        const n = +(($('#r-s .chip.on') || {}).dataset?.v || 3);
        S.plantillas.unshift({ id: 'p-' + uid(), nombre: $('#r-n').value.trim() || 'Mi rutina', bloques: ids.map((id) => ({ k: 'ej', ej: id, s: ej(id).m === 'dist' ? 1 : n })) });
        save(true); closeSheet(); render(); toast('⭐ Rutina creada');
      };
    }, true);
  },
  'borrar-rutina': (t) => confirmar('¿Borrar esta rutina?', 'Borrar', () => { S.plantillas = S.plantillas.filter((p) => p.id !== t.dataset.id); save(true); render(); }),
  editar: (t) => {
    const s = S.sesiones.find((x) => x.id === t.dataset.id); if (!s) return;
    const go2 = () => { S.activa = { id: uid(), editId: s.id, inicio: s.inicio, nombre: s.nombre, plantilla: s.plantilla, bloques: JSON.parse(JSON.stringify(s.bloques)) }; save(true); go('sesion'); };
    S.activa && !S.activa.editId ? confirmar('Tienes un entreno en marcha. ¿Lo descartas para editar este?', 'Editar', go2) : go2();
  },
  borrar: (t) => confirmar('¿Eliminar este entreno?', 'Eliminar', () => { S.sesiones = S.sesiones.filter((s) => s.id !== t.dataset.id); save(true); go('historial'); }),
  mes: (t) => { const d = +t.dataset.d; let { y, m } = HIST_MES; m += d; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } HIST_MES = { y, m }; render(); },
  set: (t) => { const k = t.dataset.k; S.perfil[k] = k === 'descanso' ? +t.dataset.v : t.dataset.v; save(); render(); },
  exportar: () => { descargar(`libreta-iogenix-copia-${dayKey(Date.now())}.json`, JSON.stringify(S), 'application/json'); toast('Copia descargada ✅'); },
  importar: () => $('#file-in').click(),
  csv: () => exportCSV(),
  reset: () => confirmar('¿Borrar TODOS tus entrenos, rutinas y ajustes? No se puede deshacer.', 'Borrar todo', () => { localStorage.removeItem(KEY); S = DEFAULT_STATE(); EJ = ejMap(); go('onb'); }),
  // cronómetro
  't-modo': (t) => { timerReset(); T.modo = t.dataset.v; T.cfg = { ...MODOS[T.modo].cfg }; T.fromBlock = null; render(); },
  't-step': (t) => { const k = t.dataset.k; const min = { seg: 5, min: 1, cada: 15, cap: 1, work: 5, rest: 0, rondas: 1 }[k]; T.cfg[k] = Math.max(min, Math.min(k === 'rondas' ? 50 : 3600, T.cfg[k] + +t.dataset.d)); render(); },
  't-start': () => timerStart(),
  't-pause': () => timerPause(),
  't-reset': () => timerReset(),
  't-ronda': () => { T.rondas++; beep(1175, 90); buzz(40); paintTimer(); },
  't-fin': () => timerFinish(true),
  't-guardar': () => {
    const b = findBlock(T.fromBlock); if (!b) { toast('El entreno ya no está abierto'); return; }
    if (T.modo === 'AMRAP') b.rondas = String(T.rondas);
    if (T.modo === 'For Time') b.tiempo = fmtClock(workSeconds());
    if (T.modo === 'EMOM' || T.modo === 'Tabata') b.rondas = b.rondas || 'Completado';
    save(true); T.fromBlock = null; timerReset(); toast('Resultado guardado ✅'); go('sesion');
  },
};

/* ---------------- eventos ---------------- */
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  const fn = ACT[t.dataset.act]; if (fn) { e.preventDefault(); fn(t, e); }
});
document.addEventListener('input', (e) => {
  const bind = e.target.dataset && e.target.dataset.bind; if (!bind) return;
  const p = bind.split(':'); const v = e.target.value;
  if (p[0] === 'nombre' && S.activa) S.activa.nombre = v;
  else if (p[0] === 'perfil') S.perfil[p[1]] = v;
  else if (p[0] === 'b') { const b = findBlock(p[1]); if (b) { b[p[2]] = v; if (p[2] === 'dep') { const h = e.target.closest('.block').querySelector('h3'); if (h) h.textContent = v; } } }
  else if (p[0] === 's') { const b = findBlock(p[1]); if (b && b.series[+p[2]]) b.series[+p[2]][p[3]] = v; }
  save();
});
document.addEventListener('change', (e) => {
  const k = e.target.dataset && e.target.dataset.actChange;
  if (k === 'prog-ej') { PROG_EJ = e.target.value; render(); }
  else if (['adulto', 'sonido', 'vibrar'].includes(k)) { S.perfil[k] = e.target.checked; save(true); }
  else if (e.target.id === 'file-in') {
    const f = e.target.files[0]; if (!f) return;
    f.text().then((txt) => {
      try { const d = JSON.parse(txt); if (!Array.isArray(d.sesiones)) throw 0; confirmar(`¿Restaurar la copia con ${d.sesiones.length} entrenos? Sustituye lo que hay ahora en la libreta.`, 'Restaurar', () => { S = { ...DEFAULT_STATE(), ...d, perfil: { ...DEFAULT_STATE().perfil, ...d.perfil, onb: true } }; EJ = ejMap(); save(true); toast('Copia restaurada ✅'); go('hoy'); }, false); }
      catch (err) { toast('Ese archivo no es una copia válida de la libreta'); }
    });
  }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

/* reloj de la sesión */
let clockIv = null;
function startClock() { stopClock(); const tick = () => { const el = $('#clock'); if (el && S.activa) el.textContent = fmtClock((Date.now() - S.activa.inicio) / 1000); }; tick(); clockIv = setInterval(tick, 1000); }
function stopClock() { clearInterval(clockIv); }

/* arranque */
V = parseHash();
render();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
