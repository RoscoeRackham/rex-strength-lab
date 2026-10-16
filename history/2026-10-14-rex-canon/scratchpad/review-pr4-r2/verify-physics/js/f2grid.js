const { P, D, g, R3, O3, c3 } = require('./common.js');
const AW = P.AW;
let n = 0, missSlide = 0, falseSlide = 0;
for (const s of D.surfaces.map((x) => x.id)) for (let la = 2.5; la <= 9; la += 0.5) for (let lb = 2.5; lb <= 9; lb += 0.5) {
  const cA = c3(Math.pow(10, la) * g, R3, { keepForm: false }, s), cB = c3(Math.pow(10, lb) * g, O3, { keepForm: false }, s);
  const r = P.armWrestle(cA, cB);
  if (r.outcome !== 'pin' || !r.tableBreaks) continue;
  n++;
  const aWins = r.winner === 'A', Pw = aWins ? r.AA : r.AB, Pl = aWins ? r.PB : r.PA, ml = (aWins ? cB : cA).body.m, M = AW.effMass * (cA.body.m + cB.body.m);
  const a = (Pw - Pl) / M, elbow = Math.abs(AW.holdArm * ml * a - (Pl + AW.effMass * ml * a)), Rl = aWins ? r.RB : r.RA;
  if (elbow > Rl && !r.loserSlides) missSlide++;
  if (elbow <= Rl && r.loserSlides) falseSlide++;
}
console.log('standing pins', n, 'elbow > footing but loserSlides false', missSlide, '| loserSlides true but elbow <= footing', falseSlide);
