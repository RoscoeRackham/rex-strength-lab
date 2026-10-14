const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); global.window = {}; require(R+'src/data.js'); const D = window.DINO_DATA;
const mk = (kg, sid, pw) => ({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: D.surfaces.find(s => s.id === sid), anchor: 'friction', airAbsorb: pw?1:0, keepForm: pw, unbreakable: pw, ownRecoil: pw, safePassenger:false, silentStrike:false, softLanding:false });
const obj = (id) => D.objects.find(o => o.id === id);
function show(oid, angle, kg, preset) {
  const c = mk(kg, 'concrete', true);
  const p = P.RESTRAINT.planNow('throw', c, { near: 5, target: 30, obj: obj(oid), angle, silentStrike:false, softLanding:false, safePassenger:false });
  const pr = p.result('preset:' + preset);
  const ce = p.ceiling();
  const u = pr.use;
  const r = p.run(u);
  const rc = p.run(ce.use);
  console.log(oid, 'preset', preset, 'use kg', (u/P.K.g).toPrecision(3), 'shakeFrom', P.RESTRAINT.MOVES.throw.shakeFrom(r, p.opt), 'range', r.flight && P.range ? P.range(r.flight) : (r.flight && r.flight.range), 'landed', r.flight && r.flight.landed);
  console.log('  ceiling by', ce.by, 'use kg', (ce.use/P.K.g).toPrecision(3), 'shakeFrom at ceiling', P.RESTRAINT.MOVES.throw.shakeFrom(rc, p.opt), 'landed', rc.flight && rc.flight.landed, 'range', rc.flight && rc.flight.range);
}
show('bus', 45, 1e9, 'plaster');
const baseball = D.objects.find(o => o.id === 'baseball');
// all-star baseball: 1.8e23 kg dial (200e18 short tons)
{ const c = mk(200e18 * 907.18474, 'concrete', true); const r = P.throwObject(c, baseball, 45);
  const opt = { near: 5, obj: baseball, angle: 45, surface: c.surface, body: c.body, ownRecoil: true, unbreakable: true, airAbsorb: 1 };
  console.log('allstar 45 relativistic', r.flight.relativistic, 'landed', r.flight.landed, 'shakeFrom', P.RESTRAINT.MOVES.throw.shakeFrom(r, opt), 'landShake', P.RESTRAINT.MOVES.throw.landShake(r, opt)); }
