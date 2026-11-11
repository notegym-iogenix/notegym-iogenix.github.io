/* Libreta iO.GENIX · gráficas SVG e imagen para stories */

/* Línea simple: pts = [{x: timestamp, y: number}] */
function lineChart(pts, { w = 340, h = 170, fmt = (v) => fmtN(v, 1), invert = false } = {}) {
  if (!pts.length) return '<p class="muted small">Aún no hay datos.</p>';
  const L = 34, R = 10, Tp = 12, B = 22;
  const ys = pts.map((p) => p.y); let min = Math.min(...ys), max = Math.max(...ys);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.12; min -= pad; max += pad;
  const X = (i) => pts.length === 1 ? (L + (w - L - R) / 2) : L + i * (w - L - R) / (pts.length - 1);
  const Y = (v) => { const r = (v - min) / (max - min); return Tp + (invert ? r : 1 - r) * (h - Tp - B); };
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
  const area = `${path}L${X(pts.length - 1).toFixed(1)},${h - B}L${X(0).toFixed(1)},${h - B}Z`;
  const ticks = [max - pad, (max + min) / 2, min + pad];
  let g = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a54a" stop-opacity=".35"/><stop offset="1" stop-color="#c9a54a" stop-opacity="0"/></linearGradient></defs>`;
  for (const t of ticks) g += `<line x1="${L}" x2="${w - R}" y1="${Y(t)}" y2="${Y(t)}" stroke="#2c2416" stroke-width="1"/><text x="${L - 5}" y="${Y(t) + 3}" text-anchor="end">${fmt(t)}</text>`;
  g += `<path d="${area}" fill="url(#ga)"/><path d="${path}" fill="none" stroke="#ecd38a" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`;
  pts.forEach((p, i) => { g += `<circle cx="${X(i)}" cy="${Y(p.y)}" r="${i === pts.length - 1 ? 4 : 2.6}" fill="${i === pts.length - 1 ? '#ecd38a' : '#c9a54a'}"/>`; });
  const lab = (i) => { const d = new Date(pts[i].x); return `${d.getDate()} ${MESES[d.getMonth()]}`; };
  g += `<text x="${X(0)}" y="${h - 6}" text-anchor="start">${lab(0)}</text>`;
  if (pts.length > 1) g += `<text x="${X(pts.length - 1)}" y="${h - 6}" text-anchor="end">${lab(pts.length - 1)}</text>`;
  return g + '</svg>';
}

/* Barras: bars = [{label, v}] */
function barChart(bars, { w = 340, h = 150, fmt = (v) => fmtN(v) } = {}) {
  const L = 8, R = 8, Tp = 16, B = 20; const max = Math.max(1, ...bars.map((b) => b.v));
  const bw = (w - L - R) / bars.length;
  let g = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">`;
  bars.forEach((b, i) => {
    const bh = (b.v / max) * (h - Tp - B); const x = L + i * bw + bw * 0.18; const y = h - B - bh; const last = i === bars.length - 1;
    g += `<rect x="${x}" y="${y}" width="${bw * 0.64}" height="${Math.max(bh, b.v ? 2 : 0)}" rx="4" fill="${last ? '#ecd38a' : '#8a6a22'}"/>`;
    if (b.v) g += `<text x="${x + bw * 0.32}" y="${y - 4}" text-anchor="middle" style="fill:${last ? '#ecd38a' : '#b3a88f'}">${fmt(b.v)}</text>`;
    g += `<text x="${x + bw * 0.32}" y="${h - 6}" text-anchor="middle">${esc(b.label)}</text>`;
  });
  return g + '</svg>';
}

