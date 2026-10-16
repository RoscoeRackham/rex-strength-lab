global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, P = require(__dirname + '/engine-new.js'), g = P.K.g, M = P.RESTRAINT.MOVES;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (kg, x) => Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, x || {});
const sig = (x) => (typeof x === 'number' ? x.toPrecision(4) : String(x));
const fr = (x) => (x.never ? 'never' : sig(x.use / g));
for (const s of [{ ownRecoil: true }, ON]) for (const [oid, ang, kg] of [['car', 45, 1e9], ['car', 45, 90718.474], ['bus', 30, 1e9], ['piano', 60, 1e9]]) {
  const c = ctxOf(kg, s), p = P.RESTRAINT.planNow('throw', c, { obj: obj(oid), angle: ang, target: 30, near: 5 });
  const ra = p.run(undefined);
  console.log(process.env.NOSINK ? 'OLD-sink' : 'NEW-sink', JSON.stringify(s).slice(0, 40), oid, ang, kg, '| hazard:ground', fr(p.result('hazard:ground')), '| preset:ground', fr(p.result('preset:ground')), '| ceiling', p.ceiling().by, fr(p.ceiling()), '| all-out sinkRatio', sig(ra.sinkRatio), 'raw', sig(ra.sinkRatioRaw), '| recoilAbsorbed', ra.recoilAbsorbed && sig(ra.recoilAbsorbed.J));
}
// the brief's least-disruptive car, new
{ const c = ctxOf(90718.474, ON), p = P.RESTRAINT.planNow('throw', c, { obj: obj('car'), angle: 45, target: 30, near: 5 }), gl = p.goal(), r = p.run(gl.use);
  console.log('least car: use', sig(gl.use / g), 'toGround', JSON.stringify(r.toGround), 'recoilAbsorbed', JSON.stringify(r.recoilAbsorbed), 'shake', JSON.stringify(M.throw.shake(r, p.opt)) ? 'land only: ' + sig(P.ppvAt(M.throw.shake(r, p.opt), 5) * 1000) + ' mm/s' : '-', 'from', M.throw.shakeFrom(r, p.opt)); }
