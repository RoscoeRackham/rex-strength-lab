global.window = {};
const P = require('./engine-pr2.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, extra || {});
const res = (n, c) => console.log((c ? 'pass ' : 'FAIL ') + n);
const conc = surf('concrete'), sand = surf('sand'), Nmax = (sf, B) => P.qultFor(sf, (B || rex).footB) * 2 * (B || rex).footArea, qf = (sf) => P.qultFor(sf, rex.footB);
// 171
{ const ob = obj('baseball'), bad = [];
  for (const [F, sh] of [[200e18 * 907.18474 * g, 0.5], [200e18 * 907.18474 * g, 0.99], [200e18 * 907.18474 * g, 1], [1e16 * g, 0.99]]) {
    const cR = ctxOf(F, Object.assign({}, ON, { airAbsorb: sh, anchor: 'bolted' })), L = P.catchLeg(cR, Object.assign({}, cR, { body: ollie }), ob, 1000, 'hard');
    const E = P.throwObject(cR, ob, 0).Eobj, Ein = L.sheath ? E - L.sheath.E : E, pW = Math.sqrt(E * E + 2 * E * ob.m * P.K.c * P.K.c) / P.K.c;
    if (!(L.result === 'caught' && near(L.catch.Ecatch, Ein, 1e-6) && near(L.toGroundC ? L.toGroundC.J : NaN, pW, 1e-6))) bad.push(sh + (L.recoilC ? ' recoilC ok? ' + near(L.recoilC.J, pW, 1e-6) : ''));
  }
  res('171 sheath catch toGroundC (as written) ' + bad.join('; '), !bad.length); }
// 371
{ const cO = Object.assign({}, ctxOf(1e6 * g), { body: ollie }), cOr = Object.assign({ ownRecoil: true }, cO);
  const k1 = P.catchIt(cOr, obj('car'), 60, 10, null), k0 = P.catchIt(cO, obj('car'), 60, 10, null);
  res('371 catcher footing is his own: k1.slide ' + k1.slide + ' k0.slide ' + k0.slide.toFixed(2) + ' k1.R ' + k1.R + ' k0.R ' + k0.R.toFixed(0), k1.slide === k0.slide && k1.R === k0.R); }
// 390
{ const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: sand })), te = P.tossPartner(c, ollie, 'Ollie', 'easy', 1000, 'friction');
  res('390 toss on sand with ON: toGroundT present', !!te.toGroundT);
  const c2 = ctxOf(1e7 * g, Object.assign({}, ON, { surface: sand, ownRecoil: false })), te2 = P.tossPartner(c2, ollie, 'Ollie', 'easy', 1000, 'friction'), th2 = P.tossPartner(c2, ollie, 'Ollie', 'hard', 1000, 'friction');
  const bear = Math.max(0, qf(sand) * 2 * rex.footArea - (rex.m + ollie.m) * g);
  res('390 moved to ownRecoil false', te2.toGroundT && te2.toGroundT.J <= bear * te2.toGroundT.T + 1e-9 && te2.toGroundT.J <= th2.toGroundT.J + 1e-9 && near(te2.toGroundT.J + te2.toGroundT.supplied, te2.toGroundT.whole, 1e-12) && th2.toGroundT.supplied > 0); }
// 461
for (const own of [true, false]) { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: conc, ownRecoil: own })), t = P.tossPartner(c, ollie, 'Ollie', 'easy', 1000, 'friction'), bear = Nmax(conc) - (rex.m + ollie.m) * g;
  res('461 toss+catch concrete cap, ownRecoil ' + own, t.toGroundT && t.toGroundT.supplied > 0 && near(t.toGroundT.J, bear * t.toGroundT.T, 1e-9) && t.toGroundC && t.toGroundC.supplied > 0 && near(t.toGroundC.J, bear * t.toGroundC.T, 1e-9)); }
// 466
for (const own of [true, false]) { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: conc, ownRecoil: own })), L = P.catchLeg(c, Object.assign({}, c, { body: ollie, anchor: 'bolted' }), obj('car'), 1000, 'easy'), tg = L.toGroundC;
  const th = L.angleDeg * Math.PI / 180, capD = (Nmax(conc, ollie) - (ollie.m + obj('car').m) * g) * (tg ? tg.T : NaN);
  res('466 catch cap bolted Ollie, ownRecoil ' + own, L.result === 'caught' && tg && tg.supplied > 0 && near(tg.J, Math.hypot(tg.whole * Math.cos(th), capD), 1e-9)); }
// 476 toss part
for (const own of [true, false]) { const c = ctxOf(Infinity, Object.assign({}, ON, { ownRecoil: own })), t = P.tossPartner(c, ollie, 'Ollie', 'hard', 10, 'friction');
  res('476 unbounded toss capped, ownRecoil ' + own, t.toGroundT && isFinite(t.toGroundT.J) && t.toGroundT.supplied === Infinity); }
// 520 throwPartner part
for (const ex of [{}, { ownRecoil: false }, { ownRecoil: false, anchor: 'bolted' }]) { const cc = ctxOf(Infinity, Object.assign({}, ON, ex)), t = P.throwPartner(cc, Object.assign({}, cc, { body: ollie }), 45), tg = P.throwObject(cc, obj('car'), 45).toGround;
  const noNaN = (x) => x && Object.values(x).every((v) => typeof v !== 'number' || !Number.isNaN(v));
  res('520 unbounded angled ' + JSON.stringify(ex), tg && tg.J === Infinity && tg.supplied === Infinity && tg.suppliedDown === Infinity && tg.suppliedSide === 0 && noNaN(tg) && noNaN(t.r.toGround)); }
