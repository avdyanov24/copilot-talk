/* Title → Кой съм → Какво е AI → Видове AI */
K.def(function () {
  const { h, s, svgBox, scene, step, camTo, center, maskWords, rise, splitChars, type, railTo, railStart, actors } = K;
  const X = 2400;

  // deterministic random
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  /* =================== TITLE =================== */
  const T = scene('title', 0, 0, 'title');
  const tLabel = T.add(h('div.label', { x: 160, y: 190, text: 'ICT Strypes · проектни мениджъри' }));
  const tLines = ['Copilot в', 'Microsoft 365'].map((txt, i) =>
    T.add(h('div.hero.nowrap', { x: 150, y: 290 + i * 150, text: txt })));
  const tSub = T.add(h('div.h3', { x: 160, y: 640, html: 'от данни <span class="acc">до проектен отчет</span>' }));
  const tChars = tLines.map(l => { const c = splitChars(l, false); c.forEach(x => x.classList.add('chb')); return c; }).flat();
  const tSubWords = maskWords(tSub, false);
  railStart(T);

  // intro (plays once on load, not part of the step timeline)
  const intro = gsap.timeline({ paused: true });
  intro.from(tChars, { yPercent: 110, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.025 }, 0.2)
    .from(tSubWords, { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.06 }, 0.7)
    .from(tLabel, { opacity: 0, y: 20, duration: 1, ease: 'expo.out' }, 0.9)
    .from(K.railSvg.querySelector('path'), { drawSVG: '0%', duration: 2.2, ease: 'expo.inOut' }, 0);
  K.intro = intro;
  step(T, 'title', 'Заглавие. Стои, докато хората влизат.');

  /* =================== WHO AM I =================== */
  const A = scene('whoami', X, 0, 'whoami');
  const name = A.add(h('div.hero', { x: 150, y: 190, text: 'Александър Дянов', style: { fontSize: '122px' } }));
  const nameW = maskWords(name);
  const chipTexts = ['Национален шампион по Excel · 2019', '11-то място · Световно първенство MOS 2026 · Анахайм', 'Ученик · CodingBurgas'];
  const chips = chipTexts.map((t, i) => {
    const c = A.add(h('div.pill', { x: 160, y: 400 + i * 104, style: { fontSize: '34px', padding: '12px 30px 12px 16px', gap: '16px' } },
      K.icon(['trophy', 'globe_showing_europe-africa', 'graduation_cap'][i], 48),
      h('span', t)));
    gsap.set(c, { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(c.lastChild, { opacity: 0, x: -20 });
    return c;
  });
  const trophy = A.add(K.img('trophy', 1450, 650, 150, { from: 18 }));
  // photo (assets/photo.jpg, cropped from the Pearson stage picture)
  const photo = A.add(h('div', { x: 1360, y: 110, w: 380, h: 470, style: { borderRadius: '28px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(23,17,31,.22)', background: '#ddd' } },
    (() => { const i = document.createElement('img'); i.src = 'assets/photo.jpg'; i.alt = 'Александър Дянов'; i.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:50% 20%;display:block'; return i; })()));
  gsap.set(photo, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' });
  // route of the talk
  const routeY = 820;
  const routeSvg = A.add(svgBox(0, 0, 1920, 1080));
  const routeLine = s('path', { d: `M 170 ${routeY} L 1750 ${routeY}`, stroke: 'rgba(23,17,31,.28)', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '2 12', 'stroke-linecap': 'round' });
  routeSvg.append(routeLine);
  gsap.set(routeLine, { drawSVG: '0%' });
  const stops = ['Какво е AI', 'Copilot', 'Excel', 'PowerPoint', 'Бърнъп отчет'];
  const stopEls = stops.map((t, i) => {
    const x = 260 + i * 350;
    const d = A.add(h('div.dot', { x, y: routeY, style: { background: i === 4 ? 'var(--acc)' : 'var(--ink)' } }));
    const l = A.add(h('div.small.center', { x: x - 200, y: routeY - 78, w: 400, text: t, style: { fontWeight: 700, color: i === 4 ? 'var(--acc-ink)' : 'var(--ink2)', whiteSpace: 'nowrap' } }));
    gsap.set(d, { scale: 0 }); gsap.set(l, { opacity: 0, y: 20 });
    return [d, l];
  });

  // 40 dots (actors) that travel: chips → AI scatter → AI types clusters → Copilot core
  const N = 40;
  const dots = [];
  for (let i = 0; i < N; i++) {
    const d = h('div.dot'); actors.append(d);
    const ci = i % 3;
    const cx = A.x + 186 + rnd() * [560, 860, 360][ci];
    const cy = A.y + 400 + ci * 104 + 38 + (rnd() - 0.5) * 30;
    gsap.set(d, { x: cx, y: cy, scale: 0, left: 0, top: 0 });
    dots.push(d);
  }

  step(A, 'whoami-name', 'Името.', t => {
    // title letters collapse into the rail head and the camera travels
    const hx = 130, hy = 1000;
    tChars.forEach((c, i) => {
      const px = c.offsetLeft + c.offsetWidth / 2 + c.parentElement.offsetLeft;
      const py = c.offsetTop + c.offsetHeight / 2 + c.parentElement.offsetTop;
      t.to(c, { x: hx - px + 40, y: hy - py - 20, scale: 0.05, opacity: 0, duration: 1.0, ease: 'power3.in' }, 0.015 * (tChars.length - i));
    });
    t.to([tLabel, tSub], { y: 300, scale: 0.4, opacity: 0, duration: 0.9, ease: 'power3.in', transformOrigin: '0% 100%' }, 0);
    camTo(t, center(A), 0.7, { dur: 2.2, dip: 0.82, tilt: -1.2 });
    railTo(t, A, 0.7, 2.2);
    rise(t, nameW, 1.6, { dur: 1.2 });
    K.pop(t, trophy, 1.9, { dur: 1.4 });
    t.to(photo, { opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out' }, 1.9);
  });

  step(A, 'whoami-chips', 'Три факта за мен.', t => {
    chips.forEach((c, i) => {
      t.to(c, { scaleX: 1, duration: 1.0, ease: 'expo.out' }, i * 0.28);
      t.to(c.lastChild, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, i * 0.28 + 0.25);
    });
  });

  step(A, 'whoami-route', 'Маршрутът: от AI до бърнъп отчет.', t => {
    t.to(routeLine, { drawSVG: '100%', duration: 1.8, ease: 'expo.inOut' }, 0);
    stopEls.forEach(([d, l], i) => {
      t.to(d, { scale: 1, duration: 0.7, ease: 'back.out(3)' }, 0.25 + i * 0.28);
      t.to(l, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.3 + i * 0.28);
    });
  });

  /* =================== WHAT IS AI =================== */
  const B = scene('ai', X * 2, 0, 'ai');
  // left: program
  const bL1 = B.add(h('div.label', { x: 160, y: 170, text: 'Програма' }));
  const bL2 = B.add(h('div.h3', { x: 160, y: 215, w: 720, text: 'Следва правила, написани от човек' }));
  const rules = B.add(h('div.card.mono', { x: 160, y: 400, w: 720, style: { padding: '34px 40px', fontSize: '31px', lineHeight: '1.75' } }));
  const ruleLines = ['<span class="acc">АКО</span> часове > 45', '<span class="acc">ТОГАВА</span> оцвети в червено', '<span class="acc">ИНАЧЕ</span> остави'].map(t => {
    const l = h('div', { html: t }); rules.append(l); return l;
  });
  gsap.set(rules, { scaleY: 0, transformOrigin: '50% 0%' });
  gsap.set(ruleLines, { opacity: 0, x: -30 });
  const outArrow = B.add(h('div.body', { x: 160, y: 720, html: '→ <b>резултат</b> <span class="dim">(винаги един и същ)</span>' }));
  gsap.set(outArrow, { opacity: 0, x: -30 });
  const bLW = [...maskWords(bL2)];
  const scrollImg = B.add(K.img('scroll', 150, 64, 96));
  gsap.set(bL1, { opacity: 0 });

  // right: AI learns from examples
  const bR1 = B.add(h('div.label', { x: 1040, y: 170, text: 'AI' }));
  const bR2 = B.add(h('div.h3', { x: 1040, y: 215, w: 740, text: 'Учи правилата сам от много примери' }));
  const bRW = maskWords(bR2);
  const brainImg = B.add(K.img('brain', 1030, 64, 96, { from: 16 }));
  gsap.set(bR1, { opacity: 0 });
  const plotX = 1060, plotW = 640, plotY = 420, plotH = 400;
  const fx = u => plotY + plotH - plotH * 0.92 * (1 - Math.exp(-2.6 * u)) / (1 - Math.exp(-2.6));
  const scatter = dots.map((d, i) => {
    const u = (i + 0.5) / N;
    return { x: B.x + plotX + u * plotW + (rnd() - 0.5) * 18, y: B.y + fx(u) + (rnd() - 0.5) * 70 };
  });
  const plot = B.add(svgBox(0, 0, 1920, 1080));
  const axes = s('path.axis', { d: `M ${plotX - 20} ${plotY - 20} L ${plotX - 20} ${plotY + plotH + 20} L ${plotX + plotW + 90} ${plotY + plotH + 20}` });
  let cd = `M ${plotX} ${fx(0)}`;
  for (let k = 1; k <= 40; k++) { const u = k / 40; cd += ` L ${plotX + u * plotW} ${fx(u)}`; }
  const curve = s('path', { d: cd, stroke: K.C.ink, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' });
  const u2 = 1.13;
  const ext = s('path', { d: `M ${plotX + plotW} ${fx(1)} Q ${plotX + plotW * 1.07} ${fx(1.07)} ${plotX + plotW * u2} ${fx(u2)}`, stroke: K.C.ink, 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '3 12', 'stroke-linecap': 'round' });
  const ghost = s('circle', { cx: plotX + plotW * u2, cy: fx(u2), r: 16, fill: 'none', stroke: K.C.acc, 'stroke-width': 5 });
  plot.append(axes, curve, ext, ghost);
  gsap.set([axes, curve], { drawSVG: '0%' });
  gsap.set(ext, { opacity: 0 });
  gsap.set(ghost, { scale: 0, transformOrigin: '50% 50%' });
  const curveLbl = B.add(h('div.small', { x: plotX + 250, y: plotY + 20, html: '<b>закономерност</b>', style: { color: 'var(--ink)' } }));
  const ghostLbl = B.add(h('div.small', { x: plotX + plotW * u2 - 250, y: fx(u2) - 95, html: '<b class="acc">предвижда</b> следващото', style: { whiteSpace: 'nowrap' } }));
  gsap.set([curveLbl, ghostLbl], { opacity: 0, y: 16 });

  step(B, 'ai-split', 'Програма срещу AI.', t => {
    camTo(t, center(B), 0, { dur: 2.2, dip: 0.85, tilt: 1 });
    railTo(t, B, 0, 2.2);
    // chips break into dots that fly into the scatter plot
    chips.forEach((c, i) => t.to(c, { scaleX: 0, duration: 0.6, ease: 'power3.in' }, i * 0.08));
    t.to(nameW, { yPercent: -115, duration: 0.7, ease: 'power3.in', stagger: 0.03 }, 0);
    dots.forEach((d, i) => {
      t.to(d, { scale: 1, duration: 0.25, ease: 'power2.out' }, 0.35 + (i % 3) * 0.08);
      t.to(d, { x: scatter[i].x, y: scatter[i].y, duration: 1.8, ease: 'expo.inOut' }, 0.5 + rnd() * 0.3);
    });
    t.to([trophy], { scale: 0.2, rotation: 40, opacity: 0, y: 80, duration: 0.7, ease: 'power3.in' }, 0);
    t.to([bL1, bR1], { opacity: 1, duration: 0.8 }, 1.1);
    rise(t, bLW, 1.0); rise(t, bRW, 1.2);
    K.pop(t, scrollImg, 1.1); K.pop(t, brainImg, 1.3);
    t.to(rules, { scaleY: 1, duration: 0.9, ease: 'expo.out' }, 1.6);
    t.to(ruleLines, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out', stagger: 0.18 }, 1.9);
    t.to(outArrow, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, 2.5);
    t.to(axes, { drawSVG: '100%', duration: 1.4, ease: 'expo.inOut' }, 1.0);
  });

  step(B, 'ai-fit', 'AI открива закономерността и предвижда.', t => {
    t.to(curve, { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut' }, 0);
    t.to(curveLbl, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.9);
    t.to(ext, { opacity: 1, duration: 0.6 }, 1.5);
    t.to(ghost, { scale: 1, duration: 0.8, ease: 'back.out(3)' }, 1.8);
    t.to(ghostLbl, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 2.0);
  });

  // upper area: language model predicts the next word — confidently
  const UY = -1050;
  const lmLabel = B.add(h('div.label', { x: 160, y: UY + 150, text: 'Езиков модел · предвижда следващата дума' }));
  const sentence = B.add(h('div.h2.nowrap', { x: 160, y: UY + 230, text: 'Бюджетът на проект Гама е' }));
  const blankX = 160 + sentence.offsetWidth + 22;
  const blank = B.add(h('div', { x: blankX, y: UY + 230 + 66, w: 380, h: 6, style: { background: 'var(--acc)', borderRadius: '3px' } }));
  const sentW = maskWords(sentence);
  gsap.set(blank, { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set(lmLabel, { opacity: 0 });
  const cands = [['в рамките', 58], ['надхвърлен', 31], ['приключен', 11]];
  const candRows = cands.map(([w, p], i) => {
    const y = UY + 420 + i * 110;
    const word = B.add(h('div.h3', { x: 160, y, w: 380, text: w }));
    const bar = B.add(h('div', { x: 560, y: y + 12, h: 44, w: p * 10, style: { background: i === 0 ? 'var(--acc)' : 'rgba(23,17,31,.3)', borderRadius: '10px' } }));
    const pct = B.add(h('div.h3', { x: 560 + p * 10 + 24, y, text: '0%', style: { color: i === 0 ? 'var(--acc-ink)' : 'var(--ink2)' } }));
    gsap.set(word, { opacity: 0, x: -30 }); gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(pct, { opacity: 0 });
    return { word, bar, pct, p };
  });

  step(B, 'ai-lm', 'Езиковият модел предвижда текст.', t => {
    camTo(t, center(B, 0, UY), 0, { dur: 1.8 });
    t.to(lmLabel, { opacity: 1, duration: 0.8 }, 0.9);
    rise(t, sentW, 0.9);
    t.to(blank, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, 1.4);
    candRows.forEach((c, i) => {
      t.to(c.word, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, 1.8 + i * 0.15);
      t.to(c.bar, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 2.0 + i * 0.15);
      t.to(c.pct, { opacity: 1, duration: 0.4 }, 2.0 + i * 0.15);
      K.count(t, c.pct, 0, c.p, 2.0 + i * 0.15, { fmt: v => Math.round(v) + '%', dur: 1.2 });
    });
    // winner flies into the blank
    const w0 = candRows[0].word;
    t.to(w0, { x: blankX - 160, y: (UY + 230) - (UY + 420) - 2, scale: 72 / 48, color: K.C.accInk, transformOrigin: '0% 0%', duration: 1.2, ease: 'expo.inOut' }, 3.3);
  });

  const factCard = B.add(h('div.card', { x: 1300, y: UY + 420, w: 500, style: { padding: '30px 36px' } },
    h('div.label', { text: 'Проверка в Excel' }),
    h('div.h3.nowrap', { style: { marginTop: '10px', fontSize: '42px' }, html: '1 660 ч от 1 480 ч' }),
    h('div.body.acc', { style: { marginTop: '6px', fontWeight: 700 }, text: '→ надхвърлен' })));
  gsap.set(factCard, { opacity: 0, y: 40, rotation: 2 });
  const strike = B.add(h('div', { x: blankX - 6, y: UY + 268, w: 440, h: 7, style: { background: 'var(--ink)', borderRadius: '4px' } }));
  gsap.set(strike, { scaleX: 0, transformOrigin: '0% 50%' });
  const takeaway = B.add(h('div.h2', { x: 160, y: UY + 800, html: 'AI предвижда, не „знае“. <span class="acc">Затова проверяваме.</span>' }));
  const takeW = maskWords(takeaway);

  step(B, 'ai-check', 'Звучи уверено, но е грешно → проверяваме.', t => {
    t.to(factCard, { opacity: 1, y: 0, rotation: 0, duration: 1.0, ease: 'expo.out' }, 0);
    t.to(strike, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 0.8);
    t.to(candRows[0].word, { opacity: 0.35, duration: 0.6 }, 0.9);
    rise(t, takeW, 1.2, { stagger: 0.06 });
  });

  /* =================== TYPES OF AI =================== */
  const C = scene('types', X * 3, 0, 'types');
  const cols = [400, 960, 1520];
  const colTitles = ['Предсказващ', 'Генеративен', 'Агентен'];
  const colDescs = ['Прогнози и класификация: спам филтър, прогноза на продажби',
    'Създава текст, таблици, изображения, код',
    'Изпълнява задачи в няколко стъпки директно в приложенията'];
  const typeImgs = [['crystal_ball', 400], ['writing_hand', 960], ['robot', 1520]].map(([n, cx], i) => C.add(K.img(n, cx - 60, 130, 120, { from: i % 2 ? 16 : -16 })));
  const colEls = cols.map((cx, i) => {
    const title = C.add(h('div.h3.center', { x: cx - 260, y: 640, w: 520, text: colTitles[i] }));
    const desc = C.add(h('div.small.center.dim', { x: cx - 250, y: 715, w: 500, text: colDescs[i] }));
    const tw = maskWords(title); gsap.set(desc, { opacity: 0, y: 20 });
    return { title, tw, desc };
  });
  // dot allocation: 12 predictive, 24 generative, 4 agentic
  const groups = { pred: dots.slice(0, 12), gen: dots.slice(12, 36), agent: dots.slice(36, 40) };
  const cloud = (cx, i, n) => { const a = i / n * Math.PI * 2 + rnd(); const r = 40 + rnd() * 110; return { x: C.x + cx + Math.cos(a) * r, y: C.y + 420 + Math.sin(a) * r * 0.8 }; };
  const predPos = groups.pred.map((d, i) => ({ x: C.x + 400 - 180 + i * 30, y: C.y + 520 - i * 17 - (rnd() - 0.5) * 50 }));
  const genRows = [7, 7, 6, 4];
  const genPos = []; genRows.forEach((n, r) => { for (let k = 0; k < n; k++) genPos.push({ x: C.x + 960 - 150 + k * 50, y: C.y + 330 + r * 60 }); });
  const agPos = [[1360, 480], [1470, 350], [1580, 480], [1690, 350]].map(([x, y]) => ({ x: C.x + x - 30, y: C.y + y }));
  const typeSvg = C.add(svgBox(0, 0, 1920, 1080));
  const trend = s('path', { d: `M ${400 - 200} ${540} L ${400 + 190} ${320}`, stroke: K.C.acc, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' });
  const trendHead = s('path', { d: `M ${400 + 160} ${316} L ${400 + 192} ${319} L ${400 + 178} ${347}`, stroke: K.C.acc, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const chainD = agPos.map((p, i) => `${i ? 'L' : 'M'} ${p.x - C.x} ${p.y - C.y}`).join(' ');
  const chain = s('path', { d: chainD, stroke: 'rgba(23,17,31,.5)', 'stroke-width': 4, fill: 'none' });
  typeSvg.append(trend, trendHead, chain);
  gsap.set([trend, trendHead, chain], { drawSVG: '0%' });
  const checks = agPos.map(p => { const c = C.add(h('div', { x: p.x - C.x - 9, y: p.y - C.y - 16, text: '✓', style: { fontSize: '24px', fontWeight: 800, color: K.C.ink } })); gsap.set(c, { scale: 0 }); return c; });
  const bracket = C.add(h('div', { x: 700, y: 860, w: 1080, h: 26, style: { borderLeft: '3px solid var(--acc)', borderRight: '3px solid var(--acc)', borderBottom: '3px solid var(--acc)', borderRadius: '0 0 14px 14px' } }));
  const bracketL = C.add(h('div.body', { x: 700, y: 900, w: 1080, html: '<b class="acc">Copilot в Office днес</b>', style: { textAlign: 'center' } }));
  gsap.set(bracket, { scaleX: 0 }); gsap.set(bracketL, { opacity: 0, y: -10 });

  step(C, 'types-pred', 'Предсказващ.', t => {
    K.pop(t, typeImgs[0], 1.9);
    camTo(t, center(C), 0, { dur: 2.2, dip: 0.85, tilt: -1 });
    railTo(t, C, 0, 2.2);
    t.to([takeaway, factCard, sentence, lmLabel], { opacity: 0, duration: 0.5 }, 0);
    // everything drifts into three loose clouds
    groups.pred.forEach((d, i) => t.to(d, { ...cloud(400, i, 12), duration: 1.8, ease: 'expo.inOut' }, 0.2 + rnd() * 0.3));
    groups.gen.forEach((d, i) => t.to(d, { ...cloud(960, i, 24), opacity: 0.35, duration: 1.8, ease: 'expo.inOut' }, 0.2 + rnd() * 0.3));
    groups.agent.forEach((d, i) => t.to(d, { ...cloud(1520, i, 4), opacity: 0.35, duration: 1.8, ease: 'expo.inOut' }, 0.2 + rnd() * 0.3));
    groups.pred.forEach((d, i) => t.to(d, { x: predPos[i].x, y: predPos[i].y, duration: 1.2, ease: 'expo.inOut' }, 2.1 + i * 0.03));
    t.to(trend, { drawSVG: '100%', duration: 1.0, ease: 'power2.inOut' }, 2.6);
    t.to(trendHead, { drawSVG: '100%', duration: 0.4 }, 3.5);
    rise(t, colEls[0].tw, 2.3);
    t.to(colEls[0].desc, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 2.5);
  });

  step(C, 'types-gen', 'Генеративен.', t => {
    K.pop(t, typeImgs[1], 0.2);
    groups.gen.forEach((d, i) => t.to(d, { x: genPos[i].x, y: genPos[i].y, opacity: 1, duration: 1.1, ease: 'expo.inOut' }, i * 0.04));
    rise(t, colEls[1].tw, 0.6);
    t.to(colEls[1].desc, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.8);
  });

  step(C, 'types-agent', 'Агентен.', t => {
    K.pop(t, typeImgs[2], 0.2);
    groups.agent.forEach((d, i) => {
      t.to(d, { x: agPos[i].x, y: agPos[i].y, opacity: 1, scale: 2.6, duration: 1.0, ease: 'expo.inOut' }, i * 0.1);
    });
    t.to(chain, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut' }, 0.8);
    checks.forEach((c, i) => t.to(c, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 1.0 + i * 0.3));
    rise(t, colEls[2].tw, 0.5);
    t.to(colEls[2].desc, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.7);
  });

  step(C, 'types-office', 'Copilot днес: генеративен + агентен.', t => {
    t.to(typeImgs[0], { opacity: 0.3, scale: 0.85, duration: 0.8 }, 0);
    t.to(groups.pred, { opacity: 0.25, duration: 0.8 }, 0);
    t.to([trend, trendHead], { opacity: 0.25, duration: 0.8 }, 0);
    t.to([colEls[0].title, colEls[0].desc], { opacity: 0.3, duration: 0.8 }, 0);
    t.to(bracket, { scaleX: 1, duration: 1.0, ease: 'expo.out' }, 0.3);
    t.to(bracketL, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.7);
  });

  K.intro_ = { dots, groups, checks, chain, colEls, bracket, bracketL, typeImgs, typesScene: C };
});
