global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g, c = P.K.c;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const C = (F, anchor, sid, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf(sid || 'concrete'), groundHolds: false, anchor }, extra || {});
const f = (x) => (typeof x === 'number' ? Number(x.toPrecision(4)) : x);
for (const F of [90718 * g, 1e7 * g, 1.8e23 * g]) {
  for (const anchor of ['friction', 'bolted']) {
    const p = P.punch(C(F, anchor));
    const s = P.stomp(C(F, anchor));
    const pl = P.pull(C(F, anchor, 'concrete'), obj('bus'));
    const pli = P.pull(C(F, anchor, 'ice'), obj('bus'));
    const pi = P.punch(C(F, anchor, 'ice'));
    const cl = P.clap(C(F, anchor));
    console.log((F / g).toExponential(3), anchor,
      '| punch conc basis', p.basis || 'comic', 'vFist', f(p.vFist), 'recoilV', f(p.recoilV), 'lurch', f(p.lurch), 'E', f(p.E), 'pB', f(p.push.pB), 'pA', f(p.push.pA), 't', f(p.push.t), 'R', f(p.anchor.R),
      '| punch ice vFist', f(pi.vFist), 'recoilV', f(pi.recoilV), 'lurch', f(pi.lurch),
      '| stomp vFoot', f(s.vFoot), 'vBody', f(s.vBody), 'E', f(s.E), 'pB', f(s.push.pB), 't', f(s.push.t), 'apex', f(s.bodyFlight.apex), 'esc', s.bodyFlight.escaped, 'rel', s.bodyFlight.relativistic,
      '| pull conc usable', f(pl.usable), 'R', f(pl.anchor.R), 't10m', f(pl.t10m), 'limitedBy', pl.limitedBy, '| pull ice usable', f(pli.usable), 't10m', f(pli.t10m), 'limitedBy', pli.limitedBy,
      '| clap vHand', f(cl.vHand), 'pA', f(cl.push.pA));
  }
}
