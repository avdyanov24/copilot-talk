/* Core: DOM helpers, camera, and the step timeline.
   The whole talk is one paused GSAP timeline. Every step ends at a label;
   → tweens the playhead to the next label, ← tweens it back (plays in reverse). */
(function () {
  const W = 1920, H = 1080;
  const SVGNS = 'http://www.w3.org/2000/svg';
  gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, CustomEase);
  CustomEase.create('settle', 'M0,0 C0.16,0.84 0.28,1 1,1');      // fast start, long soft landing
  CustomEase.create('swoop', 'M0,0 C0.7,0 0.12,1 1,1');           // camera travel

  /* ---------- DOM helpers ---------- */
  // h('div.card.big', {x, y, w, h, style, text, html, attrs}, ...children)
  function h(spec, o, ...kids) {
    const [tag, ...cls] = spec.split('.');
    const e = document.createElement(tag || 'div');
    if (cls.length) e.className = cls.join(' ');
    apply(e, o);
    kids.flat().forEach(k => k != null && e.append(k));
    return e;
  }
  function s(spec, attrs, ...kids) {
    const [tag, ...cls] = spec.split('.');
    const e = document.createElementNS(SVGNS, tag);
    if (cls.length) e.setAttribute('class', cls.join(' '));
    for (const k in attrs || {}) {
      if (k === 'text') e.textContent = attrs[k];
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    kids.flat().forEach(k => k != null && e.append(k));
    return e;
  }
  function apply(e, o) {
    if (!o) return e;
    if (typeof o === 'string') { e.textContent = o; return e; }
    const st = e.style;
    if (o.x != null || o.y != null) { st.position = 'absolute'; st.left = (o.x || 0) + 'px'; st.top = (o.y || 0) + 'px'; }
    if (o.w != null) st.width = o.w + 'px';
    if (o.h != null) st.height = o.h + 'px';
    if (o.style) Object.assign(st, o.style);
    if (o.text != null) e.textContent = o.text;
    if (o.html != null) e.innerHTML = o.html;
    if (o.attrs) for (const k in o.attrs) e.setAttribute(k, o.attrs[k]);
    if (o.cls) e.classList.add(...o.cls.split(' '));
    return e;
  }
  // Absolute SVG canvas inside a scene
  function svgBox(x, y, w, hh, cls) {
    return s('svg' + (cls ? '.' + cls : ''), { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, style: `position:absolute;left:${x}px;top:${y}px;overflow:visible` });
  }

  /* Split text into masked words (for rising reveals) */
  function maskWords(e, hidden = true) {
    const text = e.textContent; e.textContent = '';
    const inner = [];
    text.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { e.append(document.createTextNode(' ')); return; }
      const m = h('span.mw'); const i = h('span.wi', part); m.append(i); e.append(m); inner.push(i);
    });
    if (hidden) gsap.set(inner, { yPercent: 115 });
    return inner;
  }
  function splitChars(e, hidden = true) {
    const text = e.textContent; e.textContent = '';
    const out = [];
    for (const ch of text) { const sp = h('span.ch', ch === ' ' ? ' ' : ch); e.append(sp); out.push(sp); }
    if (hidden) gsap.set(out, { opacity: 0 });
    return out;
  }
  // Type out a set of char spans (created by splitChars)
  function type(t, chars, at, cps = 38) {
    t.to(chars, { opacity: 1, duration: 0.01, stagger: 1 / cps, ease: 'none' }, at);
    return chars.length / cps;
  }
  function rise(t, words, at, o = {}) {
    t.to(words, { yPercent: 0, duration: o.dur || 1.0, ease: o.ease || 'expo.out', stagger: o.stagger ?? 0.05 }, at);
  }
  // Animated number in a text node. fmt(v) -> string
  function count(t, e, from, to, at, o = {}) {
    const p = { v: from }; const fmt = o.fmt || fmtEUR;
    e.textContent = fmt(from);
    t.to(p, { v: to, duration: o.dur || 1.2, ease: o.ease || 'power3.out', onUpdate: () => { e.textContent = fmt(p.v); } }, at);
  }
  // 83000 -> '83 000' (narrow no-break space; also for 4-digit numbers)
  function fmtEUR(v) { return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f'); }

  /* ---------- images (Microsoft Fluent 3D emoji, MIT, bundled in assets/fluent) ---------- */
  const imgs = [];
  // Absolute image, hidden until pop()
  function img(name, x, y, size, o = {}) {
    const e = document.createElement('img');
    e.src = 'assets/fluent/' + name + '.png'; e.alt = ''; e.className = 'fl';
    e.width = size; e.height = size;
    Object.assign(e.style, { position: 'absolute', left: x + 'px', top: y + 'px', width: size + 'px', height: size + 'px' });
    if (o.hidden !== false) gsap.set(e, { opacity: 0, scale: 0.4, rotation: o.from ?? -16, y: 40 });
    imgs.push(e);
    return e;
  }
  // Inline image for pills and cards
  function icon(name, size) {
    const e = document.createElement('img');
    e.src = 'assets/fluent/' + name + '.png'; e.alt = ''; e.className = 'fl-i';
    e.width = size; e.height = size;
    Object.assign(e.style, { width: size + 'px', height: size + 'px', flex: 'none' });
    imgs.push(e);
    return e;
  }
  function pop(t, e, at, o = {}) {
    t.to(e, { opacity: o.opacity ?? 1, scale: 1, rotation: o.rot ?? 0, y: 0, duration: o.dur ?? 1.1, ease: 'back.out(1.7)' }, at);
  }

  /* ---------- palette (read from the CSS tokens so there is one source of truth) ---------- */
  const rootCss = getComputedStyle(document.documentElement);
  const C = {};
  ['bg', 'card', 'card2', 'card3', 'ink', 'acc', 'acc-ink'].forEach(k => { C[k.replace(/-(\w)/g, (m, c) => c.toUpperCase())] = rootCss.getPropertyValue('--' + k).trim(); });

  /* ---------- world, camera ---------- */
  const viewport = document.getElementById('viewport');
  const world = document.getElementById('world');
  const bgNear = document.getElementById('bg-near');
  const bgFar = document.getElementById('bg-far');
  const cam = { x: W / 2, y: H / 2, z: 1, r: 0 };
  function applyCam() {
    world.style.transform = `translate(${W / 2}px,${H / 2}px) rotate(${cam.r}deg) scale(${cam.z}) translate(${-cam.x}px,${-cam.y}px)`;
    // parallax dot fields
    const zf = Math.pow(cam.z, 0.35), zn = Math.pow(cam.z, 0.6);
    bgFar.style.backgroundSize = `${46 * zf}px ${46 * zf}px`;
    bgFar.style.backgroundPosition = `${-cam.x * 0.08 * zf}px ${-cam.y * 0.08 * zf}px`;
    bgNear.style.backgroundSize = `${120 * zn}px ${120 * zn}px`;
    bgNear.style.backgroundPosition = `${-cam.x * 0.22 * zn}px ${-cam.y * 0.22 * zn}px`;
    bgNear.style.transform = `rotate(${cam.r * 0.5}deg)`;
  }
  applyCam();

  /* ---------- scenes & steps ---------- */
  const master = gsap.timeline({ paused: true });
  const scenes = {};        // id -> {id, x, y, root, section, steps:[]}
  const steps = [];         // {id, scene, beat, time}
  const plan = { cam: { ...cam } };   // camera state at the end of the last built step

  function scene(id, x, y, section) {
    const root = h('div.scene', { x, y, w: W, h: H, attrs: { 'data-scene': id } });
    world.append(root);
    const sc = { id, x, y, root, section: section || id, steps: [], cx: x + W / 2, cy: y + H / 2 };
    // local helpers
    sc.add = (...els) => { root.append(...els); return els[0]; };
    sc.rel = other => ({ x: other.x - x, y: other.y - y });   // offset of another scene in my local coords
    scenes[id] = sc;
    return sc;
  }

  // Build one step. fn(t, api) fills the sub-timeline t. Returns nothing.
  // opts: {keep:[sceneIds]} extra scenes kept visible while this step is current/adjacent
  function step(sc, id, beat, fn, opts = {}) {
    const t = gsap.timeline();
    fn && fn(t);
    if (t.duration() < 0.05) t.to({}, { duration: 0.05 });
    master.add(t, master.duration());
    const time = master.duration();
    master.addLabel('s' + steps.length, time);
    const st = { i: steps.length, id, scene: sc.id, section: sc.section, beat, time, keep: opts.keep || [] };
    steps.push(st); sc.steps.push(st.i);
    return st;
  }

  // Camera move inside a step timeline.
  // p: {x, y, z=1, r=0}; o: {dur, dip (zoom multiplier at midpoint), tilt (deg at midpoint), ease}
  function camTo(t, p, at = 0, o = {}) {
    const from = { ...plan.cam };
    const to = { x: p.x, y: p.y, z: p.z ?? 1, r: p.r ?? 0 };
    const d = o.dur ?? 2.0;
    const up = () => applyCam();
    t.to(cam, { x: to.x, y: to.y, duration: d, ease: o.ease || 'swoop', onUpdate: up }, at);
    if (o.dip) {
      const mid = Math.min(from.z, to.z) * o.dip;
      t.to(cam, { z: mid, duration: d * 0.45, ease: 'sine.inOut', onUpdate: up }, at);
      t.to(cam, { z: to.z, duration: d * 0.55, ease: 'power3.inOut', onUpdate: up }, at + d * 0.45);
    } else {
      t.to(cam, { z: to.z, duration: d, ease: o.ease || 'swoop', onUpdate: up }, at);
    }
    if (o.tilt) {
      t.to(cam, { r: o.tilt, duration: d * 0.5, ease: 'sine.inOut', onUpdate: up }, at);
      t.to(cam, { r: to.r, duration: d * 0.5, ease: 'sine.inOut', onUpdate: up }, at + d * 0.5);
    } else if (from.r !== to.r) {
      t.to(cam, { r: to.r, duration: d, ease: 'power2.inOut', onUpdate: up }, at);
    }
    plan.cam = to;
    return d;
  }
  const center = (sc, dx = 0, dy = 0, z = 1) => ({ x: sc.cx + dx, y: sc.cy + dy, z });

  window.K = { C, img, icon, pop, imgs, W, H, h, s, svgBox, apply, maskWords, splitChars, type, rise, count, fmtEUR,
    cam, applyCam, camTo, center, master, scenes, steps, scene, step, plan, world, viewport };
})();
