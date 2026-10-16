global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
require(R + 'src/data.js');
const D = window.DINO_DATA;
const E = { old: require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr2/work/engine-main.js'), new: require(R + 'src/engine.js') };
const surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const f = (x) => (x == null ? '-' : isFinite(x) ? Math.round(x).toLocaleString('en-US') : String(x));
for (const [sf, oid, ang, lk] of [['concrete', 'semi', 0, 9], ['concrete', 'car', 45, 9], ['concrete', 'pickup', 0, 9], ['concrete', 'bus', 0, 9], ['concrete', 'loco', 0, 9], ['concrete', 'car', 45, 12]]) {
  const row = [];
  for (const [k, P] of Object.entries(E)) {
    const g = P.K.g, rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
    const c = Object.assign({ F: Math.pow(10, lk) * g, mode: 'comic', body: rex, surface: surf(sf), anchor: 'friction' }, ON);
    const p = P.RESTRAINT.planNow('throw', c, { obj: obj(oid), angle: ang, target: 30 });
    const ce = p.ceiling(), pr = p.presets();
    row.push(k + ': ceiling ' + (ce.by || 'none') + ' at ' + f(ce.use / g) + ' kgf; presets ' + pr.map((x) => x.id + ' ' + (x.never ? 'never' : f(x.use / g))).join(', '));
  }
  console.log(sf, oid, ang, '10^' + lk, '\n  ' + row.join('\n  '));
}
