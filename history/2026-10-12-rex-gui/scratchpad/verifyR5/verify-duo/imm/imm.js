global.window = {}; global.performance = global.performance || require('perf_hooks').performance;
const L = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(L + '/src/engine.js'); require(L + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (build, t, extra) => Object.assign({ F: t * 1000 * g, mode: 'comic', body: P.makeBody({ build, H: build === 'rex' ? 3.048 : 3.06, m: 3007 }), surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, extra || {});
const near = 30;
for (const t of [20, 50, 61.1, 100]) {
  const cA = mk('ollie', t), cB = mk('rex', t, { immovable: true });
  const r = P.collide(cA, cB, { source: 'jump', gb: 100 / 299792458, bounce: false, toGround: false });
  const po = r.speed && r.speed.jump && r.speed.jump.pushOff;
  const src = po && po.J > 0 ? P.impulseSource(surface, po.J, Math.max(1e-9, po.T)) : null;
  const Q = r.Elocal != null && (r.relativistic || r.outcome === 'boltsLate') ? r.Elocal : r.h ? r.h.Q : 0;
  const F = r.contact ? r.contact.soft : null;
  const thump = isFinite(Q) && Q > 0 && (F ? F.t : 0) * P.K.a0 > Math.max(P.blastRadius(Q, 6900), 0.5);
  console.log(t + ' t', 'outcome', r.outcome, 'hit toGround', JSON.stringify(r.toGround || null), 'pushOff J', po && po.J.toFixed(0), 'T', po && po.T.toFixed(4),
    '| take-off ppv@30m', src ? (P.ppvAt(src, near) * 1000).toFixed(3) + ' mm/s' : '-', 'rattle TH', P.VIB.TH.rattle * 1000, 'rattleReach', src ? P.ppvReach(src, P.VIB.TH.rattle).toFixed(1) : '-',
    'plasterReach', src ? P.plasterReach(src).toFixed(2) : '-', '| Q', Q.toExponential(3), 'thump', thump, 'blast rattle radius', P.blastRadius(thump ? 0 : Q, P.RESTRAINT.R.DP_RATTLE).toFixed(1));
}
