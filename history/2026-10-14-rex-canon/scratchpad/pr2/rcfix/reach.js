// the bolted car all-out at the default dial (concrete, all powers on): the reach of plaster cracking and rattling
const R = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/src/';
global.window = {}; const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), conc = D.surfaces.find((s) => s.id === 'concrete');
for (const id of ['car', 'baseball', 'pickup', 'bus']) {
  const c = { F: 90718.474 * g, mode: 'comic', body, surface: conc, anchor: 'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.pull(c, D.objects.find((x) => x.id === id)), o = { obj: D.objects.find((x) => x.id === id), surface: conc, body, near: 5, ownRecoil: true };
  const rc = P.RESTRAINT.reach('pull', r, o);
  console.log(id, 't10m', r.t10m.toFixed(4), 'reach', JSON.stringify(Object.fromEntries(Object.entries(rc).map(([k, v]) => [k, typeof v === 'number' ? +v.toFixed(2) : v]))), 'ppv5 mm/s', (P.ppvAt(P.RESTRAINT.MOVES.pull.shake(r, o), 5) * 1000).toFixed(3));
}
