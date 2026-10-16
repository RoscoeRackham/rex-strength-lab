global.window = {};
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const base = { mode: 'comic', body, surface: sf('concrete'), anchor: 'friction', keepForm: true, unbreakable: true, ownRecoil: true, airAbsorb: 1 };
for (const kg of [4e9, 5e9, 6e9, 8e9, 1e10]) {
  const t = P.throwObject(Object.assign({}, base, { F: kg * g }), ob('car'), 0);
  console.log(kg.toExponential(1), 'v', sig(t.v), 'orbit', !!t.flight.orbit, 'escaped', !!t.flight.escaped, 'landed', !!t.flight.landed, 'ocean.E', sig(t.flight.ocean ? t.flight.ocean.E : 0), 'Eobj', sig(t.Eobj));
}
