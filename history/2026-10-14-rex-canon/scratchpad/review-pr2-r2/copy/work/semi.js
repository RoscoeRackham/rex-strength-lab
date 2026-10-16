const which = process.argv[2];
const dir = which === 'main' ? __dirname + '/mainsrc' : __dirname + '/../repo/rex-strength-lab/src';
const P = require(dir + '/engine.js'); global.window = {}; require(dir + '/data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const out = [];
for (const a of [0, 5, 10, 15, 20, 25]) {
  const c = { F: 90718.474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const p = P.RESTRAINT.planNow('throw', c, { obj: D.objects.find((o) => o.id === 'semi'), angle: a, target: 30, near: 5 });
  const r = p.presets().find((x) => x.id === 'rattle');
  out.push(a + ':' + (r.never ? 'never' : Math.round(r.use / g)));
}
console.log(which, out.join('  '));
