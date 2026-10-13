/* The orange thread: a rail along the bottom of every scene that the camera follows.
   It grows ahead with each camera move and labels each chapter. Scene builders
   are registered with K.def() and run after fonts are ready (text is measured). */
(function () {
  const { s, h, world } = K;
  const builders = [];
  K.def = fn => builders.push(fn);
  K.buildAll = () => builders.forEach(fn => fn());

  // Actors: world-level layer for elements that travel between scenes (always rendered)
  const actors = h('div.actors', { style: { position: 'absolute', left: 0, top: 0, zIndex: 5 } });
  const svg = s('svg', { id: 'rail', width: 1, height: 1 });
  const lines = s('g'), labels = s('g');
  const halo = s('circle', { r: 24, fill: 'none', stroke: K.C.acc, 'stroke-opacity': 0.35, 'stroke-width': 2 });
  const head = s('circle', { r: 10, fill: K.C.acc });
  svg.append(lines, labels, halo, head);
  K.actors = actors;
  K.railSvg = svg;

  let last = null, lastSection = null;
  const anchor = sc => ({ x: sc.x + 130, y: sc.y + 1000 });
  function setHead(p) { for (const c of [head, halo]) { c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); } }

  function label(sc, a) {
    const sec = TALK.sections.find(x => x.id === sc.section);
    const outer = s('g', { transform: `translate(${a.x + 34},${a.y - 22})` });
    const g = s('g');
    const n = s('text.rail-num', { x: 0, y: 0, text: sec.n });
    const t = s('text.rail-label', { x: sec.n.length * 15 + 22, y: 0, text: sec.name });
    g.append(n, t); outer.append(g); labels.append(outer);
    return g;
  }

  K.railStart = (sc, t) => {
    world.append(svg);
    world.append(actors);
    const a = anchor(sc);
    const p = s('path.rail-line', { d: `M ${a.x - 1400} ${a.y} L ${a.x} ${a.y}` });
    lines.append(p);
    setHead(a);
    last = a; lastSection = sc.section;
    return p;
  };

  // Draw the rail from the previous anchor to this scene's anchor, inside step timeline t
  K.railTo = (t, sc, at = 0, dur = 2) => {
    const a = last, b = anchor(sc);
    const dy = b.y - a.y;
    const d = Math.abs(dy) < 1 ? `M ${a.x} ${a.y} L ${b.x} ${b.y}`
      : `M ${a.x} ${a.y} C ${a.x} ${a.y + dy * 0.55} ${b.x} ${b.y - dy * 0.55} ${b.x} ${b.y}`;
    const p = s('path.rail-line', { d });
    lines.append(p);
    gsap.set(p, { drawSVG: '0%' });
    const len = p.getTotalLength();
    t.to(p, { drawSVG: '100%', duration: dur, ease: 'swoop' }, at);
    const prog = { v: 0 };
    t.to(prog, { v: 1, duration: dur, ease: 'swoop', onUpdate: () => setHead(p.getPointAtLength(prog.v * len)) }, at);
    if (sc.section !== lastSection) {
      const g = label(sc, b);
      gsap.set(g, { opacity: 0, x: -30 });
      t.to(g, { opacity: 1, x: 0, duration: 1.0, ease: 'expo.out' }, at + dur * 0.7);
      lastSection = sc.section;
    }
    last = b;
  };
})();
