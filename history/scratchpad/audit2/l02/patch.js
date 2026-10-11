const fs = require('fs');
let s = fs.readFileSync('/home/user/dino-strength-sim/dist/preview.html', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 80)); s = s.replace(a, b); };
// 1. wrap labels to the room on their side
rep("    place(tierItems, 30); place(thItems, 30);",
`    const wrapLbl = (it) => {
      const room = (it.side === 'L' ? axisX - 30 : W - axisX - 30) - 4;
      const max = Math.floor(room / 6.4);
      it.lines = [it.text];
      if (it.text.length > max) { const cut = it.text.lastIndexOf(' ', max); if (cut > 0) it.lines = [it.text.slice(0, cut), it.text.slice(cut + 1)]; }
    };
    tierItems.forEach(wrapLbl); thItems.forEach(wrapLbl);
    place(tierItems, 30); place(thItems, 30);`);
// place(): gap below a two-line label grows by one line
rep("for (const it of items) { it.ty = Math.max(y(it.lg), prev + minGap); prev = it.ty; }",
    "let extra = 0; for (const it of items) { it.ty = Math.max(y(it.lg), prev + minGap + extra); prev = it.ty; extra = 13 * ((it.lines || [1]).length - 1); }");
rep("const over = prev - (padT + (LMAX - LMIN) * pxDec + 10);",
    "const over = prev + extra - (padT + (LMAX - LMIN) * pxDec + 10);");
rep("for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; it.ty = Math.min(it.ty - over, next - minGap); next = it.ty; }",
    "for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; it.ty = Math.min(it.ty - over, next - minGap - 13 * ((it.lines || [1]).length - 1)); next = it.ty; }");
// draw: tspans + sub moved down
rep("class: 'lbl-strong', style: 'font-family:var(--font-body);font-size:12.5px' }, it.text));",
    "class: 'lbl-strong', style: 'font-family:var(--font-body);font-size:12.5px' }, it.lines.map((ln, i) => sv('tspan', { x: lx + (left ? -4 : 4), dy: i ? 13 : 0 }, ln))));");
rep("y: it.ty + 14, 'text-anchor': left ? 'end' : 'start' }, it.sub));",
    "y: it.ty + 14 + 13 * (it.lines.length - 1), 'text-anchor': left ? 'end' : 'start' }, it.sub));");
// 2. leader contrast
rep("fill: 'none', stroke: 'var(--line)', 'stroke-width': 1 }));", "fill: 'none', stroke: 'var(--ink-3)', 'stroke-width': 1 }));");
// 3. now label drawn last, on top
rep("    svg.append(sv('text', { x: W - 2, y: cy - 5, 'text-anchor': 'end', class: 'lbl-strong' }, state.inf ? 'now: ∞' : 'now'));\n", "");
rep("    tierItems.forEach(draw); thItems.forEach(draw);",
    "    tierItems.forEach(draw); thItems.forEach(draw);\n    svg.append(sv('text', { x: W - 2, y: cy - 5, 'text-anchor': 'end', class: 'lbl-strong' }, state.inf ? 'now: ∞' : 'now'));");
fs.writeFileSync(process.argv[2], s);
console.log('ok');
