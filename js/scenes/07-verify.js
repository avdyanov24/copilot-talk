/* 6.9 Verify → the main line → 7 Questions (the whole world as a map) */
K.def(function () {
  const { h, s, svgBox, scene, step, camTo, center, maskWords, rise, railTo, count } = K;

  /* =================== VERIFY =================== */
  const V = scene('verify', 0, 6400, 'verify');
  const vTitle = V.add(h('div.h2', { x: 160, y: 100, text: 'Преди отчетът да отиде при клиента' }));
  const vTitleW = maskWords(vTitle);
  const glass = V.add(K.img('magnifying_glass_tilted_left', 1580, 40, 170, { from: -30 }));
  const items = ['Сверете 2–3 реда на ръка', 'Контролна сума: остатък + изразходвано = бюджет', '„Обясни формулата стъпка по стъпка“', '„Какво промени в този файл днес?“', 'Числата в PowerPoint срещу Excel', 'Здрав разум: има ли смисъл резултатът?'];
  const rows = items.map((txt, i) => {
    const r = V.add(h('div', { x: 160, y: 250 + i * 104, w: 900, style: { display: 'flex', alignItems: 'center', gap: '24px' } }));
    const box = h('div', { text: '✓', style: { flex: 'none', width: '56px', height: '56px', borderRadius: '14px', border: '3px solid var(--line2)', display: 'grid', placeItems: 'center', fontSize: '32px', fontWeight: 800, color: 'rgba(23,17,31,0)' } });
    const tx = h('div', { text: txt, style: { fontSize: '33px', fontWeight: 600, letterSpacing: '-0.01em' } });
    r.append(box, tx);
    gsap.set(r, { opacity: 0, x: -40 });
    return { r, box, tx };
  });
  const tick = (t, i, at) => {
    t.to(rows[i].box, { backgroundColor: K.C.acc, borderColor: K.C.acc, color: K.C.ink, duration: 0.3 }, at);
    t.fromTo(rows[i].box, { scale: 1.3 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', immediateRender: false }, at + 0.1);
  };
  const sum = V.add(h('div.card', { x: 1140, y: 250, w: 620, style: { padding: '30px 36px' } }));
  sum.append(h('div.label', { text: 'Проект Гама · контролна сума' }));
  const sumRows = [['Остатък', -180, ''], ['Изразходвано', 1660, '+'], ['Бюджет', 1480, '=']].map(([a, v, op], i) => {
    const r = h('div', { style: { display: 'grid', gridTemplateColumns: '44px 1fr auto', alignItems: 'baseline', padding: '14px 0', borderTop: i === 2 ? '3px solid var(--ink)' : 'none', marginTop: i === 2 ? '8px' : 0 } },
      h('div', { text: op, style: { fontSize: '40px', fontWeight: 800, color: 'var(--acc-ink)' } }),
      h('div', { text: a, style: { fontSize: '30px', fontWeight: 600, color: 'var(--ink2)' } }),
      h('div', { text: '0 ч', style: { fontSize: '50px', fontWeight: 800, letterSpacing: '-0.03em' } }));
    sum.append(r); gsap.set(r, { opacity: 0, y: 20 });
    return { r, v: r.lastChild, val: v };
  });
  const okStamp = h('div', { text: '✓', style: { position: 'absolute', right: '30px', top: '20px', width: '70px', height: '70px', borderRadius: '50%', background: 'var(--acc)', color: K.C.ink, fontSize: '42px', fontWeight: 800, display: 'grid', placeItems: 'center' } });
  sum.append(okStamp); gsap.set(okStamp, { scale: 0, rotation: -40 });
  gsap.set(sum, { opacity: 0, y: 40 });
  const sense = V.add(h('div.card', { x: 1140, y: 700, w: 620, style: { padding: '28px 34px', borderColor: 'rgba(250,157,19,.6)' } },
    h('div', { html: 'Гама излиза на <b class="acc">~134%</b>.', style: { fontSize: '36px', fontWeight: 800 } }),
    h('div.dim', { text: 'Има ли смисъл спрямо часовете, които виждаме?', style: { fontSize: '28px', fontWeight: 500, marginTop: '8px' } })));
  gsap.set(sense, { opacity: 0, y: 40 });

  step(V, 'verify-list', 'Проверка: шест навика.', t => {
    K.pop(t, glass, 1.5, { dur: 1.3 });
    camTo(t, center(V), 0, { dur: 2.2, dip: 0.82, tilt: -1 });
    railTo(t, V, 0, 2.2);
    rise(t, vTitleW, 0.9);
    rows.forEach(({ r }, i) => t.to(r, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, 1.2 + i * 0.1));
  });
  step(V, 'verify-sum', 'Сверяваме на ръка + контролна сума.', t => {
    tick(t, 0, 0);
    t.to(sum, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.3);
    sumRows.forEach((r, i) => {
      t.to(r.r, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.6 + i * 0.35);
      count(t, r.v, 0, r.val, 0.6 + i * 0.35, { dur: 1.0, fmt: v => (v < 0 ? '−' : '') + K.fmtEUR(Math.abs(v)) + ' ч' });
    });
    t.to(okStamp, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(3)' }, 2.0);
    tick(t, 1, 2.0);
  });
  step(V, 'verify-ask', 'Питаме го. Сверяваме PowerPoint с Excel.', t => {
    [2, 3, 4].forEach((i, k) => tick(t, i, k * 0.45));
  });
  step(V, 'verify-sense', 'Здрав разум.', t => {
    tick(t, 5, 0);
    t.to(sense, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.2);
  });

  // the main line, below the checklist
  const MY = 1250;
  const lines = [['Copilot прави', 0, 'var(--ink2)'], ['ние проверяваме', 330, 'var(--ink)'], ['ние решаваме', 660, 'var(--acc)']].map(([tx, x, c], i) => {
    const e = V.add(h('div.h1.nowrap', { x: 260 + x, y: MY + i * 140, text: tx, style: { color: c, fontSize: '112px' } }));
    return maskWords(e);
  });
  const mSvg = V.add(svgBox(0, 0, 1920, 1080));
  const thread = s('path', { d: `M 130 1000 C 130 1150, 150 ${MY + 60}, 225 ${MY + 60} M 225 ${MY + 60} L 225 ${MY + 60}`, stroke: K.C.acc, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' });
  const stair = s('path', { d: `M 200 ${MY + 70} L 200 ${MY + 200} L 500 ${MY + 200} M 500 ${MY + 210} L 500 ${MY + 340} L 830 ${MY + 340}`, stroke: K.C.acc, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  mSvg.append(thread, stair);
  gsap.set([thread, stair], { drawSVG: '0%' });

  step(V, 'main-line', 'Copilot прави → ние проверяваме → ние решаваме.', t => {
    camTo(t, { x: V.cx + 60, y: V.cy + MY - 250 + 140 }, 0, { dur: 2.0 });
    t.to(thread, { drawSVG: '100%', duration: 1.4, ease: 'power2.inOut' }, 0.2);
    rise(t, lines[0], 1.3, { dur: 1.2 });
    t.to(stair, { drawSVG: '50%', duration: 0.8, ease: 'power2.inOut' }, 2.0);
    rise(t, lines[1], 2.5, { dur: 1.2 });
    t.to(stair, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, 3.2);
    rise(t, lines[2], 3.7, { dur: 1.2 });
  });

  /* =================== QUESTIONS: the whole world =================== */
  const Q = scene('qa', 2400, 6400, 'qa');
  const ov = document.getElementById('overlay');
  const scrim = h('div', { x: 0, y: 0, w: 1920, h: 1080, style: { background: 'radial-gradient(ellipse 48% 42% at 50% 50%, rgba(246,244,248,.95) 0%, rgba(246,244,248,.75) 55%, rgba(246,244,248,0) 100%)' } });
  const qaT = h('div.hero', { x: 0, y: 400, w: 1920, text: 'Въпроси?', style: { textAlign: 'center', fontSize: '190px' } });
  const qaS = h('div.body', { x: 0, y: 640, w: 1920, html: 'Александър Дянов · <span class="acc">Copilot в Microsoft 365</span>', style: { textAlign: 'center', color: 'var(--ink2)' } });
  const thT = h('div.hero', { x: 0, y: 380, w: 1920, text: 'Благодаря за вниманието!', style: { textAlign: 'center', fontSize: '130px' } });
  const thS = h('div.body', { x: 0, y: 640, w: 1920, html: 'Александър Дянов · <span class="acc">Copilot в Microsoft 365</span>', style: { textAlign: 'center', color: 'var(--ink2)' } });
  ov.append(scrim, qaT, qaS, thT, thS);
  const thW = maskWords(thT);
  gsap.set(thS, { opacity: 0, y: 20 });
  const qaW = maskWords(qaT);
  gsap.set(scrim, { opacity: 0 }); gsap.set(qaS, { opacity: 0, y: 20 });

  step(Q, 'qa', 'Въпроси. Целият път като карта.', t => {
    camTo(t, { x: 7050, y: 3450, z: 0.118 }, 0, { dur: 3.2, ease: 'expo.inOut' });
    t.to(scrim, { opacity: 1, duration: 1.2 }, 2.0);
    rise(t, qaW, 2.4, { dur: 1.3 });
    t.to(qaS, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 2.8);
  });

  const thanks = step(Q, 'thanks', 'Благодаря за вниманието!', t => {
    t.to([qaT, qaS], { opacity: 0, y: -30, duration: 0.7, ease: 'power2.in' }, 0);
    rise(t, thW, 0.7, { dur: 1.3 });
    t.to(thS, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 1.2);
  });
  thanks.section = 'thanks';
});
