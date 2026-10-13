/* 6.1 Questions → 6.2 Burnup explained → 6.3 Build, Gamma, Beta → 6.4 Feedback */
K.def(function () {
  const { h, s, svgBox, scene, step, camTo, center, maskWords, rise, railTo, count, actors } = K;
  const CH = K.shared.chain;
  const G = TALK.gamma, BT = TALK.beta;

  /* =================== QUESTIONS =================== */
  const Q = scene('questions', 4800, 3200, 'questions');
  const qLabel = Q.add(h('div.label', { x: 620, y: 180, text: 'Въпросите, на които отговаря отчетът' }));
  gsap.set(qLabel, { opacity: 0 });
  const qs = ['Колко сме изразходвали?', 'Колко остава?', 'Ще стигнат ли часовете до крайния срок?', 'Какво го харчи?'].map((q, i) => {
    const e = Q.add(h('div.h3.nowrap', { x: 620, y: 240 + i * 92, html: `<span class="acc">${i + 1}</span>&nbsp;&nbsp;${q}` }));
    gsap.set(e, { opacity: 0, x: 40 });
    return e;
  });
  // the chain arrow morphs into a big question mark
  const qd = 'M 2585 330 C 2585 210, 2805 195, 2805 320 C 2805 420, 2700 420, 2700 520 L 2700 560';
  const qDot = Q.add(h('div', { x: 300 - 26, y: 640, w: 52, h: 52, style: { borderRadius: '50%', background: 'var(--acc)' } }));
  gsap.set(qDot, { scale: 0 });
  const srcs = [['Часове', 'отчетени часове'], ['Екип', 'хора и капацитет'], ['Проекти', 'бюджет в часове и срокове']].map(([a, b], i) => {
    const c = Q.add(h('div.card', { x: 620 + i * 390, y: 720, w: 360, h: 170, style: { padding: '30px 34px' } },
      h('div.label', { text: 'Таблица', style: { fontSize: '19px' } }),
      h('div', { text: a, style: { fontSize: '46px', fontWeight: 800, letterSpacing: '-0.02em' } }),
      h('div.small.dim', { text: b, style: { fontSize: '25px' } })));
    gsap.set(c, { opacity: 0, y: 40, transformOrigin: '0% 0%' });
    return c;
  });
  const qSvg = Q.add(svgBox(0, 0, 1920, 1080));
  const fans = srcs.map((c, i) => {
    const x2 = 620 + i * 390 + 180;
    const p = s('path', { d: `M 1150 620 C 1150 670, ${x2} 660, ${x2} 712`, stroke: 'rgba(23,17,31,.35)', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '2 9', 'stroke-linecap': 'round' });
    qSvg.append(p); gsap.set(p, { drawSVG: '0%' }); return p;
  });
  // layers
  const layerDefs = [['Входни данни', ''], ['Изчисления', 'Часове · Бърнъп · Прогноза'], ['Отчет', 'графика и текст']];
  const LX = [180, 800, 1330], LW = [560, 450, 450];
  const layers = layerDefs.map(([a, b], i) => {
    const e = Q.add(h('div.card', { x: LX[i], y: 700, w: LW[i], h: 200, style: { padding: '24px 30px', borderColor: i === 2 ? 'rgba(250,157,19,.6)' : 'var(--line2)', background: i === 0 ? 'transparent' : 'var(--card)' } },
      h('div', { text: a, style: { fontSize: '36px', fontWeight: 800 } }),
      h('div.small.dim', { text: b, style: { fontSize: '24px', marginTop: '4px' } })));
    gsap.set(e, { opacity: 0, scale: 0.9 });
    return e;
  });
  const layerArrows = [0, 1].map(i => { const a = Q.add(h('div.h2', { x: LX[i] + LW[i] + 6, y: 760, w: 50, text: '→', style: { color: 'var(--ink3)', textAlign: 'center' } })); gsap.set(a, { opacity: 0 }); return a; });

  step(Q, 'q-data', 'Въпроси и три таблици с данни.', t => {
    camTo(t, center(Q), 0, { dur: 2.2, dip: 0.85, tilt: -1 });
    railTo(t, Q, 0, 2.2);
    t.to([CH.row1, CH.row2], { opacity: 0, x: -40, duration: 0.5 }, 0);
    t.to(CH.aHead, { drawSVG: '0%', duration: 0.4 }, 0);
    t.to(CH.arrow, { morphSVG: qd, strokeWidth: 38, duration: 2.0, ease: 'expo.inOut' }, 0.2);
    t.to(qDot, { scale: 1, duration: 0.7, ease: 'back.out(3)' }, 2.0);
    t.to(qLabel, { opacity: 1, duration: 0.6 }, 1.8);
    qs.forEach((q, i) => t.to(q, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 1.9 + i * 0.15));
    fans.forEach((p, i) => t.to(p, { drawSVG: '100%', duration: 0.8, ease: 'power2.out' }, 3.0 + i * 0.1));
    srcs.forEach((c, i) => t.to(c, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 3.2 + i * 0.12));
  }, { keep: ['chain'] });

  step(Q, 'q-layers', 'Входни данни → изчисления → отчет.', t => {
    t.to(fans, { drawSVG: '0%', duration: 0.5 }, 0);
    srcs.forEach((c, i) => t.to(c, { x: LX[0] + 24 + i * 176 - (620 + i * 390), y: 100, scale: 0.44, duration: 1.1, ease: 'expo.inOut' }, 0.1 + i * 0.05));
    layers.forEach((l, i) => t.to(l, { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' }, 0.7 + i * 0.15));
    t.to(layerArrows, { opacity: 1, duration: 0.5, stagger: 0.15 }, 1.0);
  }, { keep: ['chain'] });

  /* =================== CHART (actor) =================== */
  const PL = 150, PT = 30, PW = 1280, PH = 540, CWD = 1460, CHT = 660;
  const X = w => PL + w / 16 * PW;
  const Y = f => PT + 30 + (1.45 - f) * (PH - 30) / 1.45;   // f = cumulative hours / budget; 1 = the budget line
  const pathOf = pts => pts.map(([w, f], i) => `${i ? 'L' : 'M'} ${X(w).toFixed(1)} ${Y(f).toFixed(1)}`).join(' ');
  const genAct = [0, .075, .16, .23, .32, .4, .48, .555, .64, .72].map((f, w) => [w, f]);
  const gamAct = [0].concat(G.cum.map(c => c / G.budget)).map((f, w) => [w, f]);
  const gamWrong = [0].concat(G.cumWrong.map(c => c / G.budget)).map((f, w) => [w, f]);
  const gamFc = (G.cum[12] + 3 * (G.cum[12] - G.cum[8]) / 4) / G.budget;
  const betAct = [0].concat(BT.cum.map(c => c / BT.budget)).map((f, w) => [w, f]);
  const betFc = (BT.cum[12] + 3 * (BT.cum[12] - BT.cum[8]) / 4) / BT.budget;
  const betCross = 13 + (1 - betAct[13][1]) / ((BT.cum[12] - BT.cum[8]) / 4 / BT.budget);
  const area = act => pathOf(act.map(([w]) => [w, w / 16])) + ' ' + act.slice().reverse().map(([w, f]) => `L ${X(w).toFixed(1)} ${Y(f).toFixed(1)}`).join(' ') + ' Z';

  const chart = h('div', { style: { position: 'absolute', left: 0, top: 0, width: CWD + 'px', height: CHT + 'px', transformOrigin: '0 0' } });
  actors.append(chart);
  const svg = s('svg', { width: CWD, height: CHT, viewBox: `0 0 ${CWD} ${CHT}`, style: 'position:absolute;left:0;top:0;overflow:visible' });
  chart.append(svg);
  const defs = s('defs');
  const clipFc = s('clipPath', { id: 'clipFc' }, s('rect', { x: 0, y: -100, width: 0, height: CHT + 200 }));
  const clipPd = s('clipPath', { id: 'clipPd' }, s('rect', { x: 0, y: -100, width: 0, height: CHT + 200 }));
  defs.append(clipFc, clipPd); svg.append(defs);
  const gridG = s('g');
  [0.5].forEach(f => gridG.append(s('line.grid', { x1: PL, x2: PL + PW, y1: Y(f), y2: Y(f) })));
  const zeroLn = s('line', { x1: PL, x2: PL + PW, y1: Y(1), y2: Y(1), stroke: 'rgba(23,17,31,.45)', 'stroke-width': 2.5 });   // the budget line
  const axisY = s('line.axis', { x1: PL, x2: PL, y1: PT, y2: PT + PH });
  const axisX = s('line.axis', { x1: PL, x2: PL + PW, y1: PT + PH, y2: PT + PH });
  const deadline = s('line', { x1: X(16), x2: X(16), y1: PT, y2: PT + PH, stroke: 'rgba(23,17,31,.3)', 'stroke-width': 2, 'stroke-dasharray': '6 8' });
  const areaP = s('path', { d: area(genAct), fill: 'rgba(250,157,19,.18)' });
  const planP = s('path.ln-plan', { d: pathOf([[0, 0], [16, 1]]) });
  const planDash = s('path.ln-plan', { d: pathOf([[0, 0], [16, 1]]), 'stroke-dasharray': '14 14', 'stroke-linecap': 'butt', 'clip-path': 'url(#clipPd)' });
  const actP = s('path.ln-act', { d: pathOf(genAct) });
  const fcP = s('path.ln-fc', { d: pathOf([[9, 0.72], [16, 1.28]]), 'clip-path': 'url(#clipFc)' });
  const todayLn = s('line', { x1: X(13), x2: X(13), y1: PT - 10, y2: PT + PH, stroke: K.C.acc, 'stroke-width': 3 });
  const zeroDot = s('circle', { cx: X(12.5), cy: Y(1), r: 14, fill: K.C.card, stroke: K.C.acc, 'stroke-width': 6 });
  svg.append(gridG, zeroLn, deadline, areaP, planP, planDash, fcP, actP, todayLn, zeroDot, axisY, axisX);
  gsap.set([planP, actP], { drawSVG: '0%' });
  gsap.set(areaP, { opacity: 0 });
  gsap.set(todayLn, { scaleY: 0, transformOrigin: '50% 0%' });
  gsap.set(zeroDot, { scale: 0, transformOrigin: '50% 50%' });
  // html labels inside the chart
  const L = (x, y, html, o = {}) => { const e = h('div', { x, y, html, style: Object.assign({ fontSize: '30px', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--ink2)' }, o) }); chart.append(e); return e; };
  const yLblsGen = [L(PL - 130, Y(1) - 18, 'бюджет', { width: '110px', textAlign: 'right' }), L(PL - 130, Y(0) - 18, '0', { width: '110px', textAlign: 'right' })];
  const xLblsGen = [L(X(0) - 40, PT + PH + 16, 'старт'), L(X(9) - 36, PT + PH + 16, 'днес', { color: K.C.accInk }), L(X(16) - 80, PT + PH + 16, 'краен срок')];
  const yLblsG = [L(PL - 150, Y(1) - 18, '1 480 ч', { width: '135px', textAlign: 'right' }), L(PL - 150, Y(0) - 18, '0 ч', { width: '135px', textAlign: 'right' })];
  const yLblsK = [L(PL - 150, Y(1) - 18, '100%', { width: '135px', textAlign: 'right', color: K.C.accInk }), L(PL - 150, Y(0) - 18, '0%', { width: '135px', textAlign: 'right', color: K.C.accInk })];
  const yLblsB = [L(PL - 150, Y(1) - 18, '900 ч', { width: '135px', textAlign: 'right' }), L(PL - 150, Y(0) - 18, '0 ч', { width: '135px', textAlign: 'right' })];
  const xLblsG = [[0, '06.07'], [4, '03.08'], [8, '31.08'], [12, '28.09'], [16, '26.10']].map(([w, d]) => L(X(w) - 34, PT + PH + 16, d));
  const lblPlan = L(X(9.6), Y(9.6 / 16) + 50, 'Планирани часове', { color: 'var(--ink)' });
  const lblAct = L(X(0.2), Y(0.50), 'Реално изработени часове', { color: K.C.accInk });
  const lblGap = L(X(1.0), Y(0.82), 'над плана → часовете се изразходват по-бързо ↘', { fontSize: '24px', color: 'var(--ink)', background: 'rgba(255,255,255,.9)', padding: '4px 10px', borderRadius: '8px' });
  const lblZero = L(X(7.0), Y(1) - 64, 'над бюджета преди крайния срок', { color: K.C.accInk });
  const lblZeroG = L(X(6.2), Y(1) - 64, 'над бюджета: седмица 21.09', { color: K.C.accInk });
  const lblFc = L(X(16) + 20, Y(1.28) - 18, 'прогноза', { color: K.C.accInk });
  const lblToday = L(X(13) - 34, PT - 52, 'днес', { color: K.C.accInk });
  const lblZeroB = L(X(9.4), Y(1) - 64, 'над бюджета: седмица ~' + Math.round(betCross), { color: K.C.accInk });
  const lblWrong = L(X(1.6), Y(1.2), 'включва нефактурирани часове?', { color: K.C.ink, background: K.C.acc, padding: '6px 16px', borderRadius: '10px', fontSize: '32px' });
  const allLbls = [...yLblsGen, ...xLblsGen, ...yLblsG, ...yLblsK, ...yLblsB, ...xLblsG, lblZeroB, lblPlan, lblAct, lblGap, lblZero, lblZeroG, lblFc, lblToday, lblWrong];
  gsap.set(allLbls, { opacity: 0 });
  gsap.set(chart, { opacity: 0 });

  /* =================== BURNUP EXPLAINED =================== */
  const B = scene('burn', 7200, 3200, 'burn');
  const CB = { x: B.x + 180, y: B.y + 300 };
  gsap.set(chart, { x: CB.x, y: CB.y });
  const kpis = ['Бюджет', 'Изразходвано', 'Остатък', 'Темп (часове на седмица)', 'Прогноза при приключване', 'Отклонение от бюджета'].map((k, i) => {
    const e = B.add(h('div.pill', { x: 0, y: i < 3 ? 110 : 190, text: k, style: { fontSize: '28px', borderColor: i === 4 ? 'var(--acc)' : 'var(--line2)', color: i === 4 ? 'var(--acc-ink)' : 'var(--ink)' } }));
    return e;
  });
  [kpis.slice(0, 3), kpis.slice(3)].forEach(row => { let x = 180; row.forEach(e => { e.style.left = x + 'px'; x += e.offsetWidth + 20; gsap.set(e, { opacity: 0, scale: 0.6 }); }); });
  const formula = B.add(h('div.card', { x: 340, y: 520, w: 640, style: { padding: '28px 32px', borderColor: 'rgba(250,157,19,.6)' } },
    h('div.label', { text: 'Прогноза при приключване' }),
    h('div', { html: 'изразходвано <span class="acc">+</span> среден седмичен брой часове <span class="acc">×</span> оставащи седмици', style: { fontSize: '33px', fontWeight: 700, lineHeight: 1.3, marginTop: '10px' } })));
  gsap.set(formula, { opacity: 0, y: 30 });

  step(B, 'burn-arrive', 'Какво да включим: показателите.', t => {
    camTo(t, center(B), 0, { dur: 2.2, dip: 0.82, tilt: 1 });
    railTo(t, B, 0, 2.2);
    // the three layer cards flatten into the chart axes
    const dx = B.x - Q.x;
    const tgt = [
      { left: dx + 180 + PL - 2, top: 300 + PT, width: 4, height: PH },
      { left: dx + 180 + PL, top: 300 + PT + PH - 2, width: PW / 2, height: 4 },
      { left: dx + 180 + PL + PW / 2, top: 300 + PT + PH - 2, width: PW / 2, height: 4 }];
    t.to(srcs, { opacity: 0, duration: 0.3 }, 0);
    t.to(layers.flatMap(l => [...l.children]), { opacity: 0, duration: 0.3 }, 0);
    t.to(layerArrows, { opacity: 0, duration: 0.3 }, 0);
    layers.forEach((l, i) => t.to(l, { ...tgt[i], padding: 0, borderRadius: 2, borderWidth: 0, backgroundColor: 'rgba(23,17,31,.3)', duration: 2.0, ease: 'expo.inOut' }, 0.1 + i * 0.06));
    t.set(layers, { opacity: 0 }, 2.25);
    t.to(chart, { opacity: 1, duration: 0.3 }, 2.1);
    t.to([...yLblsGen, ...xLblsGen], { opacity: 1, duration: 0.6, stagger: 0.06 }, 2.2);
    kpis.forEach((k, i) => t.to(k, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' }, 2.0 + i * 0.1));
  }, { keep: ['questions'] });

  step(B, 'burn-plan', 'Плановата линия.', t => {
    t.to(planP, { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut' }, 0);
    t.to(lblPlan, { opacity: 1, duration: 0.6 }, 0.6);
  });
  step(B, 'burn-actual', 'Реалната линия.', t => {
    t.to(actP, { drawSVG: '100%', duration: 1.8, ease: 'power1.inOut' }, 0);
    t.to(lblAct, { opacity: 1, duration: 0.6 }, 0.9);
  });
  step(B, 'burn-gap', 'Над плана = часовете се изразходват по-бързо.', t => {
    t.to(areaP, { opacity: 1, duration: 1.0 }, 0);
    t.to(lblGap, { opacity: 1, duration: 0.6 }, 0.4);
  });
  step(B, 'burn-zero', 'Над бюджета преди крайния срок → няма да стигне.', t => {
    t.to(clipFc.firstChild, { attr: { width: X(16) + 20 }, duration: 1.6, ease: 'power1.inOut' }, 0);
    t.to(zeroDot, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, 0.9);
    t.to(lblZero, { opacity: 1, duration: 0.6 }, 1.1);
    t.to(lblFc, { opacity: 1, duration: 0.6 }, 1.5);
  });
  step(B, 'burn-formula', 'Прогноза при приключване.', t => {
    t.to(formula, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 0);
  });

  /* =================== BUILD + GAMMA + BETA =================== */
  const U = scene('build', 9600, 3200, 'build');
  const CS = 0.72;
  const CU = { x: U.x + 720, y: U.y + 220 };
  const cardsDef = [['Часове', 'фактурирани, по седмици'], ['Бърнъп', 'натрупани часове по седмици'], ['Графика', 'планови и реални часове'], ['Прогноза', 'изразходвано + темп × оставащи']];
  const pcards = cardsDef.map(([a, b], i) => {
    const c = U.add(h('div.card', { x: 160, y: 220 + i * 170, w: 500, h: 150, style: { padding: '24px 28px', display: 'flex', gap: '20px', alignItems: 'center' } }));
    const chk = h('div', { text: String(i + 1), style: { flex: 'none', width: '56px', height: '56px', borderRadius: '50%', border: '2.5px solid var(--line2)', display: 'grid', placeItems: 'center', fontSize: '26px', fontWeight: 800 } });
    c.append(chk, h('div', {}, h('div', { text: a, style: { fontSize: '36px', fontWeight: 800 } }), h('div.small.dim', { text: b, style: { fontSize: '23px' } })));
    gsap.set(c, { opacity: 0, x: -60 });
    return { c, chk };
  });
  const uLabel = U.add(h('div.label', { x: 160, y: 150, text: 'Един промпт · една стъпка · проверка' }));
  gsap.set(uLabel, { opacity: 0 });
  const gTitle = U.add(h('div.h3', { x: 740 + 150 * CS, y: 130, html: 'Проект Гама' }));
  gsap.set(gTitle, { opacity: 0, y: 20 });
  const kpiG = [['Изразходвани', '1 660 ч', 'от 1 480 ч'], ['Прогноза при приключване', '~134%', 'от бюджета']].map(([a, b, c], i) => {
    const e = U.add(h('div.card', { x: 740 + i * 530, y: 720, w: 500, style: { padding: '22px 30px' } },
      h('div.label', { text: a, style: { fontSize: '19px' } }),
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '14px' } },
        h('div', { text: b, style: { fontSize: '64px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--acc-ink)' } }),
        h('div.small.dim', { text: c }))));
    gsap.set(e, { opacity: 0, y: 30 });
    return e;
  });

  step(U, 'build-steps', 'Строим стъпка по стъпка.', t => {
    camTo(t, center(U), 0, { dur: 2.2, dip: 0.85, tilt: -1 });
    railTo(t, U, 0, 2.2);
    t.to([formula, ...kpis], { opacity: 0, duration: 0.4 }, 0);
    t.to([lblPlan, lblAct, lblGap, lblZero, lblFc, ...xLblsGen, ...yLblsGen], { opacity: 0, duration: 0.4 }, 0);
    t.to([zeroDot], { scale: 0, duration: 0.3 }, 0);
    t.to(areaP, { opacity: 0, duration: 0.4 }, 0);
    t.to(chart, { x: CU.x, y: CU.y, scale: CS, duration: 2.2, ease: 'expo.inOut' }, 0);
    t.to(uLabel, { opacity: 1, duration: 0.6 }, 1.6);
    pcards.forEach(({ c, chk }, i) => {
      t.to(c, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 1.7 + i * 0.35);
      t.to(chk, { backgroundColor: K.C.acc, borderColor: K.C.acc, color: K.C.ink, duration: 0.3 }, 2.2 + i * 0.35);
      t.set(chk, { textContent: '✓' }, 2.3 + i * 0.35);
    });
  });

  step(U, 'build-gamma', 'Гама: над бюджета от седмицата на 21.09.', t => {
    t.to(gTitle, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0);
    t.to(actP, { morphSVG: pathOf(gamAct), duration: 1.8, ease: 'expo.inOut' }, 0.2);
    t.to(areaP, { morphSVG: area(gamAct), duration: 1.8, ease: 'expo.inOut' }, 0.2);
    t.to(areaP, { opacity: 1, duration: 0.8 }, 1.0);
    t.to(fcP, { morphSVG: pathOf([[13, gamAct[13][1]], [16, gamFc]]), duration: 1.8, ease: 'expo.inOut' }, 0.2);
    t.to([...yLblsG, ...xLblsG], { opacity: 1, duration: 0.6, stagger: 0.05 }, 0.8);
    t.set(zeroDot, { attr: { cx: X(11.33) } }, 1.0);
    t.to(zeroDot, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, 1.9);
    t.to(lblZeroG, { opacity: 1, duration: 0.6 }, 2.1);
    kpiG.forEach((k, i) => t.to(k, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 2.2 + i * 0.2));
  });

  // Beta: the same chart as Gamma
  const gTitleB = U.add(h('div.h3', { x: 740 + 150 * CS, y: 130, html: 'Проект Бета' }));
  gsap.set(gTitleB, { opacity: 0, y: 20 });
  const kpiB = [['Изразходвани', Math.round(BT.cum[12]).toLocaleString('bg').replace(/\s/g, '\u202f') + ' ч', 'от 900 ч · 82%'], ['Прогноза при приключване', '~112%', 'от бюджета']].map(([a, b, c], i) => {
    const e = U.add(h('div.card', { x: 740 + i * 530, y: 720, w: 500, style: { padding: '22px 30px' } },
      h('div.label', { text: a, style: { fontSize: '19px' } }),
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '14px' } },
        h('div', { text: b, style: { fontSize: '64px', fontWeight: 800, letterSpacing: '-0.03em', color: i ? 'var(--acc-ink)' : 'var(--ink)' } }),
        h('div.small.dim', { text: c }))));
    gsap.set(e, { opacity: 0, y: 30 });
    return e;
  });
  step(U, 'build-beta-chart', 'Бета: същата графика — 82%, изглежда наред.', t => {
    t.to([...kpiG, gTitle, lblZeroG, zeroDot, fcP], { opacity: 0, duration: 0.4 }, 0);
    t.to(zeroDot, { scale: 0, duration: 0.3 }, 0);
    t.to(gTitleB, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.2);
    t.to(actP, { morphSVG: pathOf(betAct), duration: 1.8, ease: 'expo.inOut' }, 0.2);
    t.to(areaP, { morphSVG: area(betAct), duration: 1.8, ease: 'expo.inOut' }, 0.2);
    t.to(yLblsG, { opacity: 0, duration: 0.3 }, 0.2);
    t.to(yLblsB, { opacity: 1, duration: 0.6, stagger: 0.05 }, 0.8);
    t.to(kpiB[0], { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.6);
  });
  step(U, 'build-beta-chart-fc', 'Бета: но прогнозата показва над бюджета.', t => {
    t.set(fcP, { opacity: 1 }, 0);
    t.to(fcP, { morphSVG: pathOf([[13, betAct[13][1]], [16, betFc]]), duration: 1.4, ease: 'expo.inOut' }, 0);
    t.set(zeroDot, { attr: { cx: X(betCross) } }, 0.8);
    t.to(zeroDot, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, 1.4);
    t.to(lblZeroB, { opacity: 1, duration: 0.6 }, 1.6);
    t.to(kpiB[1], { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.2);
  });

  // Beta gauge (to the right of the build scene)
  const BX = 2400;
  const GCX = BX + 960, GCY = 690, GR = 380;
  const ang = p => Math.PI - Math.min(p, 130) / 130 * Math.PI;
  const pt = (p, r = GR) => [GCX + Math.cos(ang(p)) * r, GCY - Math.sin(ang(p)) * r];
  const arcD = (p0, p1, r = GR) => { const [x0, y0] = pt(p0, r), [x1, y1] = pt(p1, r); return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`; };
  const gSvg = U.add(svgBox(0, 0, 1920, 1080));
  const track = s('path', { d: arcD(0, 130), stroke: 'rgba(23,17,31,.1)', 'stroke-width': 44, fill: 'none' });
  const danger = s('path', { d: arcD(100, 130), stroke: 'rgba(250,157,19,.3)', 'stroke-width': 44, fill: 'none' });
  const spent = s('path', { d: arcD(0, 82), stroke: K.C.ink, 'stroke-width': 44, fill: 'none' });
  const fcArc = s('path', { d: arcD(82, 112), stroke: K.C.acc, 'stroke-width': 44, fill: 'none' });
  const [tx0, ty0] = pt(100, GR - 40), [tx1, ty1] = pt(100, GR + 40);
  const tick100 = s('line', { x1: tx0, y1: ty0, x2: tx1, y2: ty1, stroke: K.C.ink, 'stroke-width': 5 });
  const needle = s('line', { x1: GCX, y1: GCY, x2: GCX - GR + 70, y2: GCY, stroke: K.C.ink, 'stroke-width': 10, 'stroke-linecap': 'round' });
  const needleF = s('line', { x1: GCX, y1: GCY, x2: GCX - GR + 70, y2: GCY, stroke: K.C.acc, 'stroke-width': 10, 'stroke-linecap': 'round' });
  const hub = s('circle', { cx: GCX, cy: GCY, r: 22, fill: K.C.ink });
  gSvg.append(track, danger, spent, fcArc, tick100, needleF, needle, hub);
  gsap.set([track, danger, spent, fcArc], { drawSVG: '0%' });
  gsap.set([needle, needleF], { rotation: 0, svgOrigin: `${GCX} ${GCY}`, opacity: 0 });
  gsap.set([tick100, hub], { opacity: 0 });
  const [l100x, l100y] = pt(100, GR + 80);
  const lbl100 = U.add(h('div.small', { x: l100x - 20, y: l100y - 30, text: '100%', style: { fontWeight: 800 } }));
  const bTitle = U.add(h('div.h2.nowrap', { x: BX + 160, y: 100, text: 'Проект Бета' }));
  const bTitleW = maskWords(bTitle);
  const spentTxt = U.add(h('div', { x: BX + 160, y: 740, w: 560 },
    h('div', { text: '82%', style: { fontSize: '120px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 } }),
    h('div.body.dim', { text: 'изразходвани · изглежда наред' })));
  const warnImg = U.add(K.img('warning', BX + 1600, 560, 150, { from: 20 }));
  const fcTxt = U.add(h('div', { x: BX + 1340, y: 740, w: 480, style: { textAlign: 'right' } },
    h('div', { text: '~112%', style: { fontSize: '120px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--acc-ink)' } }),
    h('div.body', { html: 'прогноза при приключване', style: { color: 'var(--acc-ink)' } })));
  const late = U.add(h('div.h3', { x: BX + 160, y: 210, w: 1600, html: 'Без прогнозата щяхме да го видим <span class="acc">чак когато е късно.</span>', style: { fontSize: '40px' } }));
  gsap.set([lbl100, spentTxt, fcTxt], { opacity: 0, y: 30 });
  const lateW = maskWords(late);

  step(U, 'build-beta', 'Бета на километраж: 82%.', t => {
    camTo(t, { x: U.cx + BX, y: U.cy }, 0, { dur: 1.9 });
    rise(t, bTitleW, 0.5);
    t.to(track, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut' }, 0.4);
    t.to(danger, { drawSVG: '100%', duration: 0.6 }, 1.6);
    t.to([tick100, hub, lbl100], { opacity: 1, y: 0, duration: 0.5 }, 1.7);
    t.to(needle, { opacity: 1, duration: 0.2 }, 1.8);
    t.to(needle, { rotation: 82 / 130 * 180, duration: 1.6, ease: 'expo.out' }, 1.8);
    t.to(spent, { drawSVG: '100%', duration: 1.6, ease: 'expo.out' }, 1.8);
    t.to(spentTxt, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 2.2);
  });

  step(U, 'build-beta-fc', 'Километражът с прогнозата: ~112%.', t => {
    K.pop(t, warnImg, 1.7, { dur: 1.2 });
    t.set(needleF, { opacity: 1, rotation: 82 / 130 * 180 }, 0);
    t.to(needleF, { rotation: 112 / 130 * 180, duration: 2.0, ease: 'expo.inOut' }, 0.1);
    t.to(fcArc, { drawSVG: '100%', duration: 2.0, ease: 'expo.inOut' }, 0.1);
    t.to(spentTxt, { opacity: 0.45, duration: 0.6 }, 1.2);
    t.to(fcTxt, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.5);
    rise(t, lateW, 2.1);
  });

  /* =================== FEEDBACK =================== */
  const F = scene('feedback', 9600, 4800, 'feedback');
  const FS = 0.78;
  const CF = { x: F.x + 170, y: F.y + 240 };
  const fbLabel = F.add(h('div.label', { x: 250, y: 130, text: 'Обратна връзка · по една промяна' }));
  gsap.set(fbLabel, { opacity: 0 });
  const chips = ['Направи плановата линия пунктирана.', 'Добави линия за днешната седмица.', 'Покажи остатъка в проценти от бюджета.'].map((txt, i) => {
    const c = F.add(h('div.card', { x: 1330, y: 190 + i * 104, w: 450, style: { padding: '18px 24px', fontSize: '26px', fontWeight: 600, display: 'flex', gap: '16px', alignItems: 'center' } }));
    const n = h('div', { text: String(i + 1), style: { flex: 'none', width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--line2)', display: 'grid', placeItems: 'center', fontSize: '22px', fontWeight: 800 } });
    c.append(n, h('div', { text: txt }));
    gsap.set(c, { opacity: 0, x: 40 });
    return { c, n };
  });
  const bad = F.add(h('div.card', { x: 1330, y: 540, w: 450, style: { padding: '20px 24px' } },
    h('div', { html: '<span style="color:var(--ink3);font-weight:800">✗</span>&nbsp; „Не е правилно.“', style: { fontSize: '30px', fontWeight: 700, color: 'var(--ink2)' } })));
  const good = F.add(h('div.card', { x: 1330, y: 650, w: 450, style: { padding: '20px 24px', borderColor: 'rgba(250,157,19,.7)' } },
    h('div', { html: '<span class="acc" style="font-weight:800">✓</span>&nbsp; „Натрупаните часове трябва да включва <b class="acc">само фактурираните часове</b>. Поправи формулата и ми покажи какво промени.“', style: { fontSize: '26px', fontWeight: 600, lineHeight: 1.35 } })));
  gsap.set([bad, good], { opacity: 0, x: 40 });
  const badStrike = F.add(h('div', { x: 1390, y: 562, w: 250, h: 4, style: { background: 'var(--ink2)' } }));
  gsap.set(badStrike, { scaleX: 0, transformOrigin: '0% 50%' });
  const diff = F.add(h('div.card.mono', { x: 250, y: 800, w: 1040, style: { padding: '18px 24px', fontSize: '23px', lineHeight: 1.5, color: 'var(--ink2)' },
    html: '=SUMIFS(Часове[Часове]; Часове[Проект]; "Гама"<span style="background:rgba(250,157,19,.25);color:var(--acc-ink)">; Часове[Фактуриран]; "Да"</span>)' }));
  gsap.set(diff, { opacity: 0, y: 20 });
  const chipOn = (t, i, at) => {
    t.to(chips[i].c, { borderColor: 'rgba(250,157,19,.7)', duration: 0.3 }, at);
    t.to(chips[i].n, { backgroundColor: K.C.acc, borderColor: K.C.acc, color: K.C.ink, duration: 0.3 }, at);
    t.set(chips[i].n, { textContent: '✓' }, at + 0.1);
  };

  step(F, 'fb-dashed', '„Направи плановата линия пунктирана.“', t => {
    camTo(t, center(F), 0, { dur: 2.4, dip: 0.8, tilt: 1 });
    railTo(t, F, 0, 2.4);
    t.to([kpiG, gTitle, uLabel, lblZeroG].flat(), { opacity: 0, duration: 0.4 }, 0);
    // back to Gamma: the corrections below are made on this project's chart
    t.to([kpiB, gTitleB, lblZeroB, yLblsB].flat(), { opacity: 0, duration: 0.4 }, 0);
    t.to(actP, { morphSVG: pathOf(gamAct), duration: 1.6, ease: 'expo.inOut' }, 0);
    t.to(areaP, { morphSVG: area(gamAct), duration: 1.6, ease: 'expo.inOut' }, 0);
    t.set(fcP, { opacity: 1 }, 0);
    t.to(fcP, { morphSVG: pathOf([[13, gamAct[13][1]], [16, gamFc]]), duration: 1.6, ease: 'expo.inOut' }, 0);
    t.to(yLblsG, { opacity: 1, duration: 0.5 }, 0.8);
    t.set(zeroDot, { attr: { cx: X(11.33) } }, 0.8);
    t.to(chart, { x: CF.x, y: CF.y, scale: FS, duration: 2.4, ease: 'expo.inOut' }, 0);
    t.to(fbLabel, { opacity: 1, duration: 0.6 }, 1.8);
    chips.forEach(({ c }, i) => t.to(c, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, 1.9 + i * 0.1));
    chipOn(t, 0, 2.6);
    t.to(planP, { drawSVG: '100% 100%', duration: 1.2, ease: 'power2.inOut' }, 2.7);
    t.to(clipPd.firstChild, { attr: { width: CWD }, duration: 1.2, ease: 'power2.inOut' }, 2.7);
  });
  step(F, 'fb-today', '„Добави линия за днешната седмица.“', t => {
    chipOn(t, 1, 0);
    t.to(todayLn, { scaleY: 1, duration: 0.9, ease: 'expo.out' }, 0.2);
    t.to(lblToday, { opacity: 1, duration: 0.5 }, 0.6);
  });
  step(F, 'fb-thousands', '„Покажи остатъка в проценти от бюджета.“', t => {
    chipOn(t, 2, 0);
    yLblsG.forEach((e, i) => { t.to(e, { opacity: 0, y: -16, duration: 0.3 }, 0.2); });
    yLblsK.forEach((e, i) => { t.fromTo(e, { y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2)', immediateRender: false }, 0.45); });
  });
  step(F, 'fb-bug', 'Грешка: линията включва нефактурирани часове.', t => {
    t.to(actP, { morphSVG: pathOf(gamWrong), duration: 1.4, ease: 'expo.inOut' }, 0);
    t.to(areaP, { morphSVG: area(gamWrong), duration: 1.4, ease: 'expo.inOut' }, 0);
    t.to(zeroDot, { scale: 0, duration: 0.3 }, 0);
    t.to(fcP, { opacity: 0, duration: 0.3 }, 0);
    t.to(lblWrong, { opacity: 1, duration: 0.5 }, 1.2);
    t.to(bad, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, 1.4);
    t.to(badStrike, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 2.2);
  });
  step(F, 'fb-fix', 'Конкретна обратна връзка → поправено.', t => {
    t.to(good, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 0);
    t.to(lblWrong, { opacity: 0, duration: 0.3 }, 1.0);
    t.to(actP, { morphSVG: pathOf(gamAct), duration: 1.4, ease: 'expo.inOut' }, 1.0);
    t.to(areaP, { morphSVG: area(gamAct), duration: 1.4, ease: 'expo.inOut' }, 1.0);
    t.to(fcP, { opacity: 1, duration: 0.4 }, 2.2);
    t.to(zeroDot, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 2.2);
    t.to(diff, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.6);
  });

  // Colours / filter for a very big sheet
  const colCard = F.add(h('div.card', { x: 250, y: 790, w: 1040, style: { padding: '18px 26px', borderColor: 'rgba(250,157,19,.7)' } },
    h('div.label', { text: 'Голяма таблица? Кажи на Copilot да оцвети', style: { fontSize: '18px' } }),
    h('div', { html: '„Оцвети редовете с <b style="color:#C0392B">натрупани часове над плана в червено</b>, а <b style="color:#1E8449">под плана в зелено</b>. Добави филтър, за да виждам само червените.“', style: { fontSize: '25px', fontWeight: 600, lineHeight: 1.35, marginTop: '6px' } })));
  gsap.set(colCard, { opacity: 0, y: 20 });
  const colLegend = [['над плана', 'rgba(192,57,43,.9)'], ['под плана', 'rgba(30,132,73,.9)']].map(([txt, c], i) => {
    const e = chart.appendChild(h('div', { x: PL + 40 + i * 270, y: PT + PH + 90, style: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '28px', fontWeight: 700, color: c } },
      h('span', { style: { width: '22px', height: '22px', borderRadius: '6px', background: c } }), h('span', { text: txt })));
    gsap.set(e, { opacity: 0 });
    return e;
  });
  step(F, 'fb-colors', 'Цветове: над плана — червено, под плана — зелено.', t => {
    t.to(diff, { opacity: 0, y: 20, duration: 0.5 }, 0);
    t.to(colCard, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.4);
    t.to(areaP, { fill: 'rgba(192,57,43,.22)', duration: 0.8 }, 0.8);
    t.to(colLegend, { opacity: 1, duration: 0.6, stagger: 0.15 }, 1.2);
  });

  K.shared.chart = { chart, CWD, CHT, actP, areaP, fcP, pathOf, area, gamAct, X, Y, lblToday, todayLn, yLblsK, xLblsG, F, diff, good, bad, badStrike, chips, fbLabel, lblWrong, colCard, colLegend };
});
