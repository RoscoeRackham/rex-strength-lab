const { P, g, M, surf, rex, ollie, ON, ctxOf } = require('./env.js');
const step = +process.argv[2] || 0.01;
const sets = process.argv[3]==='on' ? { ON } : { ON, unbOnly: { unbreakable: true } };
const surfaces = ['sand', 'gravel', 'softclay', 'stiffclay', 'asphalt', 'concrete', 'ice', 'steel', 'granite'];
for (const body of [rex, ollie]) for (const [sn, pw] of Object.entries(sets)) for (const sf of surfaces) {
  let prev = null, drops = [], n = 0, prevBreak = null, edges = [];
  const t0 = Date.now();
  const lgs = []; for (let lg = 1.5; lg <= 34 + 1e-9; lg += step) lgs.push(lg); lgs.push(Infinity);
  for (const lg of lgs) {
    const c = ctxOf(Math.pow(10, lg) * g, Object.assign({ body }, pw, { surface: surf(sf) })), r = P.stomp(c);
    const o = Object.assign({ surface: c.surface, body, m: body.m }, pw), b = M.stomp.blow(r, o), src = M.stomp.shake(r, o);
    const v5 = src ? P.ppvAt(src, 5) : 0, v15 = src ? P.ppvAt(src, 1.5) : 0, pr = src ? P.plasterReach(src) : 0;
    const cur = { lg, v5, v15, pr, J: b ? b.J : 0, T: b ? b.T : 0, rb: r.realBreaks, vF: r.vFoot };
    if (prev) {
      for (const k of ['v5', 'v15', 'pr']) if (cur[k] < prev[k] * (1 - 1e-9)) drops.push(k + ' ' + prev.lg.toFixed(3) + '->' + lg.toFixed(3) + ': ' + prev[k].toPrecision(4) + '->' + cur[k].toPrecision(4) + ' (J ' + prev.J.toPrecision(5) + '/' + prev.T.toPrecision(3) + ' -> ' + cur.J.toPrecision(5) + '/' + cur.T.toPrecision(3) + ', rb ' + prev.rb + '->' + cur.rb + ')');
      if (prev.rb !== cur.rb) edges.push(prev.lg.toFixed(3) + '->' + lg.toFixed(3) + ' rb ' + prev.rb + '->' + cur.rb + ' J ' + prev.J.toPrecision(5) + '/' + prev.T.toPrecision(3) + ' -> ' + cur.J.toPrecision(5) + '/' + cur.T.toPrecision(3) + ' v5 ' + prev.v5.toPrecision(4) + '->' + cur.v5.toPrecision(4));
      if (!isFinite(cur.v5) || isNaN(cur.J)) { if (!drops.some(d=>d.startsWith('NONFINITE'))) drops.push('NONFINITE at ' + lg + ' v5 ' + cur.v5 + ' J ' + cur.J); }
    }
    prev = cur; n++;
  }
  console.log(body.build, sn, sf, 'n', n, (Date.now() - t0) + 'ms', 'drops', drops.length, drops.slice(0, 4).join(' | '), '\n   edges:', edges.join(' | '), '\n   last J', prev.J, 'v5', prev.v5);
}
