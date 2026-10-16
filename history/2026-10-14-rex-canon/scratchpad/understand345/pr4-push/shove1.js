const { P, g, ON, OFF, DIAL, pair, sig, rex, ollie, surf, ctxOf } = require('./common.js');
const pick = (r) => JSON.stringify(Object.fromEntries(['clash', 'tearA', 'tearB', 'stalled', 'vA', 'vB', 'slideA', 'slideB', 'Fdrive', 'heldBack'].map((k) => [k, typeof r[k] === 'number' ? sig(r[k]) : r[k]])));
for (const [lab, x] of [['ON', ON], ['ON unbreakable off', Object.assign({}, ON, { unbreakable: false })], ['OFF', OFF]]) {
  for (const [F, fl] of [[DIAL, 'dial'], [Infinity, 'inf']]) for (const [aA, aB] of [['friction', 'friction'], ['friction', 'bolted'], ['bolted', 'bolted'], ['bolted', 'friction']]) {
    const r = P.shove(ctxOf(F, Object.assign({}, x, { anchor: aA }), rex), ctxOf(F, Object.assign({}, x, { anchor: aB }), ollie));
    console.log(lab, fl, aA, aB, pick(r), r.toGround ? 'toGround ' + sig(r.toGround.J) : '', r.toGroundB ? 'toGroundB ' + sig(r.toGroundB.J) : '');
  }
}