/* ---------- Imagen para stories (1080×1920) ---------- */
let LOGO_IMG = null;
function loadLogo() {
  return new Promise((res) => {
    if (LOGO_IMG) return res(LOGO_IMG);
    const i = new Image(); i.onload = () => { LOGO_IMG = i; res(i); }; i.onerror = () => res(null); i.src = 'img/logo.svg';
  });
}
function resumenBloque(b) {
  const e = ej(b.ej); const rows = rowsDone(b); if (!rows.length) return null;
  if (e.m === 'kg') { const best = rows.reduce((a, r) => (num(r.a) > num(a.a) ? r : a), rows[0]); return `${rows.length}×${has(best.b) ? num(best.b) : '–'} · ${has(best.a) ? fmtN(num(best.a), 1) + ' kg' : ''}`; }
  if (e.m === 'bw') return `${rows.length} series · ${rows.reduce((a, r) => a + (num(r.a) || 0), 0)} reps`;
  if (e.m === 'seg') return `${rows.length}×${fmtN(Math.max(...rows.map((r) => num(r.a) || 0)))} s`;
  if (e.m === 'dist') { const km = rows.reduce((a, r) => a + (num(r.a) || 0), 0); const t = rows.reduce((a, r) => a + (parseTime(r.b) || 0), 0); return `${fmtN(km, 2)} km${t ? ' · ' + fmtClock(t) : ''}`; }
  if (e.m === 'm') return `${rows.length}× ${fmtN(num(rows[0].a))} m`;
  return '';
}
function wrapText(ctx, text, maxW) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
async function storyCanvas(s) {
  try { await Promise.all([document.fonts.load('italic 700 120px "Barlow Condensed"'), document.fonts.load('800 40px Montserrat'), document.fonts.load('600 40px Montserrat')]); } catch (e) {}
  const logo = await loadLogo();
  const W = 1080, H = 1920; const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const m = metrics(s); const prs = s.prs || [];
  // fondo
  x.fillStyle = '#0b0a08'; x.fillRect(0, 0, W, H);
  let g = x.createRadialGradient(W / 2, -100, 50, W / 2, -100, 1100); g.addColorStop(0, 'rgba(201,165,74,.45)'); g.addColorStop(1, 'rgba(201,165,74,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  g = x.createRadialGradient(W, H + 200, 50, W, H + 200, 900); g.addColorStop(0, 'rgba(201,165,74,.18)'); g.addColorStop(1, 'rgba(201,165,74,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  // diagonales sutiles
  x.strokeStyle = 'rgba(201,165,74,.07)'; x.lineWidth = 2; for (let i = -H; i < W; i += 70) { x.beginPath(); x.moveTo(i, H); x.lineTo(i + H * 0.55, 0); x.stroke(); }
  // logo
  if (logo) { const lw = 520, lh = lw * 347 / 2061; x.drawImage(logo, (W - lw) / 2, 150, lw, lh); }
  const gold = x.createLinearGradient(100, 0, 980, 0); gold.addColorStop(0, '#b88c2c'); gold.addColorStop(0.45, '#f7e3a1'); gold.addColorStop(0.8, '#c79a3a');
  // altura estimada del contenido para centrarlo entre logo y pie
  x.font = 'italic 700 132px "Barlow Condensed"';
  const nLines = wrapText(x, (s.nombre || PERFILES[s.perfil || 'hipertrofia'].t).toUpperCase(), 920).slice(0, 2).length;
  const nItems = (s.bloques || []).filter((b) => b.k !== 'ej' || rowsDone(b).length).length;
  const shownN = Math.min(nItems, prs.length ? 6 : 8);
  const estH = 30 + 150 + nLines * 128 + 366 + Math.max(1, shownN) * 92 + (nItems > shownN ? 60 : 20) + (prs.length ? 70 + Math.min(3, prs.length) * 56 : 0);
  const off = Math.max(0, Math.round((1640 - 300 - estH) / 2));
  x.save(); x.translate(0, off);
  x.textAlign = 'center';
  x.fillStyle = '#c9a54a'; x.font = '800 34px Montserrat'; x.letterSpacing = '8px';
  x.fillText('ENTRENO COMPLETADO', W / 2, 330); x.letterSpacing = '0px';
  // título
  x.fillStyle = gold; x.font = 'italic 700 132px "Barlow Condensed"';
  const title = (s.nombre || PERFILES[s.perfil || 'hipertrofia'].t).toUpperCase();
  let lines = wrapText(x, title, 920).slice(0, 2); let y = 480;
  for (const l of lines) { x.fillText(l, W / 2, y); y += 128; }
  x.fillStyle = '#b3a88f'; x.font = '600 38px Montserrat'; x.fillText(fmtFecha(s.inicio, false).replace(/^./, (c) => c.toUpperCase()) + ' · ' + new Date(s.inicio).getFullYear(), W / 2, y + 6);
  // stats
  const stats = [];
  const dm = Math.round(m.dur);
  stats.push([dm >= 60 ? `${Math.floor(dm / 60)}h ${pad(dm % 60)}′` : `${dm}′`, 'DURACIÓN']);
  if (m.vol >= 1) stats.push([m.vol >= 10000 ? fmtN(m.vol / 1000, 1) + ' t' : fmtN(m.vol) + ' kg', 'VOLUMEN']);
  if (m.km >= 0.1) stats.push([fmtN(m.km, 1) + ' km', 'DISTANCIA']);
  if (m.series) stats.push([String(m.series), 'SERIES']);
  if (m.depMin && stats.length < 3 && m.depMin !== dm) stats.push([`${Math.round(m.depMin)}′`, (m.dep[0] || 'DEPORTE').toUpperCase()]);
  if (s.rpe && stats.length < 3) stats.push([`${s.rpe}/10`, 'ESFUERZO']);
  const st = stats.slice(0, 3); const bw = 300, gap = 30, sx = (W - (st.length * bw + (st.length - 1) * gap)) / 2; y += 70;
  st.forEach(([v, l], i) => {
    const bx = sx + i * (bw + gap);
    x.fillStyle = 'rgba(32,26,16,.92)'; roundRect(x, bx, y, bw, 190, 28); x.fill();
    x.strokeStyle = 'rgba(201,165,74,.45)'; x.lineWidth = 2; roundRect(x, bx, y, bw, 190, 28); x.stroke();
    x.fillStyle = '#ecd38a'; x.font = 'italic 700 86px "Barlow Condensed"'; x.fillText(v, bx + bw / 2, y + 108);
    x.fillStyle = '#b3a88f'; x.font = '700 24px Montserrat'; x.fillText(l, bx + bw / 2, y + 155);
  });
  y += 290;
  // ejercicios
  const items = [];
  for (const b of s.bloques || []) {
    if (b.k === 'ej') { const r = resumenBloque(b); if (r) items.push([ej(b.ej).n, r]); }
    else if (b.k === 'wod') items.push([`WOD ${b.formato || ''}`.trim(), [b.min ? b.min + ' min' : '', b.rondas ? b.rondas + ' rondas' : '', b.tiempo || ''].filter(Boolean).join(' · ')]);
    else if (b.k === 'dep') items.push([b.dep || 'Deporte', b.min ? b.min + ' min' : '']);
  }
  const maxItems = prs.length ? 6 : 8; const shown = items.slice(0, maxItems);
  x.textAlign = 'left';
  shown.forEach(([n, r], i) => {
    const iy = y + i * 92;
    x.fillStyle = 'rgba(201,165,74,.9)'; x.beginPath(); x.arc(120, iy - 12, 7, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#f5f0e4'; x.font = '700 40px Montserrat'; let nn = n; while (x.measureText(nn).width > 520 && nn.length > 4) nn = nn.slice(0, -2); if (nn !== n) nn += '…'; x.fillText(nn, 150, iy);
    x.textAlign = 'right'; x.fillStyle = '#ecd38a'; x.font = '600 36px Montserrat'; x.fillText(r, W - 110, iy); x.textAlign = 'left';
    x.strokeStyle = 'rgba(201,165,74,.16)'; x.lineWidth = 2; x.beginPath(); x.moveTo(110, iy + 32); x.lineTo(W - 110, iy + 32); x.stroke();
  });
  if (items.length > maxItems) { x.fillStyle = '#7d735f'; x.font = '600 32px Montserrat'; x.fillText(`+ ${items.length - maxItems} más`, 150, y + shown.length * 92); }
  y += Math.max(1, shown.length) * 92 + (items.length > maxItems ? 60 : 20);
  // récords
  if (prs.length) {
    x.fillStyle = 'rgba(201,165,74,.14)'; roundRect(x, 90, y, W - 180, 70 + Math.min(3, prs.length) * 56, 28); x.fill();
    x.fillStyle = '#ecd38a'; x.font = '800 32px Montserrat'; x.fillText(`🏆  ${prs.length === 1 ? 'NUEVO RÉCORD' : prs.length + ' NUEVOS RÉCORDS'}`, 130, y + 56);
    x.fillStyle = '#f5f0e4'; x.font = '600 32px Montserrat';
    prs.slice(0, 3).forEach((p, i) => { let t = `${ej(p.ej).n}: ${p.txt}`; while (x.measureText(t).width > W - 280 && t.length > 6) t = t.slice(0, -2); x.fillText(t, 130, y + 112 + i * 56); });
  }
  x.restore();
  // pie
  x.textAlign = 'center'; x.fillStyle = '#ecd38a'; x.font = 'italic 700 64px "Barlow Condensed"'; x.fillText('@io.genix', W / 2, H - 170);
  x.fillStyle = '#b3a88f'; x.font = '600 30px Montserrat'; x.fillText('Mi libreta de entreno iO.GENIX', W / 2, H - 118);
  return c;
}
function roundRect(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
