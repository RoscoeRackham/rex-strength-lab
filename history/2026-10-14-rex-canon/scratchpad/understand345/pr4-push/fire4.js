const { P, g, ON, sig, rex, ollie, obj, ctxOf } = require('./common.js');
const base = { airAbsorb: 0, keepForm: false, unbreakable: true, ownRecoil: true };
for (const [lg, oid, D0] of [[14, 'baseball', 10], [14, 'baseball', 1000], [16, 'car', 30], [20, 'baseball', 10], [20, 'car', 30]]) {
  const L = P.catchLeg(ctxOf(Math.pow(10, lg) * g, base, rex), ctxOf(Math.pow(10, lg) * g, base, ollie), obj(oid), D0, 'hard');
  const fb = L.fireball;
  console.log(lg, oid, D0, L.result, fb.kind, 'E', sig(fb.E, 3), 'Egap (air heat, real)', sig(fb.Egap, 3), 'Earr (motion freed at him)', sig(fb.Earr, 3), 'share heat', sig(fb.Egap / fb.E, 2), 'p', sig(fb.p, 3), 'recoilV', sig(fb.push.recoilV, 3), 'Ehere', sig(fb.Ehere, 3), 'Ecarry', sig(fb.Ecarry, 3), 'Eblast', sig(fb.Eblast, 3));
}
