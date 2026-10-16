// item 3's 'Old and new' ledger figures, at the brief's pin (3,007 kg, kV 0.10017) and at 3,000 kg
global.window = {};
const root = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(root + '/src/engine.js');
require(root + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 4) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const F0 = 100 * 907.18474 * g;
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const [tag, kV, m] of [['pin 3007', 0.10017, 3007], ['now 3000', 0.099947, 3000]]) {
  P.BUILDS.rex.kV = kV;
  const body = P.makeBody({ build: 'rex', H: 3.048, m });
  const c = (x) => Object.assign({ F: F0, mode: 'comic', body, surface: sf('concrete'), anchor: 'friction' }, POW, x || {});
  const show = (lbl, ctx, oid, ang) => {
    const r = P.throwObject(ctx, ob(oid), ang), th = ang * Math.PI / 180;
    const pObj = P.vToMomentum(r.v, ob(oid).m), pArm = r.push.pB * r.armMass / r.mB;
    const pRec = r.push.pA === Infinity ? Infinity : Math.max(0, r.push.pA - pArm);
    const tg = r.toGround || {};
    console.log(tag, lbl, JSON.stringify({ v: sig(r.v), pObj: sig(pObj), pObj_x: sig(pObj * Math.cos(th)), pObj_y: sig(pObj * Math.sin(th)), pA: sig(r.push.pA), pArm: sig(pArm), pRecoil: sig(pRec), recoilV: sig(r.recoilV),
      toGround: { J: sig(tg.J), whole: sig(tg.whole), supplied: sig(tg.supplied), suppliedDown: sig(tg.suppliedDown), suppliedSide: sig(tg.suppliedSide), sideTaken: sig(tg.sideTaken), T: sig(tg.T) }, basis: r.basis || 'comic', sinkRatio: sig(r.sinkRatio), sinkRatioRaw: sig(r.sinkRatioRaw) }));
  };
  show('least car 45 (22,100 kgf)', c({ use: 22100 * g }), 'car', 45);
  show('allout car 45 dial 1e12', c({ F: 1e12 * g }), 'car', 45);
  show('allout car 45 dial 1e12, powers off', Object.assign(c({ F: 1e12 * g }), { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }), 'car', 45);
  show('allout car 45 dial 1e12, ownRecoil only', Object.assign(c({ F: 1e12 * g }), { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: true }), 'car', 45);
  const j = P.jump(c({ F: Infinity }));
  console.log(tag, 'unlimited comic jump pushOff', JSON.stringify(j.pushOff));
}
