/* 5.1 Excel: messy → clean, number vs formula, Plan mode */
K.def(function () {
  const { h, s, svgBox, scene, step, camTo, center, maskWords, rise, splitChars, type, railTo, count, actors } = K;
  const PR = K.shared.prompt;

  /* =================== MESSY → CLEAN =================== */
  const M = scene('messy', 4800, 1600, 'excel');
  const GX = 190, GY = 190;
  const grp = M.add(h('div', { x: GX, y: GY, w: 0, h: 0 }));
  const colW = [330, 250, 200, 300, 170, 230];
  const colX = []; { let x = 60; colW.forEach(w => { colX.push(x); x += w; }); }
  const SW = 60 + colW.reduce((a, b) => a + b, 0), RH = 56, HD = 40, NR = 12;
  const sheet = h('div.sheet', { x: 0, y: 0, w: SW, h: HD + NR * RH });
  grp.append(sheet);
  // static grid
  sheet.append(h('div', { x: 60, y: HD, w: SW - 60, h: NR * RH, style: {
    backgroundImage: `linear-gradient(rgba(23,17,31,.08) 1.5px, transparent 1.5px)`, backgroundSize: `100% ${RH}px`, backgroundPosition: '0 -1.5px' } }));
  colX.forEach((x, i) => sheet.append(h('div', { x: x + colW[i] - 1.5, y: HD, w: 1.5, h: NR * RH, style: { background: 'rgba(23,17,31,.08)' } })));
  'ABCDEF'.split('').forEach((l, i) => sheet.append(h('div.colhd', { x: colX[i], y: 0, w: colW[i], h: HD, text: l, style: { lineHeight: HD + 'px', borderBottom: '1.5px solid var(--line)' } })));
  for (let r = 0; r < NR; r++) sheet.append(h('div.rowhd', { x: 0, y: HD + r * RH, w: 60, h: RH, text: String(r + 1), style: { lineHeight: RH + 'px', borderRight: '1.5px solid var(--line)' } }));

  const rowsEls = {};   // original row -> [cells]
  function cell(r, c, text, o = {}) {
    const span = o.span || 1;
    let w = 0; for (let k = 0; k < span; k++) w += colW[c + k];
    const e = h('div.cell', { x: colX[c], y: HD + r * RH, w, h: (o.rows || 1) * RH, text, style: Object.assign({ lineHeight: (o.rows || 1) * RH + 'px', height: (o.rows || 1) * RH + 'px', borderRight: 'none', borderBottom: 'none' }, o.style || {}) });
    if (o.right) e.classList.add('r');
    if (o.bold) e.style.fontWeight = 800;
    sheet.append(e);
    (rowsEls[r] = rowsEls[r] || []).push(e);
    return e;
  }
  const data = [
    [4, 'Георги Петров', 'Разработка', 'Гама', 'седм. 07.09', '07.09.2026', '48', '44'],
    [5, null, 'Разработка', 'Бета', '14/09/2026', '14.09.2026', '52', '50'],
    [7, 'Мария Иванова', 'Анализ', 'Гама', '07.9.26', '07.09.2026', '38', '36'],
    [8, 'Иван Колев', 'Тестване', 'Бета', 'седм. 14.09', '14.09.2026', '18', '18'],
    [10, 'Елена Димитрова', 'Дизайн', 'Алфа', '21/09', '21.09.2026', '34', '30'],
    [11, 'Петър Николов', 'Тестване', 'Гама', '21.9.2026', '21.09.2026', '20', '16']];
  const finalRow = { 2: 0, 3: 0, 4: 1, 5: 2, 7: 3, 8: 4, 10: 5, 11: 6 };
  const bg = K.C.card;
  // header rows
  const hdr = ['Служител', 'Екип', 'Проект', 'Седмица'].map((t, c) => cell(2, c, t, { bold: true }));
  const hE = cell(2, 4, 'Часове', { span: 2, bold: true, style: { background: bg, textAlign: 'center', borderBottom: '1.5px solid var(--line2)' } });
  const h2E = cell(3, 4, 'общо', { style: { color: 'var(--ink2)' } });
  const h2F = cell(3, 5, 'Фактурирани', { bold: true });
  const dateFlips = [];
  const dataCells = [];
  data.forEach(([r, name, team, proj, oldD, newD, hrs, bill]) => {
    const row = [];
    if (name) row.push(cell(r, 0, name, r === 4 ? { rows: 2, style: { background: bg, borderBottom: '1.5px solid rgba(23,17,31,.08)' } } : {}));
    row.push(cell(r, 1, team), cell(r, 2, proj));
    const dc = cell(r, 3, '', { style: { perspective: '600px' } });
    const o = h('span', { text: oldD, style: { position: 'absolute', left: '20px', top: 0, color: 'var(--ink2)', fontStyle: 'italic' } });
    const n = h('span', { text: newD, style: { position: 'absolute', right: '20px', top: 0 } });
    dc.append(o, n); gsap.set(n, { rotationX: -90, opacity: 0 });
    dateFlips.push({ o, n });
    row.push(dc, cell(r, 4, hrs, { right: true }), cell(r, 5, bill, { right: true }));
    dataCells.push({ r, row });
  });
  const merged = rowsEls[4][0];
  const clone = cell(4, 0, 'Георги Петров');
  rowsEls[4].pop();
  gsap.set(clone, { opacity: 0 });
  // title (outside the sheet so it can lift off)
  const titleCell = h('div', { x: 60, y: HD, w: SW - 60, h: RH, text: 'ОТЧЕТ ЧАСОВЕ · ЕКСПОРТ Q3 (ЧЕРНОВА)', style: { background: 'var(--card2)', lineHeight: RH + 'px', textAlign: 'center', fontSize: '27px', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--ink2)', whiteSpace: 'nowrap', transformOrigin: '0% 50%' } });
  grp.append(titleCell);
  // filter arrows + name tag + counter
  const arrows = colX.map((x, i) => { const a = h('div', { x: x + colW[i] - 34, y: HD + 16, text: '▾', style: { fontSize: '20px', color: K.C.ink, fontWeight: 800 } }); sheet.append(a); gsap.set(a, { opacity: 0 }); return a; });
  const counter = h('div.pill', { x: SW - 470, y: HD + NR * RH + 24, html: 'Редове с данни: <b>6</b> → <b class="acc">6 ✓</b>', style: { fontSize: '27px' } });
  grp.append(counter); gsap.set(counter, { opacity: 0, y: -20 });
  const promptPill = M.add(h('div.pill', { x: 190, y: 90, style: { fontSize: '27px', fontWeight: 600, maxWidth: '1540px' } },
    K.icon('broom', 40), h('span.tag', { text: 'Редакция' }), h('span', { text: '„Изчисти този лист… Не трий нито един ред с данни.“', style: { color: 'var(--ink2)' } })));
  gsap.set(promptPill, { opacity: 0, y: -20 });
  gsap.set(sheet, { clipPath: `circle(0px at 60px ${HD}px)` });
  gsap.set(titleCell, { opacity: 0, transformPerspective: 800 });

  // selection cursor (actor) that the prompt formula collapses into
  const cursor = h('div', { style: { position: 'absolute', left: 0, top: 0, border: '4px solid #FA9D13', borderRadius: '8px', boxShadow: '0 0 30px rgba(250,157,19,.45)' } });
  actors.append(cursor);
  const fb = PR.blocks, fx0 = fb[0].fx - 20, fx1 = fb[3].fx + fb[3].b.offsetWidth + 20;
  gsap.set(cursor, { x: PR.P.x + fx0, y: PR.P.y + fb[0].fy - 14, width: fx1 - fx0, height: 110, opacity: 0 });

  step(M, 'clean-arrive', 'Хаос: суровият експорт.', t => {
    // formula blocks collapse into one selection cursor
    t.to(cursor, { opacity: 1, duration: 0.3 }, 0);
    t.to(fb.map(b => b.b).concat(PR.plusEls), { scale: 0.2, opacity: 0, duration: 0.5, ease: 'power3.in', stagger: 0.05 }, 0.05);
    t.to(cursor, { x: M.x + GX + 60, y: M.y + GY + HD, width: SW - 60, height: RH, duration: 2.2, ease: 'expo.inOut' }, 0.4);
    camTo(t, center(M), 0.2, { dur: 2.4, dip: 0.8, tilt: 1 });
    railTo(t, M, 0.2, 2.4);
    t.to(sheet, { clipPath: `circle(1800px at 60px ${HD}px)`, duration: 1.6, ease: 'power2.inOut' }, 2.0);
    t.to(titleCell, { opacity: 1, duration: 0.4 }, 2.2);
    t.to(cursor, { opacity: 0, duration: 0.5 }, 2.8);
    t.to(promptPill, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 2.8);
  }, { keep: ['prompts'] });

  const moveRow = (t, r, to, at, dur = 1.1) => rowsEls[r] && t.to(rowsEls[r], { y: (to - r) * RH, duration: dur, ease: 'expo.inOut' }, at);

  step(M, 'clean-title', 'Махам заглавието, един ред заглавия.', t => {
    t.to(titleCell, { y: -120, x: 0, scale: 0.55, color: K.C.accInk, background: 'rgba(250,157,19,0)', duration: 1.2, ease: 'expo.inOut' }, 0);
    t.to(promptPill, { opacity: 0, y: -30, duration: 0.6, ease: 'power2.in' }, 0);
    moveRow(t, 2, 0, 0.35);
    t.to(hE, { width: colW[4], textAlign: 'left', duration: 0.9, ease: 'expo.inOut' }, 0.35);
    t.to(h2E, { y: -3 * RH, scale: 0.3, opacity: 0, duration: 1.0, ease: 'expo.inOut' }, 0.35);
    t.to(h2F, { y: -3 * RH, duration: 1.1, ease: 'expo.inOut' }, 0.35);
    [4, 5, 7, 8, 10, 11].forEach((r, i) => moveRow(t, r, r - 3, 0.45 + i * 0.04));
    t.to(clone, { y: -3 * RH, duration: 1.1, ease: 'expo.inOut' }, 0.45);
  });

  step(M, 'clean-rows', 'Разединяваме клетките, махаме празните редове.', t => {
    t.to(merged, { height: RH, lineHeight: RH + 'px', duration: 0.8, ease: 'expo.inOut' }, 0);
    t.to(clone, { opacity: 1, duration: 0.2 }, 0.2);
    t.to(clone, { y: -2 * RH, duration: 0.8, ease: 'back.out(1.6)' }, 0.2);
    [[7, 3], [8, 4], [10, 5], [11, 6]].forEach(([r, to], i) => moveRow(t, r, to, 0.8 + i * 0.08, 1.0));
  });

  step(M, 'clean-dates', 'Седмиците от текст → дати.', t => {
    dateFlips.forEach(({ o, n }, i) => {
      t.to(o, { rotationX: 90, opacity: 0, duration: 0.35, ease: 'power2.in' }, i * 0.12);
      t.to(n, { rotationX: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, i * 0.12 + 0.35);
    });
  });

  step(M, 'clean-table', 'Таблица „Часове“. Нито един ред изтрит.', t => {
    const headCells = [...hdr, hE, h2F];
    t.to(headCells, { backgroundColor: K.C.acc, color: K.C.ink, duration: 0.6, stagger: 0.05 }, 0);
    t.to(arrows, { opacity: 1, duration: 0.4, stagger: 0.05 }, 0.4);
    dataCells.forEach(({ row }, i) => {
      const cells = i === 1 ? row.concat(clone) : row;
      if (finalRow[data[i][0]] % 2 === 0) t.to(cells, { backgroundColor: 'rgba(23,17,31,.05)', duration: 0.5 }, 0.3 + i * 0.05);
    });
    // the lifted title becomes the table's name tag
    t.to(titleCell, { rotationX: 90, duration: 0.3, ease: 'power2.in' }, 0.3);
    t.set(titleCell, { textContent: 'Таблица: Часове', width: 520, background: 'rgba(250,157,19,.16)', borderRadius: '14px', letterSpacing: '0.02em' }, 0.6);
    t.to(titleCell, { rotationX: 0, scale: 0.8, duration: 0.5, ease: 'back.out(2)' }, 0.6);
    t.to(counter, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.9);
  });

  /* =================== NUMBER VS FORMULA =================== */
  const F = scene('formula', 2400, 1600, 'excel');
  const SC = 0.62;
  const fTitle = F.add(h('div.h2', { x: 120, y: 90, text: 'Число или формула?' }));
  const fTitleW = maskWords(fTitle);
  const fSub = F.add(h('div.small.dim', { x: 1160, y: 790, w: 620, style: { fontSize: '24px', lineHeight: 1.35 },
    html: 'И двете карти показват едно и също: <b style="color:var(--ink)">колко % от времето на екип Разработка е заето с платена работа</b> (натовареност).' }));
  gsap.set(fSub, { opacity: 0, y: 20 });
  function valueCard(x, label, sub) {
    const c = F.add(h('div.card', { x, y: 290, w: 290, h: 340, style: { padding: '28px' } }));
    c.append(h('div.label', { text: label }));
    const v = h('div', { text: '78%', style: { fontSize: '104px', fontWeight: 800, letterSpacing: '-0.04em', marginTop: '26px' } });
    c.append(v);
    c.append(h('div.small.dim', { text: sub, style: { marginTop: '4px', fontSize: '22px', lineHeight: 1.25 } }));
    gsap.set(c, { opacity: 0, y: 40, scale: 0.9 });
    return { c, v };
  }
  const numCard = valueCard(1160, 'Готово число', 'натовареност на Разработка, написана на ръка');
  const frmCard = valueCard(1480, 'Формула', 'натовареност на Разработка, изчислена');
  const stale = F.add(h('span.tag', { x: 1190, y: 262, text: 'остаряло', style: { background: 'var(--card2)', color: 'var(--ink2)' } }));
  gsap.set(stale, { opacity: 0, scale: 0.6 });
  const fBar = F.add(h('div.card.mono', { x: 1160, y: 650, w: 610, style: { padding: '20px 24px', fontSize: '23px', lineHeight: 1.5, color: 'var(--ink2)' },
    html: '<span class="acc">=</span>SUMIFS(Часове[Фактурирани];<br>&nbsp;Часове[Екип]; "Разработка")<br>&nbsp;/ (Екип[Капацитет] * 13)' }));
  gsap.set(fBar, { opacity: 0, y: 30 });
  const fTake = F.add(h('div', { x: 1160, y: 890, w: 620 },
    h('div.h3', { html: 'Формули, <span class="acc">не готови числа.</span>' }),
    h('div.small.dim', { text: 'Виждам откъде идва резултатът и той се обновява.', style: { marginTop: '8px' } })));
  gsap.set(fTake, { opacity: 0, y: 30 });
  const fSvg = F.add(svgBox(0, 0, 1920, 1080));
  const cellF = { x: 120 + (colX[5] + colW[5] - 60) * SC, y: 250 + (HD + RH * 1.5) * SC };
  const wire = s('path', { d: `M ${cellF.x} ${cellF.y} C ${cellF.x + 120} ${120}, 1520 ${110}, 1625 ${286}`, stroke: K.C.acc, 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '3 10', 'stroke-linecap': 'round' });
  fSvg.append(wire); gsap.set(wire, { drawSVG: '0%' });
  const georgiF = dataCells[0].row[dataCells[0].row.length - 1];
  const grpPos = (sc, x, y) => ({ x: sc.x + x - (M.x + GX), y: sc.y + y - (M.y + GY) });

  step(F, 'formula-arrive', 'Две клетки: число и формула.', t => {
    const p = grpPos(F, 120, 250);
    camTo(t, center(F), 0, { dur: 2.2, dip: 0.85, tilt: -1 });
    railTo(t, F, 0, 2.2);
    t.to(grp, { x: p.x, y: p.y, scale: SC, transformOrigin: '0% 0%', duration: 2.2, ease: 'expo.inOut' }, 0);
    t.to(promptPill, { opacity: 0, duration: 0.4 }, 0);
    rise(t, fTitleW, 1.3);
    t.to([numCard.c, frmCard.c], { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'expo.out', stagger: 0.15 }, 1.6);
    t.to(fSub, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.8);
    t.to(fBar, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 2.0);
  }, { keep: ['messy'] });

  step(F, 'formula-change', 'Сменяме часовете → формулата се преизчислява.', t => {
    t.to(georgiF, { backgroundColor: 'rgba(250,157,19,.45)', color: K.C.ink, duration: 0.3 }, 0);
    count(t, georgiF, 44, 56, 0.2, { dur: 0.6, fmt: v => String(Math.round(v)) });
    t.to(wire, { drawSVG: '100%', duration: 1.0, ease: 'power2.inOut' }, 0.7);
    t.to(frmCard.c, { borderColor: K.C.acc, duration: 0.3 }, 1.6);
    t.to(frmCard.v, { color: K.C.accInk, duration: 0.3 }, 1.6);
    count(t, frmCard.v, 78, 81, 1.6, { dur: 1.0, fmt: v => Math.round(v) + '%' });
    t.to(numCard.c, { opacity: 0.45, duration: 0.6 }, 2.4);
    t.to(stale, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.5)' }, 2.4);
  }, { keep: ['messy'] });

  step(F, 'formula-take', 'Формули, не готови числа.', t => {
    t.to(fTake, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 0);
  }, { keep: ['messy'] });

  /* =================== PLAN MODE =================== */
  const L = scene('plan', 0, 1600, 'excel');
  const lTitle = L.add(h('div.h2', { x: 120, y: 90, text: 'Режим План' }));
  const lTitleW = maskWords(lTitle);
  const planCard = L.add(h('div.card', { x: 1160, y: 210, w: 620, style: { padding: '30px 32px' } }));
  planCard.append(h('div.label', { text: 'План · 3 стъпки' }));
  const planSteps = ['Намери хората с над 45 часа седмично', 'Оцвети редовете им в червено', 'Обобщена таблица по служител и проект в нов лист'].map((txt, i) => {
    const r = h('div', { style: { display: 'flex', gap: '18px', alignItems: 'flex-start', marginTop: '22px' } });
    const n = h('div', { text: String(i + 1), style: { flex: 'none', width: '46px', height: '46px', borderRadius: '50%', border: '2px solid var(--line2)', display: 'grid', placeItems: 'center', fontSize: '24px', fontWeight: 800 } });
    r.append(n, h('div', { text: txt, style: { fontSize: '28px', fontWeight: 600, lineHeight: 1.3, paddingTop: '4px' } }));
    planCard.append(r);
    gsap.set(r, { opacity: 0, x: -30 });
    return { r, n };
  });
  const approve = h('div', { text: 'Одобри', style: { display: 'inline-block', marginTop: '28px', fontSize: '28px', fontWeight: 800, padding: '14px 30px', borderRadius: '14px', background: 'var(--acc)', color: K.C.ink } });
  planCard.append(approve);
  gsap.set(planCard, { opacity: 0, y: 40 });
  const pivot = L.add(h('div.card', { x: 1160, y: 690, w: 620, style: { padding: '22px 28px', fontSize: '25px', fontWeight: 600 } }));
  pivot.append(h('div.label', { text: 'Нов лист · обобщена таблица', style: { fontSize: '18px' } }));
  [['Служител', 'Гама', 'Бета', true], ['Георги Петров', '48', '52'], ['Мария Иванова', '38', '–'], ['Иван Колев', '–', '18']].forEach(([a, b, c, hd]) => {
    pivot.append(h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 110px 110px', padding: '6px 0', fontWeight: hd ? 800 : 600, color: hd ? 'var(--ink3)' : (a === 'Георги Петров' ? 'var(--acc-ink)' : 'var(--ink)') } },
      h('div', a), h('div', { text: b, style: { textAlign: 'right' } }), h('div', { text: c, style: { textAlign: 'right' } })));
  });
  gsap.set(pivot, { opacity: 0, y: 30 });
  const gPill = L.add(h('div.pill', { x: 120, y: 730, html: '<b>Георги Петров</b> · <span class="acc">46–52 ч седмично</span>', style: { borderColor: 'var(--acc)' } }));
  gsap.set(gPill, { opacity: 0, y: 20 });

  // team load bars (the table turns into them)
  const teams = [['Разработка', 81], ['Анализ', 88], ['Дизайн', 74], ['Тестване', 45]];
  const BX0 = 420, BWmax = 600;
  const barEls = teams.map(([n, v], i) => {
    const y = 300 + i * 100;
    const lbl = L.add(h('div.body', { x: 120, y: y + 4, w: 280, text: n, style: { fontWeight: 700, color: v < 70 ? 'var(--acc-ink)' : 'var(--ink)' } }));
    const bar = L.add(h('div', { x: BX0, y, w: BWmax * v / 100, h: 56, style: { borderRadius: '10px', background: v < 70 ? 'var(--acc)' : 'rgba(23,17,31,.82)' } }));
    const pct = L.add(h('div.body', { x: BX0 + BWmax * v / 100 + 18, y: y + 4, text: v + '%', style: { fontWeight: 800, color: v < 70 ? 'var(--acc-ink)' : 'var(--ink2)' } }));
    gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' }); gsap.set([lbl, pct], { opacity: 0, x: -20 });
    return { lbl, bar, pct, v, y };
  });
  const th = L.add(h('div', { x: BX0 + BWmax * 0.7, y: 270, w: 0, h: 420, style: { borderLeft: '3px dashed rgba(23,17,31,.55)' } }));
  const thL = L.add(h('div.small', { x: BX0 + BWmax * 0.7 - 60, y: 222, w: 120, text: '70%', style: { textAlign: 'center', fontWeight: 800 } }));
  const underL = L.add(h('div.tag', { x: BX0 + BWmax * 0.45 + 150, y: 612, text: 'под 70%' }));
  gsap.set(th, { scaleY: 0, transformOrigin: '50% 0%' }); gsap.set([thL, underL], { opacity: 0 });
  const chartTitle = L.add(h('div.label', { x: 120, y: 230, text: 'Натовареност по екип' }));
  gsap.set(chartTitle, { opacity: 0 });

  step(L, 'plan-arrive', 'Режим План: първо виждам стъпките.', t => {
    const p = grpPos(L, 120, 250);
    camTo(t, center(L), 0, { dur: 2.2, dip: 0.85, tilt: 1 });
    railTo(t, L, 0, 2.2);
    t.to(grp, { x: p.x, y: p.y, duration: 2.2, ease: 'expo.inOut' }, 0);
    t.to(georgiF, { backgroundColor: 'rgba(250,157,19,0)', color: K.C.ink, duration: 0.6 }, 0.2);
    rise(t, lTitleW, 1.3);
    t.to(planCard, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 1.5);
    planSteps.forEach(({ r }, i) => t.to(r, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, 1.8 + i * 0.15));
  }, { keep: ['messy'] });

  const georgiRows = dataCells[0].row.concat(dataCells[1].row, [clone]);
  step(L, 'plan-approve', 'Одобряваме → Георги над 45 ч.', t => {
    t.to(approve, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, 0);
    planSteps.forEach(({ n }, i) => t.to(n, { backgroundColor: K.C.acc, borderColor: K.C.acc, color: K.C.ink, duration: 0.3 }, 0.4 + i * 0.6));
    planSteps.forEach(({ n }, i) => t.set(n, { textContent: '✓' }, 0.55 + i * 0.6));
    t.to(georgiRows, { backgroundColor: 'rgba(250,157,19,.30)', color: K.C.ink, duration: 0.5, stagger: 0.02 }, 0.6);
    t.to(gPill, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 1.0);
    t.to(pivot, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.6);
  }, { keep: ['messy'] });

  step(L, 'plan-chart', 'Натовареност по екип: Тестване под 70%.', t => {
    // table collapses row by row into the bars
    t.to(grp, { scaleY: 0.02, opacity: 0, duration: 0.9, ease: 'power3.in' }, 0);
    t.to(gPill, { opacity: 0, y: 20, duration: 0.4 }, 0);
    t.to(chartTitle, { opacity: 1, duration: 0.6 }, 0.6);
    barEls.forEach((b, i) => {
      t.to(b.bar, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0.7 + i * 0.1);
      t.to([b.lbl, b.pct], { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, 0.8 + i * 0.1);
    });
    t.to(th, { scaleY: 1, duration: 0.8, ease: 'expo.out' }, 1.4);
    t.to([thL, underL], { opacity: 1, duration: 0.6 }, 1.7);
  }, { keep: ['messy'] });

  K.shared.excel = { L, barEls, th, thL, underL, chartTitle, lbls: barEls.map(b => b.lbl), planCard, pivot, lTitle };
});
