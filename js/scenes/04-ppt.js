/* 5.3 PowerPoint → 5.4 Excel → PowerPoint */
K.def(function () {
  const { h, s, svgBox, scene, step, camTo, center, maskWords, rise, railTo, count } = K;
  const EX = K.shared.excel;

  /* =================== POWERPOINT =================== */
  const P = scene('ppt', 0, 3200, 'ppt');
  const pill = P.add(h('div.pill', { x: 150, y: 70, style: { fontSize: '27px', fontWeight: 600 } },
    h('span.tag', { text: 'PowerPoint' }),
    h('span', { text: '„Направи статус презентация за клиента от 5 слайда…“', style: { color: 'var(--ink2)' } }),
    h('span', { text: '/Proekt_Demo.xlsx', style: { background: 'rgba(250,157,19,.2)', color: 'var(--acc-ink)', padding: '2px 12px', borderRadius: '10px', fontWeight: 800 } })));
  gsap.set(pill, { opacity: 0, y: -20 });

  const TW = 178, TH = 100, TG = 14, TX = 150, TY0 = 180;
  const ty = i => TY0 + i * (TH + TG);
  const thumbNames = ['Общ статус', 'Бюджет по проект', 'Натовареност по екип', 'Три основни риска', 'Следващи стъпки'];
  function thumb(name, i, chart) {
    const t = P.add(h('div.slide', { x: TX, y: ty(i), w: TW, h: TH, style: { borderRadius: '8px', boxShadow: 'none' } }));
    t.append(h('div', { x: 12, y: 10, text: name, style: { fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap' } }));
    if (chart) [0.8, 0.9, 0.7, 0.45].forEach((v, k) => t.append(h('div', { x: 12, y: 36 + k * 15, w: 120 * v, h: 10, style: { borderRadius: '3px', background: k === 3 ? K.C.acc : K.C.ink } })));
    else [0.9, 0.7, 0.8].forEach((v, k) => t.append(h('div', { x: 12, y: 40 + k * 16, w: 150 * v, h: 7, style: { borderRadius: '4px', background: 'rgba(23,17,31,.2)' } })));
    const num = P.add(h('div', { x: TX - 44, y: ty(i) + 34, w: 30, text: String(i + 1), style: { fontSize: '22px', fontWeight: 800, color: 'var(--ink3)', textAlign: 'right' } }));
    gsap.set([t, num], { opacity: 0 });
    return { t, num };
  }
  const thumbs = thumbNames.map((n, i) => thumb(n, i));
  const newThumb = thumb('Графика: натовареност', 3, true);
  const sel = P.add(h('div', { x: TX - 6, y: ty(0) - 6, w: TW + 12, h: TH + 12, style: { border: '4px solid #FA9D13', borderRadius: '12px' } }));
  gsap.set(sel, { opacity: 0 });

  // main slide
  const MX = 400, MY = 170, MW = 1370, MH = 770;
  const main = P.add(h('div.slide', { x: MX, y: MY, w: MW, h: MH }));
  gsap.set(main, { x: TX - MX, y: TY0 - MY, scale: TW / MW, transformOrigin: '0% 0%', opacity: 0 });
  const content = {};
  function slideGroup(key, titleText) {
    const g = h('div', { x: 0, y: 0, w: MW, h: MH });
    g.append(h('div', { x: 90, y: 70, text: titleText, style: { fontSize: '60px', fontWeight: 800, letterSpacing: '-0.03em' } }));
    main.append(g); gsap.set(g, { opacity: 0, y: 40 });
    content[key] = g; return g;
  }
  // 1 status
  const g1 = slideGroup('status', 'Общ статус · седмица 39');
  [['Алфа', 'в срок', K.C.ink], ['Бета', 'внимание', '#9A5A00'], ['Гама', 'над бюджета', K.C.acc]].forEach(([p, st, c], i) => {
    g1.append(h('div', { x: 90 + i * 410, y: 250, w: 370, h: 300, style: { borderRadius: '22px', background: 'rgba(23,17,31,.06)', padding: '40px' } },
      h('div', { style: { width: '26px', height: '26px', borderRadius: '50%', background: c } }),
      h('div', { text: p, style: { fontSize: '56px', fontWeight: 800, marginTop: '30px' } }),
      h('div', { text: st, style: { fontSize: '32px', fontWeight: 600, color: c === K.C.ink ? 'rgba(23,17,31,.6)' : c } })));
  });
  // 2 budget
  const g2 = slideGroup('budget', 'Бюджет по проект');
  [['Алфа', 61], ['Бета', 82], ['Гама', 112]].forEach(([p, v], i) => {
    g2.append(h('div', { x: 90, y: 230 + i * 110, text: p, style: { fontSize: '36px', fontWeight: 700 } }));
    g2.append(h('div', { x: 290, y: 236 + i * 110, w: v * 6, h: 50, style: { borderRadius: '8px', background: v > 100 ? K.C.acc : K.C.ink } }));
    g2.append(h('div', { x: 290 + v * 6 + 20, y: 232 + i * 110, text: v + '%', style: { fontSize: '36px', fontWeight: 800 } }));
  });
  const g2text = h('div', { x: 90, y: 590, style: { fontSize: '40px', fontWeight: 600 } });
  g2text.innerHTML = 'Гама: изразходвани <b id="ppt83">1 660 ч</b> от 1 480 ч';
  g2.append(g2text);
  // 3 load bullets (7 → 4)
  const g3 = slideGroup('load', 'Натовареност по екип');
  const bullets = ['Разработка: 81%, над плана', 'Анализ: 88%, пълен капацитет', 'Дизайн: 74%', 'Тестване: 45%, свободен капацитет', 'Георги Петров: 46–52 ч седмично', 'Отпуски през октомври', 'Нови назначения: няма'].map((b, i) => {
    const e = h('div', { x: 90, y: 200 + i * 72, text: '• ' + b, style: { fontSize: '38px', fontWeight: 600, whiteSpace: 'nowrap' } });
    g3.append(e); return e;
  });
  const cut = h('div', { x: MW - 330, y: 70, text: '7 → 4 точки', style: { fontSize: '30px', fontWeight: 800, padding: '10px 22px', borderRadius: '12px', background: K.C.acc, color: K.C.ink } });
  g3.append(cut); gsap.set(cut, { opacity: 0, scale: 0.6 });
  // 4 chart
  const g4 = slideGroup('chart', 'Натовареност по екип');
  const cBars = [['Разработка', 81], ['Анализ', 88], ['Дизайн', 74], ['Тестване', 45]].map(([n, v], i) => {
    g4.append(h('div', { x: 90, y: 230 + i * 110, text: n, style: { fontSize: '34px', fontWeight: 700 } }));
    const b = h('div', { x: 400, y: 232 + i * 110, w: v * 8, h: 56, style: { borderRadius: '8px', background: v < 70 ? K.C.acc : K.C.ink } });
    g4.append(b); gsap.set(b, { scaleX: 0, transformOrigin: '0% 50%' });
    return b;
  });
  const editTag = h('div', { x: MW - 430, y: 70, text: 'редактируема графика', style: { fontSize: '26px', fontWeight: 800, padding: '10px 20px', borderRadius: '12px', border: '3px solid #17111F' } });
  g4.append(editTag); gsap.set(editTag, { opacity: 0 });

  function show(t, key, prev, at) {
    if (prev) t.to(content[prev], { opacity: 0, y: -40, duration: 0.45, ease: 'power2.in' }, at);
    t.to(content[key], { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, at + (prev ? 0.4 : 0));
  }
  const selTo = (t, i, at) => t.to(sel, { y: ty(i) - ty(0), duration: 0.7, ease: 'expo.inOut' }, at);

  step(P, 'ppt-arrive', 'PowerPoint: 5 слайда от Excel файла.', t => {
    camTo(t, center(P), 0, { dur: 2.3, dip: 0.8, tilt: -1 });
    railTo(t, P, 0, 2.3);
    // the four bars and the 70% line fly down and become the slide thumbnails
    const movers = EX.barEls.map(b => b.bar).concat([EX.th]);
    movers.forEach((m, i) => {
      t.set(m, { borderLeftWidth: 0 }, 0);
      t.to(m, { left: TX, top: 1600 + ty(i), width: TW, height: TH, scaleX: 1, scaleY: 1, borderRadius: 8, backgroundColor: K.C.card, duration: 1.9, ease: 'expo.inOut' }, 0.15 + i * 0.08);
    });
    t.to([...EX.lbls, ...EX.barEls.map(b => b.pct), EX.thL, EX.underL, EX.chartTitle], { opacity: 0, duration: 0.4 }, 0);
    t.set(movers, { opacity: 0 }, 2.5);
    thumbs.forEach(({ t: th, num }, i) => t.set([th, num], { opacity: 1 }, 2.5));
    t.to(pill, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 2.2);
    t.to(sel, { opacity: 1, duration: 0.3 }, 2.6);
    t.set(main, { opacity: 1 }, 2.6);
    t.to(main, { x: 0, y: 0, scale: 1, duration: 1.3, ease: 'expo.inOut' }, 2.6);
    show(t, 'status', null, 3.6);
  }, { keep: ['plan'] });

  step(P, 'ppt-add', '„Добави слайд с графиката.“', t => {
    [3, 4].forEach(i => { t.to([thumbs[i].t], { y: TH + TG, duration: 0.8, ease: 'expo.inOut' }, 0); t.to(thumbs[i].num, { y: TH + TG, duration: 0.8, ease: 'expo.inOut' }, 0); });
    t.set(thumbs[3].num, { textContent: '5' }, 0.4); t.set(thumbs[4].num, { textContent: '6' }, 0.4);
    t.set(newThumb.num, { opacity: 1 }, 0.5);
    t.fromTo(newThumb.t, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.8)', immediateRender: false }, 0.5);
    selTo(t, 3, 0.7);
    show(t, 'chart', 'status', 0.9);
    cBars.forEach((b, i) => t.to(b, { scaleX: 1, duration: 1.0, ease: 'expo.out' }, 1.5 + i * 0.1));
    t.to(editTag, { opacity: 1, duration: 0.5 }, 2.2);
  });

  step(P, 'ppt-short', '„Направи слайд 3 по-кратък, максимум 4 точки.“', t => {
    selTo(t, 2, 0);
    show(t, 'load', 'chart', 0.2);
    t.to(cut, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.5)' }, 1.6);
    bullets.slice(4).forEach((b, i) => t.to(b, { x: 60, opacity: 0, duration: 0.5, ease: 'power2.in' }, 1.9 + i * 0.1));
    bullets.slice(0, 4).forEach((b, i) => t.to(b, { y: i * 30, scale: 1.12, transformOrigin: '0% 50%', duration: 0.9, ease: 'expo.inOut' }, 2.4));
  });

  // Excel cell card for the "numbers don't recalc" moment
  const xl = P.add(h('div.card', { x: 1200, y: 220, w: 540, style: { padding: '24px 30px', background: 'var(--card)', borderColor: 'rgba(250,157,19,.6)', boxShadow: '0 24px 60px rgba(23,17,31,.16)' } },
    h('div.label', { text: 'Excel · Проекти · Гама' }),
    h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '14px', marginTop: '6px' } },
      h('div', { text: '1 660', style: { fontSize: '76px', fontWeight: 800, letterSpacing: '-0.03em' } }),
      h('div', { text: 'ч', style: { fontSize: '40px', fontWeight: 700, color: 'var(--ink2)' } }))));
  const xlVal = xl.children[1].firstChild;
  gsap.set(xl, { opacity: 0, y: 60, rotation: 3 });
  const neq = P.add(h('div', { x: 0, y: 0, text: '≠', style: { fontSize: '64px', fontWeight: 800, color: K.C.accInk } }));
  gsap.set(neq, { opacity: 0, scale: 0.4 });
  const note = P.add(h('div.body', { x: 400, y: 950, w: 1370, html: 'Числата в текста <b class="acc">не се преизчисляват</b> → сверяваме с Excel.', style: { fontSize: '30px', textAlign: 'right' } }));
  gsap.set(note, { opacity: 0, y: 16 });

  step(P, 'ppt-numbers', 'Excel се сменя, слайдът — не. Сверяваме.', t => {
    selTo(t, 1, 0);
    show(t, 'budget', 'load', 0.2);
    t.to(xl, { opacity: 1, y: 0, rotation: 0, duration: 1.0, ease: 'expo.out' }, 1.2);
    t.to(xlVal, { color: K.C.accInk, duration: 0.3 }, 2.2);
    count(t, xlVal, 1660, 1684, 2.2, { dur: 1.0, fmt: K.fmtEUR });
    const b83 = main.querySelector('#ppt83');
    const nx = MX + g2text.offsetLeft + b83.offsetLeft + b83.offsetWidth / 2 - 18, ny = MY + 590 - 80;
    t.set(neq, { left: nx, top: ny }, 0);
    t.to(neq, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(3)' }, 3.3);
    t.to(b83, { color: K.C.accInk, duration: 0.3 }, 3.3);
    t.to(note, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 3.6);
  });

  /* =================== EXCEL → POWERPOINT =================== */
  const C = scene('chain', 2400, 3200, 'chain');
  const cTitle = C.add(h('div.h2', { x: 160, y: 110, html: 'Excel е <span class="acc">единственият източник</span> на числата' }));
  const cTitleW = maskWords(cTitle);
  function appTile(x, letter, name, sub) {
    const e = C.add(h('div.card', { x, y: 290, w: 330, h: 300, style: { display: 'grid', placeItems: 'center', alignContent: 'center', textAlign: 'center' } },
      h('div', { text: letter, style: { fontSize: '120px', fontWeight: 800, color: 'var(--acc-ink)', lineHeight: 1 } }),
      h('div', { text: name, style: { fontSize: '40px', fontWeight: 800, marginTop: '10px' } }),
      h('div.small.dim', { text: sub, style: { fontSize: '24px' } })));
    gsap.set(e, { opacity: 0 });
    return e;
  }
  const xTile = appTile(360, 'X', 'Excel', 'източник');
  const pTile = appTile(1230, 'P', 'PowerPoint', 'презентация');
  const cSvg = C.add(svgBox(0, 0, 1920, 1080));
  const arrow = s('path', { d: 'M 720 440 L 1200 440', stroke: K.C.acc, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' });
  const aHead = s('path', { d: 'M 1170 405 L 1206 440 L 1170 475', stroke: K.C.acc, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  cSvg.append(arrow, aHead);
  gsap.set([arrow, aHead], { drawSVG: '0%' });
  function modeRow(y, icon, text, extra) {
    const r = C.add(h('div', { x: 360, y, w: 1200, style: { display: 'flex', alignItems: 'center', gap: '30px' } }));
    r.append(h('div', { style: { flex: 'none', width: '88px', height: '88px', borderRadius: '22px', background: 'var(--card)', border: '1.5px solid var(--line2)', display: 'grid', placeItems: 'center' } }, K.icon(icon, 64)));
    r.append(h('div.body', { html: text }));
    if (extra) r.append(h('span.tag', { text: extra }));
    gsap.set(r, { opacity: 0, x: -40 });
    return r;
  }
  const row1 = modeRow(670, 'camera_with_flash', 'Copilot посочва файла → <b>моментна снимка</b>');
  const row2 = modeRow(790, 'link', 'Поставена като връзка → <b class="acc">обновява се сама</b>', 'част 6');

  step(C, 'chain-source', 'Excel е източникът, PowerPoint взима от него.', t => {
    camTo(t, center(C), 0, { dur: 2.2, dip: 0.8, tilt: 1 });
    railTo(t, C, 0, 2.2);
    // main slide shrinks into the PowerPoint tile, the Excel card into the Excel tile
    const dx = C.x - P.x;
    t.to(main, { x: dx + 1230 - MX, y: 290 - MY, scale: 330 / MW, duration: 2.0, ease: 'expo.inOut' }, 0);
    t.to(xl, { x: dx + 360 - 1200, y: 290 - 220, scale: 330 / 540, duration: 2.0, ease: 'expo.inOut' }, 0.1);
    t.to([note, neq, pill], { opacity: 0, duration: 0.4 }, 0);
    t.to([xl, main], { opacity: 0, duration: 0.4 }, 1.8);
    t.to([xTile, pTile], { opacity: 1, duration: 0.4 }, 1.8);
    rise(t, cTitleW, 1.2);
    t.to(arrow, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' }, 2.2);
    t.to(aHead, { drawSVG: '100%', duration: 0.4, ease: 'power2.out' }, 2.9);
  }, { keep: ['ppt'] });

  step(C, 'chain-modes', 'Моментна снимка или връзка.', t => {
    t.to(row1, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 0);
    t.to(row2, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 0.5);
  });

  K.shared.chain = { C, arrow, aHead, cSvg, xTile, pTile, row1, row2, cTitle };
});
