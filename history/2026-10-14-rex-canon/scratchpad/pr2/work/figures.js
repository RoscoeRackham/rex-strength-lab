// The brief's figures for pull request 2 (BRIEF-canon.md items 2 and 3; SPEC.md's list), at today's 3,000 kg bodies:
// old = main's engine (into the planet), new = this branch (into their source). Run: node figures.js
global.window = {};
const root = '/home/user/rex-strength-lab/rex-strength-lab';
require(root + '/src/data.js');
const D = window.DINO_DATA;
const engines = { old: require(__dirname + '/engine-main.js'), new: require(root + '/src/engine.js') };
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const sig = (x, n = 3) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)).toLocaleString('en-US'));
const J = (x) => (x ? sig(x.J) + ' kg m/s' : 'none');
for (const [tag, P] of Object.entries(engines)) {
  const g = P.K.g, M = P.RESTRAINT.MOVES, DIAL = 100 * 907.18474 * g;
  const rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), ollie = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const ctx = (F, x) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, ON, x || {});
  const opt = (c, o) => Object.assign({ body: rex, surface: c.surface, anchor: c.anchor, near: 5 }, ON, o);
  const mm = (src) => sig(P.ppvAt(src, 5) * 1000) + ' mm/s at 5 m';
  console.log('==== ' + tag + ' engine (' + (tag === 'old' ? 'main, into the planet' : 'this branch, into their source') + '), ' + rex.m + ' kg bodies, the four default powers on');
  { const c = ctx(DIAL), o = { obj: obj('car'), angle: 45, target: 30, near: 5 }, p = P.RESTRAINT.planNow('throw', c, o), gl = p.goal();
    const r = P.throwObject(Object.assign({}, c, { use: gl.use }), obj('car'), 45), oo = opt(c, o), own = r.toGround ? P.impulseSource(c.surface, r.toGround.J, r.toGround.T) : null;
    console.log('car 30 m at 45 deg, least disruptive: ' + sig(gl.use / g) + ' kg-force, ' + sig(r.v) + ' m/s. His push: toGround ' + J(r.toGround) + (own ? ' (' + mm(own) + ')' : '') + ', recoilAbsorbed ' + J(r.recoilAbsorbed) + '. Landing ' + mm(M.throw.landShake(r, oo)) + '; shakeFrom ' + M.throw.shakeFrom(r, oo) + '; ceiling ' + (p.ceiling().by || 'none'));
    const ra = P.throwObject(c, obj('car'), 45), owna = ra.toGround ? P.impulseSource(c.surface, ra.toGround.J, ra.toGround.T) : null;
    console.log('  same, all-out: ' + sig(ra.v) + ' m/s. His push: toGround ' + J(ra.toGround) + (owna ? ' (' + mm(owna) + ')' : '') + ', recoilAbsorbed ' + J(ra.recoilAbsorbed) + '. Landing ' + mm(M.throw.landShake(ra, oo)) + '; plaster reach ' + sig(P.RESTRAINT.reach('throw', ra, oo).plaster) + ' m'); }
  { const c = ctx(1e12 * P.K.g), r = P.throwObject(c, obj('car'), 45), oo = opt(c, { obj: obj('car'), angle: 45 }), tg = r.toGround;
    console.log('car all-out at a 10^12 kg dial: ' + sig(r.v) + ' m/s, escapes ' + r.flight.escaped + '. toGround ' + (tg ? sig(tg.J) + ' (sideways ' + sig(tg.sideTaken) + ', supplied down ' + sig(tg.suppliedDown) + ')' : 'none') + '; recoilAbsorbed ' + (r.recoilAbsorbed ? sig(r.recoilAbsorbed.J) + ' kg m/s back along ' + r.recoilAbsorbed.thetaDeg + ' deg' : 'none') + '; plaster reach ' + sig(P.RESTRAINT.reach('throw', r, oo).plaster) + ' m'); }
  { const cR = ctx(DIAL), cO = Object.assign({}, cR, { body: ollie }), sh = P.shove(cR, cO);
    console.log('Rex shoves Ollie (default dial): Ollie ' + sig(sh.vB) + ' m/s, slides ' + sig(sh.slideB) + ' m; Rex ' + sh.vA + ' m/s. toGround ' + J(sh.toGround) + (sh.toGround ? ' (' + mm(P.impulseSource(cR.surface, sh.toGround.J, sh.toGround.T)) + ')' : '') + '; recoilAbsorbed ' + J(sh.recoilAbsorbed)); }
  { const cR = ctx(1e9 * P.K.g), cO = Object.assign({}, cR, { body: ollie }), L = P.catchLeg(cR, cO, obj('baseball'), 10, 'hard');
    console.log('fastball 10 m apart at 10^9 kg: ' + L.result + ', thrown at ' + sig(L.aim.vL) + ' m/s. Thrower: toGroundT ' + J(L.toGroundT) + (L.toGroundT ? ' (' + mm(P.impulseSource(cR.surface, L.toGroundT.J, L.toGroundT.T)) + ')' : '') + ', recoilAbsorbedT ' + J(L.recoilAbsorbedT) + '. Catcher: toGroundC ' + J(L.toGroundC) + (L.toGroundC ? ' (' + mm(P.impulseSource(cR.surface, L.toGroundC.J, L.toGroundC.T)) + ')' : '') + ', recoilAbsorbedC ' + J(L.recoilAbsorbedC) + '; Ollie moves at ' + sig(L.catch.uAfter) + ' m/s, slides ' + sig(L.catch.slide * 100) + ' cm'); }
  { const cR = ctx(1e20 * P.K.g), cO = Object.assign({}, cR, { body: ollie }), L = P.catchLeg(cR, cO, obj('baseball'), 10, 'hard');
    console.log('catch at a 10^20 kg dial: ' + L.result + '; carried off ' + L.catch.carried + (L.catch.carried ? ' at ' + sig(L.catch.uAfter / 1000) + ' km/s' : '') + '; recoilAbsorbedC ' + J(L.recoilAbsorbedC)); }
  { const c = ctx(DIAL), r = P.pull(c, obj('car')), src = M.pull.shake ? M.pull.shake(r, opt(c, { obj: obj('car') })) : null;
    console.log('pull a car all-out: rope shaking ' + (src ? mm(src) : 'none') + '; recoilAbsorbed ' + (r.recoilAbsorbed ? J(r.recoilAbsorbed) + ' over ' + sig(r.recoilAbsorbed.T) + ' s' : 'none')); }
  { const cR = ctx(DIAL), t = P.tossPartner(cR, ollie, 'Ollie', 'easy', 10, 'friction'), th = P.tossPartner(cR, ollie, 'Ollie', 'hard', 10, 'friction');
    console.log('partner toss 10 m (default dial): gentle ' + t.result + ': toss ' + J(t.toGroundT || t.recoilAbsorbedT) + ' (' + (t.toGroundT ? 'into the ground' : 'to his source') + '), catch ' + J(t.toGroundC || t.recoilAbsorbedC) + '; all-out ' + th.result + ': ' + J(th.toGroundT || th.recoilAbsorbedT) + ' / ' + J(th.toGroundC || th.recoilAbsorbedC));
    const tp = P.throwPartner(cR, Object.assign({}, cR, { body: ollie }), 45);
    console.log('wrestle throw at 45 deg (default dial): Ollie ' + sig(tp.r.v) + ' m/s; toGround ' + J(tp.r.toGround) + ', recoilAbsorbed ' + J(tp.r.recoilAbsorbed));
    const aw = P.armWrestle(cR, Object.assign({}, ctx(DIAL / 2), { body: ollie }));
    console.log('arm pin (default dial against half): swing ' + sig(aw.pin.t) + ' s (limb pulse ' + sig(P.limbPulse(rex)) + ' s); toGround ' + J(aw.toGround) + (aw.toGround ? ' (' + mm(P.impulseSource(cR.surface, aw.toGround.J, aw.toGround.T)) + ')' : '') + ', recoilAbsorbed ' + J(aw.recoilAbsorbed));
    const st = P.stomp(cR);
    console.log('stomp all-out (default dial): the foot\'s momentum ' + sig(st.push.pB) + ' kg m/s; recoilAbsorbed ' + J(st.recoilAbsorbed) + '; blow ' + mm(M.stomp.shake(st, opt(cR, {})))); }
  { const c = ctx(1e9 * P.K.g), r = P.throwObject(c, obj('car'), 45), p = P.RESTRAINT.planNow('throw', c, { obj: obj('car'), angle: 45, target: 30, near: 5 }), pg = p.result('preset:ground');
    console.log('car 45 deg all-out at 10^9 kg: feet load ' + sig(r.sinkRatioRaw) + 'x what concrete bears; the break-the-ground preset ' + (pg.never ? 'never' : sig(pg.use / P.K.g) + ' kg-force')); }
  for (const [oid, sid, th] of [['semi', 'concrete', 0], ['bus', 'gravel', 0]]) {
    const c = ctx(DIAL, { surface: surf(sid) }), p = P.RESTRAINT.planNow('throw', c, { obj: obj(oid), angle: th, target: 30, near: 5 }), pr = p.result('preset:rattle'), ce = p.ceiling();
    console.log(oid + ' on ' + sid + ' at ' + th + ' deg (default dial): rattle preset ' + (pr.never ? 'never' : sig(pr.use / P.K.g) + ' kg-force') + '; ceiling ' + (ce.by ? ce.by + ' at ' + sig(ce.use / P.K.g) + ' kg-force' : 'none'));
  }
  { const cR = ctx(DIAL), L = P.catchLeg(cR, Object.assign({}, cR, { body: ollie }), obj('bus'), 10, 'hard');
    console.log('bus thrown hard 10 m apart (default dial): ' + L.result + (L.catch && L.catch.vSlam > 0 ? ', hits his chest at ' + sig(L.catch.vSlam) + ' m/s' : '') + '; Ollie slides ' + sig(L.catch.slide) + ' m'); }
}
