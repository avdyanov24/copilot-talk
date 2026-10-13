/* App: builds the world, drives the timeline from keys, syncs with the presenter window. */
(function () {
  const { master, steps, scenes, viewport } = K;
  const params = new URLSearchParams(location.search);
  const PREVIEW = params.has('preview');
  if (PREVIEW) document.body.classList.add('preview');

  function fit() {
    const sc = Math.min(innerWidth / 1920, innerHeight / 1080);
    viewport.style.transform = `scale(${sc}) translate(-50%,-50%)`;
  }
  addEventListener('resize', fit); fit();

  let cur = 0;           // step we are at / heading to
  let black = false;
  let visIdx = -1;

  function indexAt(time) {
    let i = 0;
    while (i + 1 < steps.length && steps[i + 1].time <= time + 1e-4) i++;
    return i;
  }
  // Only scenes near the playhead are painted
  function updateVisibility() {
    const i = indexAt(master.time());
    if (i === visIdx) return;
    visIdx = i;
    const on = new Set();
    for (let j = Math.max(0, i - 1); j <= Math.min(steps.length - 1, i + 1); j++) {
      on.add(steps[j].scene); steps[j].keep.forEach(k => on.add(k));
    }
    const all = ['qa', 'thanks'].includes(steps[Math.min(steps.length - 1, i + 1)].id) || ['qa', 'thanks'].includes(steps[i].id);
    for (const id in scenes) scenes[id].root.classList.toggle('off', !(all || on.has(id)));
  }

  let tween = null;
  function go(i, animate = true) {
    i = Math.max(0, Math.min(steps.length - 1, i));
    const target = steps[i].time;
    if (tween) tween.kill();
    if (!animate) { master.pause(); master.seek(target, false); updateVisibility(); }
    else {
      const dist = Math.abs(target - master.time());
      const away = Math.abs(i - indexAt(master.time()));
      const back = target < master.time();
      let dur = dist / (back ? 1.15 : 1);           // reverse plays the same motion, a touch quicker
      if (away > 1) dur = Math.min(dur, 0.9 + away * 0.35);
      tween = master.tweenTo(target, { duration: Math.max(0.01, dur), ease: 'none' });
    }
    cur = i;
    if (!PREVIEW) {
      try { history.replaceState(null, '', '#' + i); } catch (e) {}
      try { localStorage.setItem('motion-talk-step', String(i)); } catch (e) {}
      broadcast();
    }
  }
  master.eventCallback('onUpdate', updateVisibility);

  /* ---------- sync with presenter ---------- */
  let pres = null;
  let bc = null;
  try { bc = new BroadcastChannel('motion-talk'); } catch (e) {}
  const seen = [];
  const WID = Math.random().toString(36).slice(2);   // identifies this window, so a presenter ignores other open copies
  function state() { return { type: 'state', wid: WID, step: cur, total: steps.length, black, steps: steps.map(s => ({ id: s.id, section: s.section, beat: s.beat })) }; }
  function broadcast() {
    const m = state();
    try { pres && !pres.closed && pres.postMessage(m, '*'); } catch (e) {}
    try { bc && bc.postMessage(m); } catch (e) {}
  }
  let pending = null;
  function handle(m) {
    if (!m || typeof m !== 'object') return;
    if (!window.__ready) { if (m.type === 'preview') pending = m; return; }
    if (PREVIEW) { if (m.type === 'preview') go(m.step, !!m.animate); return; }
    if (m.nonce) { if (seen.includes(m.nonce)) return; seen.push(m.nonce); if (seen.length > 50) seen.shift(); }
    if (m.type === 'hello') broadcast();
    if (m.type === 'cmd') {
      if (m.to && m.to !== WID) return;
      if (m.cmd === 'next') go(cur + 1);
      if (m.cmd === 'prev') go(cur - 1);
      if (m.cmd === 'goto') go(m.step, false);
      if (m.cmd === 'black') toggleBlack();
    }
  }
  addEventListener('message', e => handle(e.data));
  if (bc) bc.onmessage = e => handle(e.data);

  function toggleBlack() { black = !black; document.getElementById('black').classList.toggle('on', black); broadcast(); }
  function openPresenter() {
    pres = window.open('presenter.html', 'motion-talk-presenter', 'width=1500,height=900');
    setTimeout(broadcast, 800);
  }

  /* ---------- keys ---------- */
  const hint = document.getElementById('hint');
  if (!PREVIEW) addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key, c = e.code;
    let used = true;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) go(cur + 1);
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) go(cur - 1);
    else if (k === 'Home') go(0, false);
    else if (k === 'End') go(steps.length - 1, false);
    else if (c === 'KeyB' || k === 'b' || k === 'B' || k === '.') toggleBlack();
    else if (c === 'KeyF' || k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
    else if (c === 'KeyP' || k === 'p' || k === 'P') openPresenter();
    else used = false;
    if (used) { e.preventDefault(); hint.classList.add('off'); }
  });

  // Touch: tap the right side for next, the left side for back
  if (!PREVIEW) addEventListener('pointerup', e => {
    if (e.pointerType !== 'touch') return;
    go(e.clientX > innerWidth * 0.35 ? cur + 1 : cur - 1);
    hint.classList.add('off');
  });

  /* ---------- boot ---------- */
  document.fonts.ready.then(() => {
    K.buildAll();
    K.imgs.forEach(i => i.decode && i.decode().catch(() => {}));   // decode images up front so they don't hitch mid-animation
    if (K.intro) K.intro.progress(1);      // intro 'from' tweens must not leak into the recorded start values
    master.progress(1).progress(0);       // initialise every tween in order, then rewind
    updateVisibility();
    let start = 0;
    const hash = parseInt(location.hash.slice(1), 10);
    if (!isNaN(hash)) start = hash;
    else if (!PREVIEW && params.has('resume')) start = parseInt(localStorage.getItem('motion-talk-step') || '0', 10) || 0;
    if (params.has('step')) start = parseInt(params.get('step'), 10) || 0;
    go(start, false);
    if (start === 0 && K.intro && !PREVIEW) K.intro.play(0);
    setTimeout(() => hint.classList.add('off'), 6000);
    window.__ready = true;
    if (PREVIEW) { if (pending) handle(pending); parent.postMessage({ type: 'preview-ready' }, '*'); }
  });

  window.TALKAPP = { go, get cur() { return cur; }, steps };
})();
