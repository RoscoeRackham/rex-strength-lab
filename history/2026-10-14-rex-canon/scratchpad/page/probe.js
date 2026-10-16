global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R + 'src/engine.js'); require(R + 'src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), ollie = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c = (F, x, body) => Object.assign({ F, mode: 'comic', body: body || rex, surface: surf('concrete'), anchor: 'friction' }, ON, x || {});
const F0 = 100 * 907.18474 * g;
const pick = (o, ks) => Object.fromEntries(ks.map((k) => [k, o[k]]));
// least disruptive car 45
const pl = P.RESTRAINT.planNow('throw', c(F0), { obj: obj('car'), angle: 45, target: 30 });
const gl = pl.goal(); console.log('least use kgf', gl.use / g);
const r = P.throwObject(c(F0, { use: gl.use }), obj('car'), 45);
console.log('throw least', r.recoilAbsorbed, r.toGround, r.recoilV, r.sinkRatioRaw);
const r0 = P.throwObject(c(F0, { use: gl.use, ownRecoil: false }), obj('car'), 45);
console.log('throw least off', r0.recoilV, r0.toGround, r0.anchor.R);
const ra = P.throwObject(c(F0), obj('car'), 45), ra0 = P.throwObject(c(F0, { ownRecoil: false }), obj('car'), 45);
console.log('allout', ra.recoilAbsorbed, 'off recoilV', ra0.recoilV, ra0.toGround && ra0.toGround.J);
// bolted + power
const rb = P.throwObject(c(F0, { anchor: 'bolted' }), obj('car'), 45);
console.log('bolted+power', rb.recoilAbsorbed, rb.toGround);
// stomp
const s = P.stomp(c(F0)), s0 = P.stomp(c(F0, { ownRecoil: false }));
console.log('stomp', s.recoilAbsorbed, s.bolted, s0.vBody);
// punch
const pu = P.punch(c(F0)), pu0 = P.punch(c(F0, { ownRecoil: false }));
console.log('punch', pu.recoilAbsorbed, pu0.recoilV, pu0.lurch);
// pull
const pp = P.pull(c(F0), obj('car'));
console.log('pull', pick(pp, ['ownRecoil', 'recoilAbsorbed', 'ropeT', 't10m', 'canMove', 'footLimited']));
const ppb = P.pull(c(F0, { anchor: 'bolted' }), obj('car'));
console.log('pull bolted', pick(ppb, ['ownRecoil', 'recoilAbsorbed', 'ropeT', 't10m', 'canMove']));
// shove
const sh = P.shove(c(F0), c(F0, {}, ollie));
console.log('shove', sh.recoilAbsorbed, sh.toGround, sh.vB, sh.slideB, sh.vA);
// catch leg baseball easy 10 m
for (const [o, st, D0, F] of [['baseball', 'easy', 10, F0], ['car', 'hard', 10, 1e9 * g], ['baseball', 'hard', 10, 1e9 * g], ['bus', 'hard', 10, F0], ['baseball', 'hard', 10, 1e20 * g], ['car', 'hard', 10, F0]]) {
  const L = P.catchLeg(c(F), c(F, {}, ollie), obj(o), D0, st);
  const L0 = P.catchLeg(c(F), c(F, { ownRecoil: false }, ollie), obj(o), D0, st);
  console.log('catch', o, st, F / g, L.result, L.recoilAbsorbedT, L.recoilAbsorbedC, L.toGroundT, L.toGroundC, 'k', L.catch && pick(L.catch, ['slips', 'slide', 'uAfter', 'carried', 'R']), '| off:', L0.result, L0.catch && pick(L0.catch, ['slips', 'slide', 'uAfter', 'carried']), L0.toGroundC && L0.toGroundC.J);
}
// toss
const t = P.tossPartner(c(F0), ollie, 'Ollie', 'easy', 10, 'friction');
console.log('toss', t.result, t.recoilAbsorbedT, t.recoilAbsorbedC, t.toGroundT, t.toGroundC, t.catch && t.catch.sinkRatioRaw);
// arm
const aw = P.armWrestle(c(F0), c(F0, {}, ollie));
console.log('arm', aw.outcome, aw.recoilAbsorbed, aw.toGround, aw.pin && aw.pin.t, P.limbPulse(rex));
const aw2 = P.armWrestle(c(1e6 * g), c(1e4 * g, {}, ollie));
console.log('arm2', aw2.outcome, aw2.winner, aw2.recoilAbsorbed, aw2.toGround, aw2.pin && aw2.pin.t);
// throwPartner
const tp = P.throwPartner(c(F0), c(F0, {}, ollie), 45);
console.log('throwPartner', tp.r.recoilAbsorbed, tp.r.toGround, tp.landToGround);
