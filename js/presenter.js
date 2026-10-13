/* Presenter window: notes, timer, next-beat preview. Talks to the main window. */
(function () {
  const $ = id => document.getElementById(id);
  // The stage page is index.html locally; the hosted preview publishes a copy as stage.html
  $('pv').src = 'index.html?preview';
  $('pv0').src = 'index.html?preview';
  if (location.protocol.startsWith('http')) fetch('stage.html', { method: 'HEAD' }).then(r => { if (r.ok) { $('pv').src = 'stage.html?preview'; $('pv0').src = 'stage.html?preview'; } }).catch(() => {});
  const secs = TALK.sections;
  const secById = Object.fromEntries(secs.map(s => [s.id, s]));
  let st = null;              // last state from the main window
  let lastSeen = 0;

  /* ---------- messaging ---------- */
  let bc = null; try { bc = new BroadcastChannel('motion-talk'); } catch (e) {}
  const main = () => (window.opener && !window.opener.closed) ? window.opener : null;
  let lock = null;            // id of the main window this presenter follows
  function send(msg) {
    if (lock) msg.to = lock;
    msg.nonce = Math.random().toString(36).slice(2);
    try { main() && main().postMessage(msg, '*'); } catch (e) {}
    try { bc && bc.postMessage(msg); } catch (e) {}
  }
  const cmd = (c, extra) => send(Object.assign({ type: 'cmd', cmd: c }, extra || {}));
  function onMsg(m, src) {
    if (!m || typeof m !== 'object') return;
    if (m.type === 'state') {
      if (!lock || (src && src === window.opener)) lock = m.wid;
      if (m.wid !== lock) return;
      lastSeen = Date.now(); const first = !st; st = m; render(first); }
    if (m.type === 'preview-ready') sendPreview();
  }
  addEventListener('message', e => onMsg(e.data, e.source));
  if (bc) bc.onmessage = e => onMsg(e.data);
  send({ type: 'hello' });
  setInterval(() => { if (Date.now() - lastSeen > 3000) send({ type: 'hello' }); }, 2000);

  /* ---------- timer ---------- */
  const TK = 'motion-talk-timer';
  let tm = { start: 0, acc: 0, running: false };
  try { tm = Object.assign(tm, JSON.parse(localStorage.getItem(TK) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(TK, JSON.stringify(tm)); } catch (e) {} };
  const elapsed = () => (tm.acc + (tm.running ? Date.now() - tm.start : 0)) / 1000;
  function startTimer() { if (!tm.running) { tm.start = Date.now(); tm.running = true; save(); } }
  function toggleTimer() { if (tm.running) { tm.acc += Date.now() - tm.start; tm.running = false; } else startTimer(); save(); tick(); }
  $('tStart').onclick = toggleTimer;
  // two clicks to reset (no confirm dialogs)
  let armed = null;
  $('tReset').onclick = () => {
    if (!armed) { $('tReset').textContent = 'Сигурен? Натисни пак'; armed = setTimeout(() => { armed = null; $('tReset').textContent = 'Нулирай'; }, 3000); return; }
    clearTimeout(armed); armed = null; $('tReset').textContent = 'Нулирай';
    tm = { start: 0, acc: 0, running: false }; save(); tick();
  };
  const mmss = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const fmtMin = m => { const s = Math.round(m * 60); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  // plan bar
  const bar = $('bar');
  secs.filter(s => s.to > s.from).forEach(s => {
    const d = document.createElement('div'); d.className = 'seg';
    d.style.left = (s.from / TALK.totalMin * 100) + '%'; d.style.width = ((s.to - s.from) / TALK.totalMin * 100) + '%';
    d.title = s.n + ' ' + s.name; bar.insertBefore(d, bar.firstChild);
  });

  function tick() {
    const e = elapsed();
    $('elapsed').textContent = mmss(e);
    $('tStart').textContent = tm.running ? 'Пауза' : (e > 0 ? 'Продължи' : 'Старт');
    const now = new Date();
    $('clock').textContent = now.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
    $('barMark').style.left = Math.min(100, e / 60 / TALK.totalMin * 100) + '%';
    const sec = st && secById[st.steps[st.step].section];
    const status = $('status'), behind = $('behind');
    behind.hidden = true;
    if (!sec || (e === 0 && !tm.running)) { status.textContent = 'план: ' + TALK.totalMin + ' мин'; status.className = 'status'; return; }
    const m = e / 60;
    if (m > sec.to + 0.25) {
      status.textContent = '+' + mmss((m - sec.to) * 60) + ' изоставаш'; status.className = 'status late';
      const tip = secs.filter(s => s.ifBehind && s.from >= sec.from).map(s => s.ifBehind);
      if (tip.length) { behind.hidden = false; behind.textContent = tip.join(' '); }
    } else if (m < sec.from - 0.25) { status.textContent = '−' + mmss((sec.from - m) * 60) + ' напред'; status.className = 'status early'; }
    else { status.textContent = 'в график'; status.className = 'status ok'; }
  }
  setInterval(tick, 500);

  /* ---------- render ---------- */
  const esc = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  let renderedSec = null;
  function render(first) {
    $('conn').classList.add('on');
    const s = st.steps[st.step], sec = secById[s.section];
    $('secN').textContent = sec.n; $('secName').textContent = sec.name;
    $('secWin').textContent = sec.to > sec.from ? fmtMin(sec.from) + ' – ' + fmtMin(sec.to) : 'преди старта';
    $('stepNo').textContent = (st.step + 1) + ' / ' + st.total;
    $('now').textContent = s.beat;
    $('plain').innerHTML = TALK.plain[s.id] ? '<h4>1. Какво има на слайда</h4><p>' + esc(TALK.plain[s.id].slide) + '</p><h4>2. После обясни (просто)</h4><p>' + esc(TALK.plain[s.id].more) + '</p>' : '';
    const n = st.steps[st.step + 1];
    $('next').textContent = n ? (n.section !== s.section ? '[' + secById[n.section].n + '] ' : '') + n.beat : '— край —';
    $('bBlack').textContent = st.black ? 'Покажи екрана (B)' : 'Черен екран (B)';
    if (renderedSec !== sec.id) { renderNotes(sec); renderedSec = sec.id; }
    const cur = $('barCur');
    cur.style.left = (sec.from / TALK.totalMin * 100) + '%'; cur.style.width = (Math.max(0.3, sec.to - sec.from) / TALK.totalMin * 100) + '%';
    renderSteps();
    sendPreview();
    tick();
  }
  function renderNotes(sec) {
    let html = '';
    if (sec.why) html += `<div class="why"><h4>Защо го показвам</h4><p>${esc(sec.why)}</p></div>`;
    if (sec.say && sec.say.length) html += '<div class="say"><h4>Казваш</h4>' + sec.say.map(p => `<p>${esc(p)}</p>`).join('') + '</div>';
    if (sec.show && sec.show.length) {
      html += '<div class="show"><h4>Показваш</h4>' + sec.show.map((x, i) => typeof x === 'string'
        ? `<div class="item"><div class="plain">${esc(x)}</div></div>`
        : `<div class="item"><div class="lbl"><span>${esc(x.label)}</span><button data-copy="${i}">Копирай</button></div><div class="prompt">${esc(x.prompt)}</div></div>`).join('') + '</div>';
    }
    if (sec.remember) html += `<div><h4>Запомнят</h4><div class="remember">${esc(sec.remember)}</div></div>`;
    if (sec.mustKeep) html += `<div class="must">${esc(sec.mustKeep)}</div>`;
    $('notes').innerHTML = html;
    $('notes').querySelectorAll('[data-copy]').forEach(b => b.onclick = () => {
      const text = sec.show[+b.dataset.copy].prompt;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => { b.textContent = 'Копирано ✓'; setTimeout(() => b.textContent = 'Копирай', 1500); })
        .catch(() => { const ta = document.createElement('textarea'); ta.value = text; document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); b.textContent = 'Копирано ✓'; });
    });
    $('notes').parentElement.scrollTop = 0;
  }
  let stepsBuilt = false;
  function renderSteps() {
    const box = $('steps');
    if (!stepsBuilt) {
      let last = null, html = '';
      st.steps.forEach((s, i) => {
        if (s.section !== last) { const sec = secById[s.section]; html += `<div class="sh">${esc(sec.n)} · ${esc(sec.name)}</div>`; last = s.section; }
        html += `<button class="st" data-i="${i}">${i + 1}. ${esc(s.beat)}</button>`;
      });
      box.innerHTML = html;
      box.querySelectorAll('.st').forEach(b => b.onclick = () => cmd('goto', { step: +b.dataset.i }));
      stepsBuilt = true;
    }
    box.querySelectorAll('.st').forEach(b => b.classList.toggle('cur', +b.dataset.i === st.step));
  }
  function sendPreview() {
    if (!st) return;
    try { $('pv').contentWindow.postMessage({ type: 'preview', step: Math.min(st.step + 1, st.total - 1) }, '*'); } catch (e) {}
    try { $('pv0').contentWindow.postMessage({ type: 'preview', step: st.step }, '*'); } catch (e) {}
  }

  $('qa').innerHTML = TALK.qa.map(([q, a]) => `<div class="qa"><b>${esc(q)}</b><span>${esc(a)}</span></div>`).join('');
  $('backup').innerHTML = TALK.backup.map(b => `<p>${esc(b)}</p>`).join('');

  /* ---------- controls ---------- */
  function next() { if (st && st.step === 0 && !tm.running && elapsed() === 0) startTimer(); cmd('next'); }
  $('bNext').onclick = next;
  $('bPrev').onclick = () => cmd('prev');
  $('bBlack').onclick = () => cmd('black');
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key, c = e.code;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); cmd('prev'); }
    else if (c === 'KeyB' || k === 'b' || k === 'B' || k === '.') cmd('black');
    else if (c === 'KeyT' || k === 't' || k === 'T') toggleTimer();
  });
  // Also start the timer when the talk is advanced from the main window
  let prevStep = null;
  setInterval(() => { if (st && prevStep === 0 && st.step === 1 && !tm.running && elapsed() === 0) startTimer(); prevStep = st ? st.step : null; }, 200);
  tick();
})();
