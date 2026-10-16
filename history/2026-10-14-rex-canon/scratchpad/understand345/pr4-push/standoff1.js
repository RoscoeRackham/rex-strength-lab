const { P, g, ON, OFF, DIAL, pair, sig, rex, ollie, surf, ctxOf } = require('./common.js');
const show = (lab, r) => console.log(lab, JSON.stringify(Object.fromEntries(Object.entries(r).filter(([k, v]) => typeof v !== 'object').map(([k, v]) => [k, typeof v === 'number' ? sig(v) : v]))), r.rock ? 'rock ' + JSON.stringify(Object.fromEntries(Object.entries(r.rock).map(([k, v]) => [k, typeof v === 'number' ? sig(v) : v]))) : '');
for (const [lab, x] of [['ON', ON], ['OFF', OFF]]) {
  for (const [F, Fl] of [[DIAL, 'dial'], [Infinity, 'inf']]) {
    for (const [aA, aB, imm] of [['friction', 'friction', false], ['bolted', 'friction', false], ['friction', 'bolted', false], ['bolted', 'bolted', false], ['friction', 'friction', true], ['bolted', 'friction', true]]) {
      const cA = ctxOf(F, Object.assign({}, x, { anchor: aA }), ollie), cB = ctxOf(F, Object.assign({}, x, { anchor: aB }, imm ? { immovable: true } : {}), rex);
      show([lab, Fl, aA, aB, imm ? 'imm' : ''].join(' '), P.standoff(cA, cB));
    }
  }
}
