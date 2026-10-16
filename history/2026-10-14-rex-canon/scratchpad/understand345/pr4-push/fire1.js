const { P, g, ON, OFF, DIAL, pair, sig, rex, ollie, surf, obj, ctxOf } = require('./common.js');
const show = (lab, L) => {
  if (!L) return console.log(lab, 'null');
  const fb = L.fireball;
  console.log(lab, 'result', L.result, fb ? JSON.stringify({ kind: fb.kind, E: sig(fb.E), p: sig(fb.p), push: { recoilV: sig(fb.push.recoilV), earthRecoilV: sig(fb.push.earthRecoilV) }, Ehere: sig(fb.Ehere), Eafter: sig(fb.Eafter), Ecarry: sig(fb.Ecarry), Enear: sig(fb.Enear), Eblast: sig(fb.Eblast), mLump: fb.mLump && sig(fb.mLump) }) : '', L.toGroundT ? 'toGroundT ' + sig(L.toGroundT.J) : '', L.toGroundC ? 'toGroundC ' + sig(L.toGroundC.J) : '');
};
const cases = [];
for (const [lab, x] of [['ON air0.5', Object.assign({}, ON, { airAbsorb: 0.5 })], ['ON air0', Object.assign({}, ON, { airAbsorb: 0 })], ['ON air1', ON], ['OFF', OFF], ['ON air0.5 kf off', Object.assign({}, ON, { airAbsorb: 0.5, keepForm: false })]]) {
  for (const lg of [14, 16, 20]) for (const [oid, D0] of [['baseball', 1000], ['baseball', 30], ['car', 1000], ['car', 30]]) for (const aC of ['friction', 'bolted']) {
    const cR = ctxOf(Math.pow(10, lg) * g, x, rex), cO = ctxOf(Math.pow(10, lg) * g, Object.assign({}, x, { anchor: aC }), ollie);
    const t0 = Date.now();
    const L = P.catchLeg(cR, cO, obj(oid), D0, 'hard');
    if (L && L.result === 'fireball') show([lab, 'lg' + lg, oid, D0, aC, (Date.now() - t0) + 'ms'].join(' '), L);
    else console.log([lab, 'lg' + lg, oid, D0, aC].join(' '), 'result', L && L.result, (Date.now() - t0) + 'ms');
  }
}
