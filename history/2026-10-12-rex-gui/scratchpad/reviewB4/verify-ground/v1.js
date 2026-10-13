const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const sand = D.surfaces.find(s => s.id === 'sand');
const g = P.K.g;
const ctx = (kg, o) => Object.assign({ F: kg * g, mode: 'comic', body, surface: sand, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
const car = D.objects.find(o => o.id === 'car');
const qult = (sand.granular ? sand.qult * body.footB / sand.Bref : sand.qult);
const Nmax = qult * 2 * body.footArea;
console.log('sand Nmax N', Nmax.toFixed(0), 'Rex weight', (body.m*g).toFixed(0), 'car m', car.m, 'Rex+car weight', ((body.m+car.m)*g).toFixed(0));
console.log('limbPulse', P.limbPulse ? P.limbPulse(body) : 'n/a');
for (const ang of [90, 45, 0]) {
  const r = P.throwObject(ctx(1e5), car, ang);
  const tg = r.toGround;
  console.log('ang', ang, 'v', r.v.toFixed(1), 'sinkRatioRaw', r.sinkRatioRaw && r.sinkRatioRaw.toFixed(3), 'toGround', tg && { J: tg.J.toFixed(0), T: tg.T.toFixed(4), supplied: tg.supplied && tg.supplied.toFixed(0) }, 'pObj', (r.Eobj ? Math.sqrt(2*car.m*r.Eobj) : 0).toFixed(0), 'push.t', r.push && r.push.t);
  if (tg) {
    const th = ang*Math.PI/180, J = tg.J + (tg.supplied||0);
    // share of downward part credited to ground
    const Jdown = J*Math.sin(th);
    const Jgdown = Math.sqrt(Math.max(0, tg.J*tg.J - (J*Math.cos(th))**2));
    const T = tg.T;
    const jumpRule = Math.min(Jdown, Math.max(0, Nmax - (body.m + car.m)*g) * T);
    console.log('   J total', J.toFixed(0), 'Jdown', Jdown.toFixed(0), 'ground-down', Jgdown.toFixed(0), 'share', Jdown>0 ? (Jgdown/Jdown*100).toFixed(1)+'%' : '-', 'jump-rule ground-down', jumpRule.toFixed(0));
  }
}
