/* 6.5 Connect → 6.6 Automation → 6.7 Bilingual → 6.8 Tokens */
K.def(function () {
  const { h, s, svgBox, scene, step, camTo, center, maskWords, rise, splitChars, type, railTo } = K;
  const CT = K.shared.chart;
  const FB = CT.F;

  /* =================== CONNECT =================== */
  const C = scene('connect', 7200, 4800, 'connect');
  const cLabel = C.add(h('div.label', { x: 160, y: 90, text: 'Data → Get Data → From Folder' }));
  gsap.set(cLabel, { opacity: 0 });
  // folder
  const folder = C.add(h('div', { x: 160, y: 250, w: 440, h: 250 }));
  folder.append(h('div', { x: 0, y: 0, w: 170, h: 40, style: { background: 'var(--card2)', borderRadius: '14px 14px 0 0' } }));
  folder.append(h('div', { x: 0, y: 30, w: 440, h: 220, style: { background: 'var(--card2)', borderRadius: '0 18px 18px 18px' } }));
  const folderFront = h('div', { x: 0, y: 90, w: 440, h: 160, style: { background: 'var(--card3)', borderRadius: '18px', display: 'grid', placeItems: 'center', fontSize: '34px', fontWeight: 800, zIndex: 3 }, text: 'Експорти' });
  folder.append(folderFront);
  gsap.set(folder, { opacity: 0, y: 30 });
  function csv(name, x) {
    const f = h('div', { x, y: 110, w: 120, h: 150, style: { zIndex: 2, filter: 'drop-shadow(0 4px 10px rgba(23,17,31,.18))' } });
    f.append(h('div', { x: 0, y: 0, w: 120, h: 150, style: { background: 'var(--card)', borderRadius: '10px', clipPath: 'polygon(0 0, 78% 0, 100% 20%, 100% 100%, 0 100%)' } }));
    f.append(h('div', { x: 12, y: 60, text: 'CSV', style: { fontSize: '22px', fontWeight: 800, color: K.C.ink } }));
    f.append(h('div', { x: -20, y: 158, w: 160, text: name, style: { fontSize: '22px', fontWeight: 700, textAlign: 'center', color: 'var(--ink2)' } }));
    folder.append(f);
    gsap.set(f, { y: -200, opacity: 0 });
    return f;
  }
  const files = [csv('юли', 30), csv('август', 160), csv('септември', 290)];
  const octF = csv('октомври', 290);
  const pq = C.add(h('div.pill', { x: 690, y: 400, html: '<span class="acc">⏷</span> Power Query', style: { fontSize: '30px' } }));
  const refresh = C.add(h('div', { x: 755, y: 470, w: 64, h: 64, html: '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#FA9D13" stroke-width="5" stroke-linecap="round"><path d="M50 22 A20 20 0 1 0 52 38"/><path d="M52 10 L51 23 L38 21"/></svg>' }));
  const refLbl = C.add(h('div.small', { x: 830, y: 480, text: 'Refresh', style: { fontWeight: 800, color: 'var(--acc-ink)' } }));
  gsap.set([pq], { opacity: 0, scale: 0.7 }); gsap.set([refresh, refLbl], { opacity: 0 });
  const cSvg = C.add(svgBox(0, 0, 1920, 1080));
  const a1 = s('path', { d: 'M 610 430 L 675 430', stroke: 'rgba(23,17,31,.4)', 'stroke-width': 4, fill: 'none' });
  const a2 = s('path', { d: 'M 975 430 L 1040 430', stroke: 'rgba(23,17,31,.4)', 'stroke-width': 4, fill: 'none' });
  cSvg.append(a1, a2); gsap.set([a1, a2], { drawSVG: '0%' });
  // combined table
  const tbl = C.add(h('div.card', { x: 1060, y: 170, w: 700, h: 340, style: { padding: '22px 26px', overflow: 'hidden' } }));
  tbl.append(h('div', { text: 'Часове · всички експорти', style: { fontSize: '28px', fontWeight: 800 } }));
  const bands = [];
  const months = ['юли', 'август', 'септември', 'октомври'];
  months.forEach((m, i) => {
    const b = h('div', { style: { position: 'absolute', left: '26px', right: '26px', top: (74 + i * 64) + 'px', height: '52px', display: 'flex', alignItems: 'center', gap: '16px' } });
    b.append(h('div', { text: m, style: { width: '140px', fontSize: '23px', fontWeight: 700, color: i === 3 ? 'var(--acc-ink)' : 'var(--ink2)' } }));
    for (let k = 0; k < 3; k++) b.append(h('div', { style: { flex: 1, height: '14px', borderRadius: '7px', background: i === 3 ? 'rgba(250,157,19,.7)' : 'rgba(23,17,31,.18)' } }));
    tbl.append(b); gsap.set(b, { opacity: 0, x: -30 });
    bands.push(b);
  });
  gsap.set(tbl, { opacity: 0, y: 30 });

  // slides: snapshot vs link
  const SW = 760, SH = 390;
  function slideCard(x, title, tagText) {
    const e = C.add(h('div.card', { x, y: 550, w: SW, h: SH, style: { background: 'var(--card)', borderRadius: '18px' } }));
    e.append(h('div', { x: 26, y: 18, html: `<span style="color:var(--ink3);font-weight:800">PowerPoint · </span>${title}`, style: { fontSize: '25px', fontWeight: 800 } }));
    const tg = h('span.tag', { text: tagText, style: { position: 'absolute', right: '22px', top: '14px' } });
    e.append(tg);
    gsap.set(e, { opacity: 0, y: 40 }); gsap.set(tg, { opacity: 0, scale: 0.6 });
    return { e, tg };
  }
  const snap = slideCard(160, 'Моментна снимка', 'не се обновява');
  const link = slideCard(1000, 'Връзка · Paste Link', 'обновява се ✓');
  snap.tg.style.background = 'var(--card2)'; snap.tg.style.color = 'var(--ink2)';
  const CSC = 0.47;
  // static copy of the chart for the snapshot slide
  const mini = s('svg', { width: CT.CWD * CSC, height: CT.CHT * CSC, viewBox: `0 0 ${CT.CWD} ${CT.CHT}`, style: 'position:absolute;left:14px;top:70px;overflow:visible' });
  const X = CT.X, Y = CT.Y;
  mini.append(
    s('line', { x1: X(0), x2: X(16), y1: Y(1), y2: Y(1), stroke: 'rgba(23,17,31,.45)', 'stroke-width': 2.5 }),
    s('path', { d: CT.area(CT.gamAct), fill: 'rgba(250,157,19,.18)' }),
    s('path.ln-plan', { d: CT.pathOf([[0, 0], [16, 1]]), 'stroke-dasharray': '14 14', 'stroke-linecap': 'butt' }),
    s('path.ln-act', { d: CT.pathOf(CT.gamAct) }),
    s('line', { x1: X(13), x2: X(13), y1: 20, y2: 570, stroke: K.C.acc, 'stroke-width': 3 }));
  snap.e.append(mini);
  const stale = h('div', { x: 0, y: 0, w: SW, h: SH, style: { background: 'rgba(246,244,248,.62)', borderRadius: '18px' } });
  snap.e.append(stale); gsap.set(stale, { opacity: 0 });
  const pulse = s('path', { d: 'M 1410 512 L 1410 546', stroke: K.C.acc, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' });
  cSvg.append(pulse); gsap.set(pulse, { drawSVG: '0%' });

  const w14 = 1.195;
  const act14 = CT.gamAct.concat([[14, w14]]);
  step(C, 'connect-folder', 'Три експорта → папка → Power Query → една таблица.', t => {
    camTo(t, center(C), 0, { dur: 2.3, dip: 0.82, tilt: -1 });
    railTo(t, C, 0, 2.3);
    t.to([CT.diff, CT.good, CT.bad, CT.badStrike, CT.fbLabel, CT.colCard, ...CT.colLegend, ...CT.chips.map(c => c.c)], { opacity: 0, duration: 0.4 }, 0);
    // the chart shrinks onto the linked slide
    t.to(CT.chart, { x: C.x + 1000 + 14, y: C.y + 550 + 66, scale: CSC, duration: 2.3, ease: 'expo.inOut' }, 0);
    t.to(link.e, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.7);
    t.to(snap.e, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.9);
    t.to(cLabel, { opacity: 1, duration: 0.6 }, 1.6);
    t.to(folder, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 1.8);
    files.forEach((f, i) => { t.to(f, { opacity: 1, duration: 0.2 }, 2.1 + i * 0.2); t.to(f, { y: 20, duration: 0.8, ease: 'bounce.out' }, 2.1 + i * 0.2); });
    t.to(a1, { drawSVG: '100%', duration: 0.4 }, 2.9);
    t.to(pq, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 3.0);
    t.to(a2, { drawSVG: '100%', duration: 0.4 }, 3.3);
    t.to(tbl, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 3.4);
    bands.slice(0, 3).forEach((b, i) => t.to(b, { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' }, 3.6 + i * 0.12));
  });

  step(C, 'connect-refresh', 'Нов експорт в папката → Refresh.', t => {
    t.to(octF, { opacity: 1, duration: 0.2 }, 0);
    t.to(octF, { y: 20, x: 0, duration: 0.9, ease: 'bounce.out' }, 0);
    t.to(files[2], { x: -40, rotation: -6, duration: 0.5 }, 0.3);
    t.to(files[2].lastChild, { opacity: 0, duration: 0.3 }, 0.3);
    t.to([refresh, refLbl], { opacity: 1, duration: 0.3 }, 0.8);
    t.to(refresh, { rotation: 360, duration: 1.0, ease: 'power2.inOut' }, 0.9);
    t.to(bands[3], { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }, 1.7);
  });

  step(C, 'connect-link', 'Връзката се обновява, снимката — не.', t => {
    t.to(pulse, { drawSVG: '100%', duration: 0.5 }, 0);
    t.to(CT.actP, { morphSVG: CT.pathOf(act14), duration: 1.2, ease: 'expo.inOut' }, 0.4);
    t.to(CT.areaP, { morphSVG: CT.area(act14), duration: 1.2, ease: 'expo.inOut' }, 0.4);
    t.to(CT.fcP, { morphSVG: CT.pathOf([[14, w14], [16, 1.34]]), duration: 1.2, ease: 'expo.inOut' }, 0.4);
    t.to(CT.todayLn, { attr: { x1: X(14), x2: X(14) }, duration: 1.2, ease: 'expo.inOut' }, 0.4);
    t.to(CT.lblToday, { x: X(14) - X(13), duration: 1.2, ease: 'expo.inOut' }, 0.4);
    t.to(link.tg, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.5)' }, 1.4);
    t.to(stale, { opacity: 1, duration: 0.6 }, 1.6);
    t.to(snap.tg, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.5)' }, 1.7);
  });

  /* =================== AUTOMATION =================== */
  const A = scene('auto', 4800, 4800, 'auto');
  const rules = A.add(h('div.card', { x: 160, y: 170, w: 780, h: 640, style: { background: 'var(--card)', overflow: 'hidden' } }));
  rules.append(h('div', { x: 0, y: 0, w: 780, h: 70, style: { background: 'var(--card2)', borderBottom: '1.5px solid var(--line)' } },
    h('span.tag', { text: '.Rules', style: { position: 'absolute', left: '24px', top: '16px', fontSize: '24px' } }),
    h('div.small.dim', { text: 'лист в Proekt_Demo.xlsx', style: { position: 'absolute', left: '150px', top: '18px', fontSize: '23px' } })));
  const ruleTexts = ['Бюджетите са в часове.', 'Броим само фактурираните часове.', 'Всички изчисления с формули.', 'Ставките винаги от таблица Екип.', 'Не променяй таблица Часове.'];
  const ruleChars = ruleTexts.map((r, i) => {
    rules.append(h('div', { x: 0, y: 70 + i * 90, w: 64, h: 90, text: String(i + 1), style: { lineHeight: '90px', textAlign: 'center', fontSize: '22px', fontWeight: 700, color: 'var(--ink3)', borderRight: '1.5px solid var(--line)', borderBottom: '1.5px solid var(--line)' } }));
    const c = h('div', { x: 64, y: 70 + i * 90, w: 716, h: 90, text: r, style: { lineHeight: '90px', padding: '0 26px', fontSize: '31px', fontWeight: 600, borderBottom: '1.5px solid var(--line)', whiteSpace: 'nowrap' } });
    rules.append(c);
    return splitChars(c);
  });
  const extraRow = h('div', { x: 64, y: 70 + 5 * 90, w: 716, h: 90, text: '', style: { lineHeight: '90px', padding: '0 26px', fontSize: '29px', fontWeight: 700, color: 'var(--acc-ink)', borderBottom: '1.5px solid var(--line)', whiteSpace: 'nowrap' } });
  rules.append(extraRow);
  gsap.set(rules, { opacity: 0 });
  const rulesNote = A.add(h('div.small.dim', { x: 160, y: 836, w: 780, html: 'Живеят във файла → <b style="color:var(--ink)">важат за всеки в екипа</b>' }));
  gsap.set(rulesNote, { opacity: 0, y: 16 });
  // skill card
  const skill = A.add(h('div.card', { x: 1040, y: 170, w: 720, style: { padding: '30px 34px', borderColor: 'rgba(250,157,19,.6)' } }));
  const gearImg = A.add(K.img('gear', 1640, 130, 130, { from: -60 }));
  skill.append(h('span.tag', { text: 'Умение' }), h('div', { text: 'Седмичен бърнъп', style: { fontSize: '46px', fontWeight: 800, letterSpacing: '-0.02em', margin: '12px 0 10px' } }));
  const skillSteps = ['Обнови листа Бърнъп и прогнозите', 'Отбележи проектите с прогноза над 100%', 'Напиши 3 основни риска', 'Чернова на имейл до клиента на английски'].map((t, i) => {
    const r = h('div', { html: `<span class="acc" style="font-weight:800">${i + 1}</span>&nbsp;&nbsp;${t}`, style: { fontSize: '28px', fontWeight: 600, padding: '12px 0', borderTop: '1.5px solid var(--line)' } });
    skill.append(r); gsap.set(r, { opacity: 0, x: -20 }); return r;
  });
  gsap.set(skill, { opacity: 0, y: 40 });
  // weekly cycle
  const RC = { x: 1400, y: 520 }, RR = 280;
  const aSvg = A.add(svgBox(0, 0, 1920, 1080));
  const ringP = s('path', { d: `M ${RC.x} ${RC.y - RR} A ${RR} ${RR} 0 1 1 ${RC.x - 0.01} ${RC.y - RR}`, stroke: 'rgba(23,17,31,.25)', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '3 12', 'stroke-linecap': 'round' });
  const runner = s('circle', { r: 14, fill: K.C.acc, cx: RC.x, cy: RC.y - RR });
  aSvg.append(ringP, runner);
  gsap.set(ringP, { drawSVG: '0%' }); gsap.set(runner, { opacity: 0 });
  const cycle = ['Нов експорт', 'Refresh', 'Умение', 'Презентация', 'Проверка'];
  const cyc = cycle.map((n, i) => {
    const a = -90 + i * 72, r = a * Math.PI / 180;
    const x = RC.x + Math.cos(r) * RR, y = RC.y + Math.sin(r) * RR;
    const e = A.add(h('div.pill', { x: 0, y: 0, text: n, style: { fontSize: '28px', background: i === 4 ? 'var(--acc)' : 'var(--card)', color: i === 4 ? K.C.ink : 'var(--ink)', borderColor: i === 4 ? 'var(--acc)' : 'var(--line2)' } }));
    gsap.set(e, { x, y, xPercent: -50, yPercent: -50, scale: 0 });
    return { e, x, y };
  });
  const ringMid = A.add(h('div', { x: RC.x - 200, y: RC.y - 70, w: 400, style: { textAlign: 'center' } },
    h('div', { text: 'Ръчно остават', style: { fontSize: '26px', fontWeight: 700, color: 'var(--ink2)' } }),
    h('div', { html: '<b class="acc">проверката</b><br>и решението', style: { fontSize: '38px', fontWeight: 800, lineHeight: 1.15, marginTop: '4px' } })));
  gsap.set(ringMid, { opacity: 0, scale: 0.8 });

  step(A, 'auto-rules', 'Правилата живеят във файла.', t => {
    camTo(t, center(A), 0, { dur: 2.2, dip: 0.85, tilt: 1 });
    railTo(t, A, 0, 2.2);
    // the combined table becomes the .Rules sheet
    const dx = A.x - C.x;
    t.to(bands, { opacity: 0, duration: 0.3 }, 0);
    t.to(tbl.firstChild, { opacity: 0, duration: 0.3 }, 0);
    t.to(tbl, { left: dx + 160, top: 170, width: 780, height: 640, duration: 2.0, ease: 'expo.inOut' }, 0.1);
    t.set(tbl, { opacity: 0 }, 2.1);
    t.set(rules, { opacity: 1 }, 2.1);
    let at = 2.2;
    ruleChars.forEach(ch => { at += type(t, ch, at, 60) + 0.1; });
    t.to(rulesNote, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 2.4);
  }, { keep: ['connect'] });

  step(A, 'auto-skill', 'Умението: целият седмичен процес.', t => {
    K.pop(t, gearImg, 0.3, { dur: 1.4 });
    t.to(skill, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0);
    skillSteps.forEach((r, i) => t.to(r, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }, 0.3 + i * 0.15));
  });

  step(A, 'auto-cycle', 'Седмичният цикъл. Проверката остава при вас.', t => {
    t.to(gearImg, { rotation: 180, scale: 0.2, opacity: 0, duration: 0.9, ease: 'power3.in' }, 0);
    t.to(skill, { x: cyc[2].x - 1040 - 360, y: cyc[2].y - 170 - 150, scale: 0.12, opacity: 0, duration: 1.0, ease: 'expo.inOut' }, 0);
    t.to(ringP, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut' }, 0.3);
    cyc.forEach((c, i) => t.to(c.e, { scale: 1, duration: 0.7, ease: 'back.out(2)' }, 0.5 + i * 0.12));
    t.to(runner, { opacity: 1, duration: 0.2 }, 1.4);
    const len = ringP.getTotalLength(), prog = { v: 0 };
    t.to(prog, { v: 0.8, duration: 2.2, ease: 'power1.inOut', onUpdate: () => { const p = ringP.getPointAtLength(prog.v * len); runner.setAttribute('cx', p.x); runner.setAttribute('cy', p.y); } }, 1.4);
    t.to(cyc[4].e, { scale: 1.15, duration: 0.5, ease: 'back.out(3)' }, 3.5);
    t.to(ringMid, { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' }, 3.6);
  });

  /* =================== BILINGUAL =================== */
  const B = scene('bilingual', 2400, 4800, 'bilingual');
  function bubble(y, tagText, text) {
    const e = B.add(h('div.prompt', { x: 160, y, w: 700, style: { fontSize: '32px' } },
      h('span.tag', { text: tagText, style: { position: 'absolute', left: '34px', top: '-18px' } }),
      h('div', { html: text })));
    gsap.set(e, { opacity: 0, x: -40 });
    return e;
  }
  const bg1 = bubble(200, 'Промпт на български', 'Направи слайд Summary <b>на английски</b> за клиента по данните от <span class="acc">/Proekt_Demo.xlsx</span>.');
  const bg2 = bubble(610, 'Prompt in English', 'Which projects will exceed budget at the current <span class="term2">burn rate</span>?');
  const arrows = [330, 730].map(y => { const a = B.add(h('div.h2', { x: 890, y: y - 40, w: 80, text: '→', style: { color: 'var(--acc-ink)', textAlign: 'center' } })); gsap.set(a, { opacity: 0, x: -20 }); return a; });
  const en = B.add(h('div.card', { x: 1000, y: 160, w: 760, h: 360, style: { padding: '30px 36px', background: 'var(--card)', color: 'var(--ink)' } },
    h('div', { text: 'Summary', style: { fontSize: '48px', fontWeight: 800, letterSpacing: '-0.02em' } }),
    h('div', { html: '• Gamma is over budget: 1,660 h used of 1,480 h.<br>• <span class="term1">Forecast at completion</span>: ~134%.<br>• Beta: 82% spent, forecast ~112%.', style: { fontSize: '29px', fontWeight: 600, lineHeight: 1.55, marginTop: '14px' } })));
  const bgT = B.add(h('div.card', { x: 1000, y: 580, w: 760, style: { padding: '26px 32px' } }));
  [['Проект', 'Изразходвано', 'Прогноза', 1], ['Гама', '112%', '~134%'], ['Бета', '82%', '~112%'], ['Алфа', '61%', '91%']].forEach(([a, b, c, hd], i) => {
    bgT.append(h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 220px 200px', padding: '10px 0', fontSize: '29px', fontWeight: hd ? 800 : 600, color: hd ? 'var(--ink3)' : 'var(--ink)', borderTop: i > 1 ? '1.5px solid var(--line)' : 'none' } },
      h('div', a), h('div', { text: b, style: { textAlign: 'right' } }), h('div', { text: c, style: { textAlign: 'right', color: !hd && i < 3 ? 'var(--acc-ink)' : undefined, fontWeight: !hd && i < 3 ? 800 : undefined } })));
  });
  gsap.set([en, bgT], { opacity: 0, x: 40 });
  const rulesMini = B.add(h('div.card', { x: 1000, y: 880, w: 760, style: { padding: '14px 22px', display: 'flex', gap: '14px', alignItems: 'center', fontSize: '25px', fontWeight: 700 } },
    h('span.tag', { text: '.Rules' }), h('span.dim', { text: 'термини:' })));
  gsap.set(rulesMini, { opacity: 0, y: 20 });
  const termChips = ['burn rate', 'forecast at completion'].map(tx => { const c = h('span', { text: tx, style: { padding: '4px 14px', borderRadius: '10px', background: 'rgba(250,157,19,.2)', color: 'var(--acc-ink)' } }); rulesMini.append(c); gsap.set(c, { opacity: 0, scale: 0.5 }); return c; });
  const term1 = en.querySelector('.term1'), term2 = bg2.querySelector('.term2');

  step(B, 'bi-en', 'Промпт на български → слайд на английски.', t => {
    camTo(t, center(B), 0, { dur: 2.2, dip: 0.85, tilt: -1 });
    railTo(t, B, 0, 2.2);
    t.to(bg1, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 1.0);
    t.to(arrows[0], { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' }, 1.6);
    t.to(en, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 1.8);
  });
  step(B, 'bi-bg', 'Английски промпт → българска таблица.', t => {
    t.to(bg2, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 0);
    t.to(arrows[1], { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' }, 0.6);
    t.to(bgT, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 0.8);
  });
  step(B, 'bi-terms', 'Термините — в правилата на файла.', t => {
    t.to([term1, term2], { backgroundColor: 'rgba(250,157,19,.3)', duration: 0.4 }, 0);
    t.to(rulesMini, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.3);
    termChips.forEach((c, i) => t.to(c, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.5)' }, 0.8 + i * 0.25));
  });

  /* =================== TOKENS =================== */
  const T = scene('tokens', 0, 4800, 'tokens');
  const tTitle = T.add(h('div.h2', { x: 160, y: 110, w: 1600, html: 'В Excel и PowerPoint <span class="acc">няма брояч на токени</span>' }));
  const tTitleW = maskWords(tTitle);
  const tiers = [
    ['Бизнес лиценз', 'Фиксирана цена', 'на потребител, с ограничения за честна употреба'],
    ['Отделно таксувани услуги', 'Copilot Credits', 'следи ги администраторът: admin center → Copilot → Cost Management. Може да слага лимити.'],
    ['Лични планове', 'AI кредити', 'Microsoft акаунт → Services & subscriptions']
  ].map(([a, b, c], i) => {
    const e = T.add(h('div.card', { x: 160 + i * 545, y: 260, w: 510, h: 500, style: { padding: '36px 36px' } },
      h('span.tag', { text: a }),
      h('div', { text: b, style: { fontSize: '50px', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '26px', lineHeight: 1.05 } }),
      h('div', { text: c, style: { fontSize: '28px', fontWeight: 500, lineHeight: 1.4, marginTop: '18px', color: 'var(--ink2)' } })));
    gsap.set(e, { opacity: 0, y: 60, rotationY: -25, transformPerspective: 1200 });
    return e;
  });
  const tierImgs = ['office_building', 'coin', 'bust_in_silhouette'].map((n, i) => T.add(K.img(n, 160 + i * 545 + 360, 620, 124, { from: i % 2 ? 14 : -14 })));
  const tip = T.add(h('div.card', { x: 160, y: 800, w: 1600, style: { padding: '26px 36px', display: 'flex', gap: '20px', alignItems: 'center', borderColor: 'rgba(250,157,19,.6)' } },
    h('span.tag', { text: 'Практически' }),
    h('div', { html: 'Кратки, конкретни промптове + именувани таблици = <b class="acc">по-малко време и по-малко лимит</b>', style: { fontSize: '31px', fontWeight: 600 } })));
  gsap.set(tip, { opacity: 0, y: 30 });

  step(T, 'tokens-tiers', 'Как се таксува.', t => {
    camTo(t, center(T), 0, { dur: 2.2, dip: 0.85, tilt: 1 });
    railTo(t, T, 0, 2.2);
    rise(t, tTitleW, 0.9);
    tiers.forEach((e, i) => t.to(e, { opacity: 1, y: 0, rotationY: 0, duration: 1.1, ease: 'expo.out' }, 1.2 + i * 0.18));
    tierImgs.forEach((e, i) => K.pop(t, e, 1.6 + i * 0.18));
  });
  step(T, 'tokens-tip', 'Кратки промптове и именувани таблици.', t => {
    t.to(tip, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0);
  });
});
