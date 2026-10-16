// the pull with the power on, friction and bolted, at the default dial and 10^6 kg: this branch's engine (argv[2] or the repo's) vs main's
global.window = {};
const path = require('path');
const eng = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js';
const P = require(eng); require(process.argv[3] || '/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const kg of [100 * 907.18474, 1e6, 1e9, Infinity]) for (const anchor of ['friction', 'bolted']) {
  const c = Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor }, ON);
  const r = P.pull(c, obj('car'));
  const M = P.RESTRAINT.MOVES.pull, o = Object.assign({ obj: obj('car'), surface: c.surface, body: rex, near: 5 }, ON);
  const src = M.shake ? M.shake(r, o) : null;
  const p = P.RESTRAINT.planNow('pull', c, { obj: obj('car'), target: 10, near: 5 });
  const ce = p.ceiling(), pr = Object.fromEntries(p.presets().map((x) => [x.id, x.never ? 'never' : (x.use / g).toFixed(0)]));
  console.log(kg, anchor, 'accel', r.accel.toPrecision(4), 't10m', r.t10m.toPrecision(4), 'vEnd', r.vEnd.toPrecision(4), 'walk', r.walkPush && r.walkPush.J.toPrecision(4), 'F', r.walkPush && (r.walkPush.J / r.walkPush.T).toPrecision(4), 'rope J', r.recoilAbsorbed && r.recoilAbsorbed.J.toPrecision(4), 'ppv5 mm/s', src ? (P.ppvAt(src, 5) * 1000).toPrecision(3) : '-', 'ceiling', ce.by ? (ce.below / g).toPrecision(4) + ' by ' + ce.by : 'none', JSON.stringify(pr));
}
