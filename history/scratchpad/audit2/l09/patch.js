const fs = require('fs');
let s = fs.readFileSync('/home/user/dino-strength-sim/dist/preview.html', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 80)); s = s.replace(a, b); };
// A. logBars: honour opts.padL, stack labels above bars when they need more than half the width, ticks spaced by real label width
rep(`    const w = chartW(), rowH = 30, padL = Math.min(Math.round(longest * 6.8 + 14), Math.round(w * 0.5)), padR = 84, padT = 10;`,
`    const w = chartW(), padR = 84, padT = 10;
    const want = o.padL || Math.round(longest * 6.8 + 14);
    const stack = want > w * 0.5; // narrow screens: each label on its own line above its bar
    const rowH = stack ? 44 : 30, padL = stack ? 2 : want;`);
rep(`    const maxTicks = Math.max(2, Math.floor((w - padL - padR) / 78));
    const step = Math.max(1, Math.ceil((hi - lo) / maxTicks));
    for (let e = lo; e <= hi; e += step) {
      svg.append(sv('line', { x1: x(Math.pow(10, e)), x2: x(Math.pow(10, e)), y1: padT, y2: h - 22, class: 'axis' }));
      svg.append(sv('text', { x: x(Math.pow(10, e)), y: h - 6, 'text-anchor': 'middle' }, unitFmt(Math.pow(10, e))));
    }`,
`    const tw = (e) => String(unitFmt(Math.pow(10, e))).length * 6.8;
    let tickW = 0; for (let e = lo; e <= hi; e++) tickW = Math.max(tickW, tw(e) + 12);
    const step = Math.max(1, Math.ceil(tickW * (hi - lo) / (w - padL - padR)));
    let lastEnd = -Infinity;
    for (let e = lo; e <= hi; e += step) {
      const xe = x(Math.pow(10, e)), x0 = Math.max(0, Math.min(w - tw(e), xe - tw(e) / 2));
      svg.append(sv('line', { x1: xe, x2: xe, y1: padT, y2: h - 22, class: 'axis' }));
      if (x0 < lastEnd + 8) continue;
      svg.append(sv('text', { x: x0, y: h - 6 }, unitFmt(Math.pow(10, e))));
      lastEnd = x0 + tw(e);
    }`);
rep(`      const y = padT + i * rowH + 6;
      svg.append(sv('text', { x: padL - 8, y: y + 12, 'text-anchor': 'end', class: r.highlight ? 'lbl-strong' : null }, r.label));`,
`      const y = padT + i * rowH + (stack ? 20 : 6);
      svg.append(sv('text', stack ? { x: padL, y: y - 5, class: r.highlight ? 'lbl-strong' : null } : { x: padL - 8, y: y + 12, 'text-anchor': 'end', class: r.highlight ? 'lbl-strong' : null }, r.label));`);
// B. trajectoryChart: left pad from the widest y label, every other x label below 480 px
rep(`    const w = chartW(), h = w < 480 ? 220 : 260, padL = 58, padR = 16, padT = 16, padB = 34;`, `    const w = chartW(), h = w < 480 ? 220 : 260, padR = 16, padT = 16, padB = 34;`);
rep(`    const X = nice(maxX * 1.02), Y = nice(maxY * 1.05);
`, `    const X = nice(maxX * 1.02), Y = nice(maxY * 1.05);
    const padL = Math.max(58, Math.round(Math.max(...[1, 2, 3, 4].map((i) => fmtDist(Y * i / 4).length)) * 6.8 + 12));
`);
rep(`      svg.append(sv('text', { x: sx(xx), y: h - padB + 18, 'text-anchor': i === 0 ? 'start' : (i === 4 ? 'end' : 'middle') }, fmtDist(xx)));`,
`      if (w >= 480 || i % 2 === 0) svg.append(sv('text', { x: sx(xx), y: h - padB + 18, 'text-anchor': i === 0 ? 'start' : (i === 4 ? 'end' : 'middle') }, fmtDist(xx)));`);
// C. fmtDist(0)
rep(`    if (!isFinite(m)) return '∞';
    if (m < 0.01) return sig(m * 1000, 2) + ' mm';`, `    if (!isFinite(m)) return '∞';
    if (m === 0) return '0 m';
    if (m < 0.01) return sig(m * 1000, 2) + ' mm';`);
// D. nb(): bind numbers only to short unit tokens, not to following words such as "1883 Krakatoa"
rep(`String(t).replace(/(\\d) (?=[A-Za-zµ°%×])/g, '$1\\u00a0')`, `String(t).replace(/(\\d) (?=[A-Za-zµ°%×]\\S{0,4}(?:\\s|$))/g, '$1\\u00a0')`);
// E. tiles: slightly smaller value font where tiles are two-up on phones
rep(`.tile .v { font-weight: 700; font-size: 1.25rem; line-height: 1.2; overflow-wrap: anywhere; }`, `.tile .v { font-weight: 700; font-size: 1.25rem; line-height: 1.2; overflow-wrap: anywhere; }
@media (max-width: 440px) { .tile .v { font-size: 1.125rem; } }`);
fs.writeFileSync(__dirname + '/patched.html', s);
console.log('patched ok');
