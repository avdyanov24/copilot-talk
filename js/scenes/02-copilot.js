/* Какво е Copilot → Как да започнете → Ефективни промптове */
K.def(function () {
  const { h, s, svgBox, scene, step, camTo, center, maskWords, rise, splitChars, type, railTo } = K;
  const I = K.intro_;
  K.shared = K.shared || {};

  /* =================== WHAT IS COPILOT =================== */
  const C = scene('copilot', 9600, 0, 'copilot');
  const title = C.add(h('div.h2', { x: 160, y: 110, text: 'Microsoft 365 Copilot' }));
  const titleW = maskWords(title);
  const CX = 760, CY = 560, R = 170;
  const core = C.add(h('div', { x: CX - R, y: CY - R, w: R * 2, h: R * 2, style: {
    borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFC870 0%, #FA9D13 55%, #D9780A 100%)',
    display: 'grid', placeItems: 'center', textAlign: 'center', color: K.C.ink, boxShadow: '0 0 120px rgba(250,157,19,.35)' } },
    h('div', {}, h('div', { text: 'Езиков модел', style: { fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em' } }),
      h('div', { text: 'OpenAI · Anthropic', style: { fontSize: '24px', fontWeight: 700, opacity: 0.7, marginTop: '6px' } }))));
  gsap.set(core, { scale: 0 });
  const coreTxt = core.firstChild;
  gsap.set(coreTxt, { opacity: 0 });

  // context ring
  const ring = C.add(h('div', { x: CX, y: CY, w: 0, h: 0 }));
  const ringSvg = svgBox(-400, -400, 800, 800); ring.append(ringSvg);
  const nodes = [['Файлове', 180, 'file_folder'], ['Имейли', -52, 'e-mail'], ['Срещи', 52, 'calendar']].map(([t, a, ic]) => {
    const rad = a * Math.PI / 180, r = 330;
    const x = Math.cos(rad) * r, y = Math.sin(rad) * r;
    const ln = s('line', { x1: 400 + Math.cos(rad) * (R + 10), y1: 400 + Math.sin(rad) * (R + 10), x2: 400 + x * 0.78, y2: 400 + y * 0.78, stroke: 'rgba(23,17,31,.35)', 'stroke-width': 3, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' });
    ringSvg.append(ln);
    const n = h('div.pill', { x: 0, y: 0, style: { fontSize: '32px', padding: '10px 26px 10px 14px' } }, K.icon(ic, 52), h('span', t));
    ring.append(n);
    gsap.set(n, { x: x, y: y, xPercent: -50, yPercent: -50, scale: 0 });
    gsap.set(ln, { drawSVG: '0%' });
    return { n, ln };
  });
  gsap.set(ring, { rotation: -70 });
  const ringLbl = C.add(h('div.small.dim', { x: 180, y: 860, w: 600, html: 'свързан с <b style="color:var(--ink)">вашите</b> файлове, имейли и срещи' }));
  gsap.set(ringLbl, { opacity: 0, y: 20 });

  // app tiles
  const appsLbl = C.add(h('div.label', { x: 1290, y: 200, text: 'Вграден в' }));
  gsap.set(appsLbl, { opacity: 0 });
  const apps = [['X', 'Excel'], ['P', 'PowerPoint'], ['O', 'Outlook'], ['T', 'Teams']].map(([l, n], i) => {
    const tile = C.add(h('div.tile', { x: 1290 + (i % 2) * 250, y: 250 + Math.floor(i / 2) * 190, w: 230, h: 170,
      style: { background: 'var(--card)', border: '1.5px solid var(--line2)', color: 'var(--ink)', alignContent: 'center' } },
      h('div', { text: l, style: { fontSize: '64px', lineHeight: 1, color: 'var(--acc-ink)' } }),
      h('div', { text: n, style: { fontSize: '24px', fontWeight: 700, marginTop: '8px', color: 'var(--ink2)' } })));
    gsap.set(tile, { scale: 0, rotation: -8 });
    return tile;
  });
  const lic = C.add(h('div.card', { x: 1290, y: 660, w: 480, style: { padding: '28px 32px', borderColor: 'rgba(250,157,19,.5)' } },
    h('span.tag', { text: 'Лиценз · от април 2026' }),
    h('div', { style: { fontSize: '29px', fontWeight: 700, lineHeight: 1.3, marginTop: '14px' }, text: 'Copilot в Excel и PowerPoint изисква Microsoft 365 Copilot.' }),
    h('div.dim', { style: { fontSize: '25px', fontWeight: 500, lineHeight: 1.35, marginTop: '10px' }, text: 'Без него: Copilot Chat, без работа във файловете.' })));
  gsap.set(lic, { y: 60, opacity: 0, rotationX: -40, transformPerspective: 900, transformOrigin: '50% 100%' });

  step(C, 'copilot-core', 'Езиков модел в сърцевината.', t => {
    camTo(t, center(C), 0, { dur: 2.2, dip: 0.8, tilt: 1.2 });
    railTo(t, C, 0, 2.2);
    const merge = I.groups.gen.concat(I.groups.agent);
    merge.forEach((d, i) => t.to(d, { x: C.x + CX + (Math.random() - 0.5) * 40, y: C.y + CY + (Math.random() - 0.5) * 40, scale: 1, opacity: 1, duration: 1.6, ease: 'expo.inOut' }, 0.1 + i * 0.012));
    t.to(I.checks, { scale: 0, duration: 0.3 }, 0);
    t.to(I.chain, { drawSVG: '0%', duration: 0.6 }, 0);
    t.to(merge, { scale: 0, duration: 0.3, ease: 'power2.in' }, 1.75);
    // the generative and agentic images are pulled into the core too
    [1, 2].forEach((k, j) => {
      const im = I.typeImgs[k], cx = [960, 1520][j];
      t.to(im, { x: (C.x - I.typesScene.x) + CX - cx, y: CY - 190, scale: 0.15, rotation: 90, duration: 1.6, ease: 'expo.inOut' }, 0.15 + j * 0.1);
      t.to(im, { opacity: 0, duration: 0.3 }, 1.5);
    });
    t.to(core, { scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.55)' }, 1.75);
    t.to(coreTxt, { opacity: 1, duration: 0.6 }, 2.1);
    rise(t, titleW, 1.4);
  });

  step(C, 'copilot-ring', 'Свързан с вашите файлове, имейли и срещи.', t => {
    t.to(ring, { rotation: 0, duration: 1.8, ease: 'expo.out' }, 0);
    nodes.forEach(({ n, ln }, i) => {
      t.to(n, { scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.6)' }, 0.1 + i * 0.15);
      t.to(ln, { drawSVG: '100%', duration: 0.9, ease: 'power2.out' }, 0.3 + i * 0.15);
    });
    // counter-rotate pills so the text lands upright
    nodes.forEach(({ n }) => { gsap.set(n, { rotation: 70 }); });
    t.to(ringLbl, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.8);
  });

  step(C, 'copilot-apps', 'Вграден в приложенията.', t => {
    t.to(appsLbl, { opacity: 1, duration: 0.6 }, 0);
    apps.forEach((a, i) => t.to(a, { scale: 1, rotation: 0, duration: 1.0, ease: 'back.out(1.7)' }, 0.1 + i * 0.12));
  });

  step(C, 'copilot-license', 'Лиценз от април 2026.', t => {
    t.to(lic, { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: 'expo.out' }, 0);
  });

  /* =================== HOW TO START =================== */
  const S = scene('start', 9600, 1600, 'start');
  const WX = 160, WY = 100, WW = 1600, WH = 820;
  const win = S.add(h('div.card', { x: WX, y: WY, w: WW, h: WH, style: { borderRadius: '24px', overflow: 'hidden', background: 'var(--card)' } }));
  // title bar
  const bar = h('div', { x: 0, y: 0, w: WW, h: 70, style: { borderBottom: '1.5px solid var(--line)', background: 'var(--card2)' } });
  [0, 1, 2].forEach(i => bar.append(h('div', { x: 28 + i * 30, y: 27, w: 16, h: 16, style: { borderRadius: '50%', background: 'rgba(23,17,31,.18)' } })));
  const fname = h('div', { x: 0, y: 0, w: WW, h: 70, style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', fontSize: '26px', fontWeight: 700 } },
    h('span', { text: 'Proekt_Demo.xlsx' }));
  const cloud = h('span.tag', { text: '☁ OneDrive · SharePoint', style: { fontSize: '20px' } });
  fname.append(cloud); bar.append(fname); win.append(bar);
  gsap.set(cloud, { opacity: 0, x: -20, scale: 0.8 });
  // ribbon
  const ribbon = h('div', { x: 0, y: 70, w: WW, h: 120, style: { borderBottom: '1.5px solid var(--line)' } });
  ['Начало', 'Вмъкване', 'Формули', 'Данни', 'Преглед'].forEach((t, i) => ribbon.append(h('div', { x: 36 + i * 150, y: 14, text: t, style: { fontSize: '21px', fontWeight: 700, color: i ? 'var(--ink3)' : 'var(--ink)' } })));
  [0, 1, 2, 3, 4, 5, 6].forEach(i => ribbon.append(h('div', { x: 36 + i * 110, y: 56, w: 90, h: 46, style: { borderRadius: '10px', background: 'rgba(23,17,31,.06)' } })));
  const btn = h('div', { x: WW - 250, y: 46, w: 210, h: 62, style: { borderRadius: '16px', background: '#fff', border: '1.5px solid rgba(23,17,31,.18)', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 20px', fontSize: '26px', fontWeight: 800 } },
    (() => { const i = document.createElement('img'); i.src = 'assets/copilot.svg'; i.alt = 'Copilot'; i.style.cssText = 'width:38px;height:34px;flex:none'; return i; })(),
    h('span', { text: 'Copilot' }));
  ribbon.append(btn); win.append(ribbon);
  // grid
  const grid = h('div', { x: 0, y: 190, w: 1040, h: WH - 190, style: {
    backgroundImage: 'linear-gradient(rgba(23,17,31,.07) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(23,17,31,.07) 1.5px, transparent 1.5px)',
    backgroundSize: '170px 56px' } });
  win.append(grid);
  // a few rows of real-looking data so the window doesn't read as empty
  [['Служител', 'Екип', 'Проект', 'Седмица', 'Часове', 'Факт.'],
   ['Георги Петров', 'Разработка', 'Гама', '07.09.2026', '48', '44'],
   ['Георги Петров', 'Разработка', 'Бета', '14.09.2026', '52', '50'],
   ['Мария Иванова', 'Анализ', 'Гама', '07.09.2026', '38', '36'],
   ['Иван Колев', 'Тестване', 'Бета', '14.09.2026', '18', '18'],
   ['Елена Димитрова', 'Дизайн', 'Алфа', '21.09.2026', '34', '30'],
   ['Петър Николов', 'Тестване', 'Гама', '21.09.2026', '20', '16']].forEach((row, r) => row.forEach((v, c) =>
    grid.append(h('div', { x: c * 170 + 14, y: r * 56 + 15, w: 150, text: v, style: { fontSize: '19px', fontWeight: r ? 500 : 800, color: r ? 'var(--ink2)' : 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textAlign: c > 3 ? 'right' : 'left' } }))));
  const editCells = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const e = h('div', { x: 170 * (c + 1), y: 56 * (r + 3), w: 170, h: 56, style: { background: 'rgba(250,157,19,.28)', borderRight: '1.5px solid rgba(250,157,19,.5)' } });
    grid.append(e); editCells.push(e);
  }
  gsap.set(editCells, { scaleY: 0, transformOrigin: '50% 0%' });
  const lock = h('div.card', { x: 330, y: 150, w: 380, style: { textAlign: 'center', padding: '24px 20px' } },
    K.icon('locked', 110),
    h('div.small', { text: 'файлът не се променя', style: { marginTop: '6px', fontWeight: 700 } }));
  grid.append(lock); gsap.set(lock, { opacity: 0, scale: 0.8 });
  // pane
  const PX = 1060, PW = WW - PX;
  const pane = h('div', { x: PX, y: 190, w: PW, h: WH - 190, style: { background: 'var(--card)', borderLeft: '1.5px solid var(--line)' } });
  win.append(pane);
  gsap.set(pane, { xPercent: 100 });
  pane.append(h('div', { x: 30, y: 24, text: 'Copilot', style: { fontSize: '30px', fontWeight: 800 } }));
  const seg = h('div', { x: 30, y: 84, w: PW - 60, h: 64, style: { borderRadius: '16px', background: 'rgba(23,17,31,.06)' } });
  const modes = ['Чат', 'Редакция', 'План'];
  const segW = (PW - 60) / 3;
  const ind = h('div', { x: 4, y: 4, w: segW - 8, h: 56, style: { borderRadius: '13px', background: 'var(--acc)' } });
  seg.append(ind);
  const modeLbls = modes.map((m, i) => { const l = h('div', { x: i * segW, y: 0, w: segW, h: 64, text: m, style: { display: 'grid', placeItems: 'center', fontSize: '25px', fontWeight: 800, color: 'var(--ink2)' } }); seg.append(l); return l; });
  pane.append(seg);
  gsap.set([seg], { opacity: 0, y: 20 });
  gsap.set(ind, { opacity: 0 });
  const descs = [
    ['Въпроси и отговори.', 'Не пипа файла.'],
    ['Работи директно', 'във файла.'],
    ['Първо показва стъпките', 'и чака одобрение.']
  ].map(([a, b], i) => {
    const d = h('div', { x: 30, y: 180, w: PW - 60 },
      h('div', { text: modes[i], style: { fontSize: '44px', fontWeight: 800, letterSpacing: '-0.02em' } }),
      h('div', { text: a, style: { fontSize: '29px', fontWeight: 500, marginTop: '10px', color: 'var(--ink2)' } }),
      h('div', { text: b, style: { fontSize: '29px', fontWeight: 500, color: 'var(--ink2)' } }));
    pane.append(d); gsap.set(d, { opacity: 0, y: 40 });
    return d;
  });
  const planList = h('div', { x: 30, y: 320, w: PW - 60 });
  ['1  Намери', '2  Провери', '3  Изведи'].forEach(t => planList.append(h('div', { text: t, style: { fontSize: '21px', fontWeight: 700, padding: '6px 16px', margin: '5px 0', borderRadius: '12px', background: 'rgba(23,17,31,.06)' } })));
  planList.append(h('div', { text: 'Одобри', style: { display: 'inline-block', marginTop: '6px', fontSize: '21px', fontWeight: 800, padding: '8px 20px', borderRadius: '12px', background: 'var(--acc)', color: K.C.ink } }));
  pane.append(planList); gsap.set(planList, { opacity: 0, y: 30 });
  // input + mention
  const input = h('div', { x: 30, y: WH - 190 - 100, w: PW - 60, h: 72, style: { borderRadius: '18px', border: '1.5px solid var(--line2)', background: 'var(--card)', display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: '28px', fontWeight: 600 } });
  const slash = h('span', { text: '/', style: { color: 'var(--acc-ink)', fontWeight: 800 } });
  const mchip = h('span', { text: 'Proekt_Demo.xlsx', style: { background: 'rgba(250,157,19,.2)', color: 'var(--acc-ink)', padding: '4px 12px', borderRadius: '10px', fontSize: '25px', fontWeight: 800 } });
  const ph = h('span', { text: 'Попитайте Copilot…', style: { color: 'var(--ink3)', fontWeight: 500 } });
  input.append(ph, slash, mchip);
  gsap.set([slash, mchip], { display: 'none' });
  pane.append(input);
  const menu = h('div', { x: 30, y: WH - 190 - 100 - 200, w: PW - 60, style: { borderRadius: '18px', background: 'var(--card)', border: '1.5px solid var(--line2)', padding: '10px' } });
  const files = ['Proekt_Demo.xlsx', 'Бюджети_2026.xlsx', 'Клиент_Статус.pptx'].map((f, i) => { const r = h('div', { text: f, style: { fontSize: '25px', fontWeight: 700, padding: '12px 16px', borderRadius: '12px', color: i ? 'var(--ink2)' : 'var(--ink)' } }); menu.append(r); return r; });
  pane.append(menu); gsap.set(menu, { opacity: 0, y: 20, scale: 0.96 });
  const mentionLbl = S.add(h('div.body', { x: WX, y: WY + WH + 12, w: WW, html: '<b class="acc">/</b> посочва конкретен файл', style: { textAlign: 'right' } }));
  gsap.set(mentionLbl, { opacity: 0 });
  gsap.set(win, { clipPath: `circle(0px at ${WW - 145}px ${70 + 77}px)` });

  // local → world helpers for the travelling core
  const btnWorld = { x: S.x + WX + WW - 250 + 36, y: S.y + WY + 70 + 46 + 31 };

  step(S, 'start-button', 'Бутонът Copilot.', t => {
    camTo(t, center(S), 0, { dur: 2.2, dip: 0.8 });
    railTo(t, S, 0, 2.2);
    // the core shrinks into the Copilot button icon
    t.to(coreTxt, { opacity: 0, duration: 0.3 }, 0);
    t.to(core, { x: btnWorld.x - (C.x + CX), y: btnWorld.y - (C.y + CY), scale: 32 / (R * 2), duration: 2.0, ease: 'expo.inOut' }, 0.1);
    t.to(win, { clipPath: `circle(2000px at ${WW - 145}px ${70 + 77}px)`, duration: 1.6, ease: 'power3.in' }, 1.6);
    t.to(core, { opacity: 0, duration: 0.2 }, 2.2);
    t.to(btn, { scale: 0.92, duration: 0.15, yoyo: true, repeat: 1 }, 2.6);
    t.to(pane, { xPercent: 0, duration: 1.2, ease: 'expo.out' }, 2.8);
  });

  step(S, 'start-cloud', 'Файлът в OneDrive или SharePoint.', t => {
    t.to(cloud, { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'back.out(2)' }, 0);
  });

  function modeStep(i, beat) {
    step(S, 'start-mode-' + i, beat, t => {
      if (i === 0) { t.to(seg, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0); t.to(ind, { opacity: 1, duration: 0.4 }, 0.3); }
      else {
        t.to(ind, { x: 4 + segW * i, duration: 0.8, ease: 'expo.inOut' }, 0);
        t.to(descs[i - 1], { opacity: 0, y: -40, duration: 0.5, ease: 'power2.in' }, 0);
      }
      t.to(modeLbls[i], { color: K.C.ink, duration: 0.4 }, 0.3);
      if (i > 0) t.to(modeLbls[i - 1], { color: 'rgba(23,17,31,.68)', duration: 0.4 }, 0.1);
      t.to(descs[i], { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.4);
      if (i === 0) t.to(lock, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' }, 0.6);
      if (i === 1) {
        t.to(lock, { opacity: 0, scale: 0.8, duration: 0.4 }, 0);
        t.to(editCells, { scaleY: 1, duration: 0.5, ease: 'expo.out', stagger: { each: 0.05, from: 'start' } }, 0.5);
      }
      if (i === 2) {
        t.to(editCells, { scaleY: 0, duration: 0.4, ease: 'power2.in', stagger: { each: 0.02, from: 'end' } }, 0);
        t.to(planList, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.6);
      }
    });
  }
  modeStep(0, 'Режим Чат: въпроси, не пипа файла.');
  modeStep(1, 'Режим Редакция: работи във файла.');
  modeStep(2, 'Режим План: стъпки + одобрение.');

  step(S, 'start-slash', '„/“ за посочване на файл.', t => {
    t.to(planList, { opacity: 0, y: -20, duration: 0.4 }, 0);
    t.to(descs[2], { opacity: 0.25, duration: 0.4 }, 0);
    t.set(ph, { display: 'none' }, 0.3);
    t.set(slash, { display: 'inline' }, 0.3);
    t.to(menu, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'expo.out' }, 0.5);
    t.to(files[0], { background: 'rgba(250,157,19,.2)', duration: 0.3 }, 1.2);
    t.set(slash, { display: 'none' }, 1.8);
    t.set(mchip, { display: 'inline' }, 1.8);
    t.from(mchip, { scale: 1.3, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, 1.8);
    t.to(menu, { opacity: 0, y: 20, scale: 0.96, duration: 0.4 }, 1.8);
    t.to(mentionLbl, { opacity: 1, duration: 0.8 }, 2.0);
  });

  /* =================== PROMPTS =================== */
  const P = scene('prompts', 7200, 1600, 'prompts');
  const BX = 160, BY = 270, BW = 1600, BH = 300;
  const box = P.add(h('div.prompt', { x: BX, y: BY, w: BW, h: BH }));
  const tagEl = h('span.tag', { text: 'Слаб промпт', style: { position: 'absolute', left: '40px', top: '-20px', background: 'var(--card2)', color: 'var(--ink2)' } });
  box.append(tagEl);
  const weak = h('div', { text: 'Анализирай бюджета.', style: { fontSize: '56px', fontWeight: 700 } });
  box.append(weak);
  const weakCh = splitChars(weak);
  // input box → prompt box
  const inWorld = { x: S.x + WX + PX + 30, y: S.y + WY + 190 + (WH - 190 - 100) };
  gsap.set(box, { x: inWorld.x - (P.x + BX), y: inWorld.y - (P.y + BY), scaleX: (PW - 60) / BW, scaleY: 72 / BH, transformOrigin: '0% 0%' });
  gsap.set(tagEl, { opacity: 0 });

  const SEGC = { goal: 'rgba(250,157,19,.32)', data: 'rgba(23,17,31,.08)', result: 'rgba(250,157,19,.12)', cond: 'rgba(23,17,31,.02)' };
  const SEGB = { goal: K.C.acc, data: 'rgba(23,17,31,.55)', result: '#F5C26B', cond: 'rgba(23,17,31,.3)' };
  const strongParts = [
    ['goal', 'Намери проектите, които ще превишат бюджета.'],
    ['data', 'Използвай часовете от таблица Часове и бюджета в часове от таблица Проекти.'],
    ['result', 'Изведи ги в нов лист с процент изразходван бюджет.'],
    ['cond', 'Не променяй оригиналните данни.']];
  const strong = h('div', { style: { position: 'absolute', left: '40px', top: '38px', right: '40px' } });
  box.append(strong);
  const segEls = strongParts.map(([k, txt]) => {
    const sp = h('span.seg', { text: txt }); strong.append(sp); strong.append(document.createTextNode(' '));
    return { k, sp, ch: splitChars(sp) };
  });
  const formulaNames = { goal: 'Цел', data: 'Данни', result: 'Резултат', cond: 'Условия' };
  const blocks = segEls.map(({ k, sp }, i) => {
    const b = P.add(h('div.pill', { x: 0, y: 0, style: { fontSize: '44px', fontWeight: 800, padding: '12px 32px 12px 16px', gap: '14px', background: SEGC[k], borderColor: SEGB[k] } },
      K.icon({ goal: 'bullseye', data: 'card_index_dividers', result: 'clipboard', cond: 'locked' }[k], 60), h('span', formulaNames[k])));
    return { k, b, sp };
  });
  // formula layout: blocks with plus signs
  const plusEls = [];
  const fy = 660;
  let fx = 0; const widths = blocks.map(b => b.b.offsetWidth); const plusW = 70;
  const totalW = widths.reduce((a, b) => a + b, 0) + plusW * 3;
  fx = 960 - totalW / 2;
  blocks.forEach((b, i) => {
    b.fx = fx; b.fy = fy; fx += widths[i];
    if (i < 3) { const p = P.add(h('div.h2.center', { x: fx, y: fy + 4, w: plusW, text: '+', style: { color: 'var(--ink3)' } })); gsap.set(p, { opacity: 0, scale: 0.4 }); plusEls.push(p); fx += plusW; }
  });
  blocks.forEach(b => {
    const sx = BX + 40 + b.sp.offsetLeft, sy = BY + 38 + b.sp.offsetTop - 60;
    gsap.set(b.b, { x: sx, y: sy, scale: 0.55, opacity: 0, transformOrigin: '0% 0%' });
  });
  const habits = ['„с формули“ при изчисления', '„/“ за точния файл', 'Първият отговор е чернова'].map((t, i) => {
    const p = P.add(h('div.pill.ghost', { x: 0, y: 810, text: t, style: { fontSize: '30px', borderColor: i === 2 ? 'var(--acc)' : 'var(--line2)', color: i === 2 ? 'var(--acc-ink)' : 'var(--ink)' } }));
    return p;
  });
  let hx = 0; const hw = habits.map(p => p.offsetWidth); const htot = hw.reduce((a, b) => a + b, 0) + 30 * 2;
  hx = 960 - htot / 2;
  habits.forEach((p, i) => { p.style.left = hx + 'px'; hx += hw[i] + 30; gsap.set(p, { opacity: 0, y: 30 }); });
  const pLabel = P.add(h('div.label', { x: 160, y: 150, text: 'Ефективен промпт' }));
  gsap.set(pLabel, { opacity: 0 });

  step(P, 'prompts-weak', 'Слаб промпт.', t => {
    camTo(t, center(P), 0, { dur: 2.2, dip: 0.85, tilt: -1 });
    railTo(t, P, 0, 2.2);
    t.to(mentionLbl, { opacity: 0, duration: 0.4 }, 0);
    t.to(input, { opacity: 0, duration: 0.2 }, 0.1);
    t.to(box, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 2.1, ease: 'expo.inOut' }, 0.1);
    t.to(pLabel, { opacity: 1, duration: 0.8 }, 1.8);
    t.to(tagEl, { opacity: 1, duration: 0.4 }, 2.0);
    type(t, weakCh, 2.2, 22);
  });

  step(P, 'prompts-strong', 'Силен промпт: четирите части.', t => {
    weakCh.forEach((c, i) => t.to(c, { y: 120 + Math.random() * 80, rotation: (Math.random() - 0.5) * 90, opacity: 0, duration: 0.8, ease: 'power3.in' }, i * 0.015));
    t.to(tagEl, { rotationX: 90, duration: 0.25, ease: 'power2.in' }, 0.2);
    t.set(tagEl, { textContent: 'Силен промпт', background: 'rgba(250,157,19,.18)', color: K.C.accInk }, 0.45);
    t.to(tagEl, { rotationX: 0, duration: 0.35, ease: 'back.out(2)' }, 0.45);
    let at = 0.7;
    segEls.forEach(({ k, sp, ch }) => {
      const d = type(t, ch, at, 95);
      t.to(sp, { backgroundColor: SEGC[k], boxShadow: `inset 0 -4px 0 ${SEGB[k]}`, duration: 0.5 }, at + d);
      at += d + 0.15;
    });
  });

  step(P, 'prompts-formula', 'Цел + Данни + Резултат + Условия.', t => {
    blocks.forEach((b, i) => {
      t.to(b.b, { opacity: 1, duration: 0.3 }, i * 0.15);
      t.to(b.b, { x: b.fx, y: b.fy, scale: 1, duration: 1.3, ease: 'expo.inOut' }, i * 0.15);
    });
    t.to(plusEls, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(3)', stagger: 0.1 }, 1.2);
  });

  step(P, 'prompts-habits', 'Три навика. Първият отговор е чернова.', t => {
    habits.forEach((p, i) => t.to(p, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, i * 0.18));
  });

  K.shared.prompt = { blocks, plusEls, box, P };
});
