import sys
p='/home/user/dino-strength-sim/src/app.html'; s=open(p).read()
def R(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit('count %d != %d for: %s'%(n,count,old[:120]))
    s=s.replace(old,new)

# data N1: nested kid arrays render as text
R("for (const kid of kids.flat()) if (kid != null && kid !== false)","for (const kid of kids.flat(Infinity)) if (kid != null && kid !== false)")
R("for (const kid of kids.flat()) if (kid != null) n.append","for (const kid of kids.flat(Infinity)) if (kid != null) n.append")

# L-09: nb binds only short number+unit pairs
R("""  const nb = (t) => String(t).replace(/(\\d) (?=[A-Za-zµ°%×])/g, '$1\\u00a0');""",
  """  // keep short number + unit pairs together; longer pairs (years, long numbers) may wrap at the space
  const nb = (t) => String(t).replace(/([\\d.,]*\\d) ([A-Za-zµ°%×]\\S*)/g, (m, n, u) => n + (n.length + u.length < 10 ? '\\u00a0' : ' ') + u);""")

# L-10: chart width floor
R("const chartW = () => Math.max(300, Math.min(760,","const chartW = () => Math.max(240, Math.min(760,")

# ux N2 / M5 / ux N1: trajectory chart
R("""  function trajectoryChart(path, ghost, label, apexH) {
    const w = chartW(), h = w < 480 ? 220 : 260, padL = 58, padR = 16, padT = 16, padB = 34;
    let maxX = 0, maxY = 0;
    for (const p of path.concat(ghost || [])) { maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); }
    maxX = maxX || 1; maxY = maxY || 1;
    const nice = (v) => { const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };
    const X = nice(maxX * 1.02), Y = nice(maxY * 1.05);
""","""  function trajectoryChart(path, ghost, label, apexH, endNote) {
    const w = chartW(), h = w < 480 ? 220 : 260, padR = 16, padT = 16, padB = 34;
    let maxX = 0, maxY = 0;
    for (const p of path.concat(ghost || [])) { maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); }
    maxY = maxY || 1; maxX = Math.max(maxX, maxY / 20) || 1;
    const nice = (v) => { const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };
    const X = nice(maxX * 1.02), Y = nice(maxY * 1.05);
    const axisLbl = (v) => (v === 0 ? '0' : fmtDist(v));
    // room for the widest y label (11px mono is about 6.6 px a character)
    const padL = Math.max(40, Math.ceil(Math.max(...[0, 1, 2, 3, 4].map((i) => axisLbl(Y * i / 4).length)) * 6.6) + 12);
""")
R("""      svg.append(sv('text', { x: padL - 6, y: sy(yy) + 4, 'text-anchor': 'end' }, fmtDist(yy)));
      svg.append(sv('text', { x: sx(xx), y: h - padB + 18, 'text-anchor': i === 0 ? 'start' : (i === 4 ? 'end' : 'middle') }, fmtDist(xx)));""",
"""      svg.append(sv('text', { x: padL - 6, y: sy(yy) + 4, 'text-anchor': 'end' }, axisLbl(yy)));
      svg.append(sv('text', { x: sx(xx), y: h - padB + 18, 'text-anchor': i === 0 ? 'start' : (i === 4 ? 'end' : 'middle') }, axisLbl(xx)));""")
R("""    let apex = path[0];
    for (const p of path) if (p[1] > apex[1]) apex = p;
    svg.append(sv('circle', { cx: sx(apex[0]), cy: sy(apex[1]), r: 4, fill: 'var(--accent)', stroke: 'var(--surface)', 'stroke-width': 2 }));
    svg.append(sv('text', { x: Math.min(sx(apex[0]) + 8, w - padR - 4), y: Math.max(sy(apex[1]) - 8, padT + 10), 'text-anchor': sx(apex[0]) > w - 150 ? 'end' : 'start', class: 'lbl-strong' }, 'top ' + fmtDist(apexH != null ? apexH : apex[1])));""",
"""    if (endNote) {
      // it never comes down inside the chart: label where the drawn path ends, not a peak
      svg.append(sv('text', { x: sx(last[0]) + (sx(last[0]) > w - 150 ? -8 : 8), y: Math.max(sy(last[1]) - 8, padT + 10), 'text-anchor': sx(last[0]) > w - 150 ? 'end' : 'start', class: 'lbl-strong' }, endNote));
    } else {
      let apex = path[0];
      for (const p of path) if (p[1] > apex[1]) apex = p;
      svg.append(sv('circle', { cx: sx(apex[0]), cy: sy(apex[1]), r: 4, fill: 'var(--accent)', stroke: 'var(--surface)', 'stroke-width': 2 }));
      svg.append(sv('text', { x: Math.min(sx(apex[0]) + 8, w - padR - 4), y: Math.max(sy(apex[1]) - 8, padT + 10), 'text-anchor': sx(apex[0]) > w - 150 ? 'end' : 'start', class: 'lbl-strong' }, 'top ' + fmtDist(apexH != null ? apexH : apex[1])));
    }""")
R("""    return el('div', {}, legend, el('div', { class: 'viz' }, svg));
  }

  function logBars(""","""    const cap = endNote ? el('p', { class: 'muted', style: 'font-size:.85rem;margin-top:4px', text: 'Drawn up to 150 km, the top of the atmosphere. Past that it follows its drag-free path away from Earth.' }) : null;
    return el('div', {}, legend, el('div', { class: 'viz' }, svg), cap);
  }

  function logBars(""")

# L-09: logBars tick spacing from widest label, stack on narrow charts
R("const stack = want > w * 0.45;","const stack = want > w * 0.45 || w < 480;")
R("""    const maxTicks = Math.max(2, Math.floor((w - padL - padR) / 78));""",
"""    const tickW = 6.6 * Math.max(...Array.from({ length: hi - lo + 1 }, (_, i) => unitFmt(Math.pow(10, lo + i)).length)) + 10;
    const maxTicks = Math.max(1, Math.floor((w - padL - padR) / tickW));""")

# shareText takes the model actually used
R("""  const shareText = (key) => sig(100 * (state.mode === 'real' ? P.MUSCLE[key].forceFrac : P.MUSCLE[key].comicFrac), 2) + '%';""",
"""  const shareText = (key, mode) => sig(100 * ((mode || state.mode) === 'real' ? P.MUSCLE[key].forceFrac : P.MUSCLE[key].comicFrac), 2) + '%';
  // Comic mode uses the real-muscle result when that does better (slow, heavy pushes).
  const basisChip = (r) => (state.mode === 'comic' && r.basis === 'real' ? status('info', 'Comic mode: real muscle does better here, so this uses it') : null);
  // Tiles: a speed within 0.1% of light is shown as such, with the gap in the sub line.
  const speedTile = (k, v, sub) => {
    const b = v / K.c;
    if (isFinite(v) && b > 0.999 && v < K.c * (1 - 1e-12)) return tile(k, '≈ light speed', 'short of it by 1 part in ' + sci(1 / (1 - b), 2));
    return tile(k, speedOnly(v), sub);
  };""")

# ux N4: failed lift never shows 100%
R("""status('bad', 'Strength: ' + sig(r.strengthMargin * 100, 2) + '% of what’s needed')""",
  """status('bad', 'Strength: ' + (r.strengthMargin >= 0.99 ? sig(Math.min(r.strengthMargin * 100, 99.9), 3) : sig(r.strengthMargin * 100, 2)) + '% of what’s needed')""")
open(p,'w').write(s); print('ok')
