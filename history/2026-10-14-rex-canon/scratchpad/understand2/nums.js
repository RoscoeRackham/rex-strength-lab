const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3000 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const obj = (id) => D.objects.find(o => o.id === id);
const ctx = (kg, extra) => Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, extra || {});
const dial = 90718.474;
for (const use of [22100, undefined]) {
  const c = ctx(dial, use ? { use: use * g } : {});
  const r = P.throwObject(c, obj('car'), 45), r0 = P.throwObject(Object.assign({}, c, { ownRecoil: false }), obj('car'), 45);
  console.log('throw car use', use, 'v', r.v.toFixed(2), 'pObj', P.vToMomentum(r.v, obj('car').m).toFixed(0), 'toGround.J', r.toGround && r.toGround.J.toFixed(0), 'off recoilV', r0.recoilV.toFixed(3), 'sinkRatioRaw', r.sinkRatioRaw && r.sinkRatioRaw.toFixed(4), 'off sinkRatioRaw', r0.sinkRatioRaw && r0.sinkRatioRaw.toFixed(4));
}
const pl = P.pull(ctx(dial), obj('car'));
console.log('pull car all-out: J', (P.vToMomentum(pl.vEnd, obj('car').m) + pl.resist * pl.t10m).toFixed(0), 't10m', pl.t10m.toFixed(2), 'ropeT', pl.ropeT.toFixed(0));
const sh = P.shove(ctx(dial), Object.assign({}, ctx(dial), { body: ollie }));
console.log('shove: toGround.J', sh.toGround && sh.toGround.J.toFixed(0), 'vB', sh.vB.toFixed(2), 'slideB', sh.slideB.toFixed(1));
const st = P.stomp(ctx(dial)), st0 = P.stomp(ctx(dial, { ownRecoil: false }));
console.log('stomp vBody on/off', st.vBody, st0.vBody.toFixed(3), 'vFoot on/off', st.vFoot.toFixed(2), st0.vFoot.toFixed(2));
const pu = P.punch(ctx(dial)), pu0 = P.punch(ctx(dial, { ownRecoil: false }));
console.log('punch lurch off', pu0.lurch, 'recoilV off', pu0.recoilV);
// partner toss default
const t = P.tossPartner(ctx(dial), ollie, 'Ollie', 'easy', 10);
console.log('toss: result', t.result, 'toGroundT', t.toGroundT && t.toGroundT.J.toFixed(0), 'toGroundC', t.toGroundC && t.toGroundC.J.toFixed(0), 'catch sinkRatioRaw', t.catch && t.catch.sinkRatioRaw);
// catch default baseball
const L = P.catchLeg(ctx(dial), Object.assign({}, ctx(dial), { body: ollie }), obj('baseball'), 10, 'easy');
console.log('catch baseball: toGroundT', L.toGroundT && L.toGroundT.J, 'toGroundC', L.toGroundC && L.toGroundC.J, 'slide', L.catch && L.catch.slide);
// all-out 1e20 catch carried?
const L20 = P.catchLeg(ctx(1e20), Object.assign({}, ctx(1e20), { body: ollie }), obj('baseball'), 10, 'hard');
console.log('catch 1e20:', L20.result, 'carried', L20.catch && L20.catch.carried, L20.catch && L20.catch.uAfter);
