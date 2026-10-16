global.window = {};
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const base = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: sf('concrete'), anchor: 'friction', keepForm: true, unbreakable: true, ownRecoil: true };
for (const [lbl, F, objId, ang, air] of [['car default', base.F, 'car', 45, 1], ['car 1e9', 1e9 * g, 'car', 45, 1], ['car 1e9 50%', 1e9 * g, 'car', 45, 0.5], ['car 1e12', 1e12 * g, 'car', 45, 1], ['baseball 1e6 90deg', 1e6 * g, 'baseball', 90, 1], ['bus 1e9 90', 1e9 * g, 'bus', 90, 1]]) {
  const c = Object.assign({}, base, { F, airAbsorb: air });
  const t = P.throwObject(c, ob(objId), ang), t0 = P.throwObject(Object.assign({}, c, { airAbsorb: 0 }), ob(objId), ang);
  const f = t.flight, f0 = t0.flight, o = ob(objId);
  const Ereal = !t0.canMove ? 0 : f0.relativistic ? t0.Eobj : f0.landed ? Math.max(0, t0.Eobj + o.m * (P.K.GM / P.K.R_E - P.K.GM / (P.K.R_E + body.releaseHeight)) - P.keFromV(f0.vImpact, o.m)) : t0.Eobj;
  console.log(lbl.padEnd(20), 'v', sig(t.v), 'v(air0)', sig(t0.v), 'Eobj', sig(t.Eobj), 'ocean.E', sig(f.ocean ? f.ocean.E : 0), 'orbit/esc/rel', !!f.orbit, !!f.escaped, !!f.relativistic, '| real air take', sig(Ereal), 'dragLoss0', sig(t.dragLoss0), '| (1-dK)*Ereal', sig((air) * Ereal));
}
