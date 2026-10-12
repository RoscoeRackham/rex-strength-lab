global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const conc = D.surfaces.find((s) => s.id === 'concrete');
const fmt = (x) => x.toExponential(2);
for (const [name, E] of [['chicxulub', 4.2e23], ['sun1s', 3.8e26]]) {
  for (const s of [0.5, 1]) {
    const I = P.instantGrowth(rex, E, s, { surface: conc, groundHolds: false, bolted: false });
    const g2 = I.grown;
    const travel = g2.dH / 2 - I.vLeave * I.tau / 2; // soles go down roughly dH/2 minus CM rise (crude)
    const vSole = I.vcm - I.vLeave;
    const Wbear = I.Fmax * travel;
    const Wponc = I.soles * (I.qGround + P.K.PONCELET_K * (conc.rho || 2400) * vSole * vSole) * travel;
    console.log(name, 'form s', s, 'driven', I.driven, 'dH', g2.dH.toFixed(2), 'tau ms', (I.tau * 1e3).toFixed(2), 'vcm', I.vcm.toFixed(0), 'vLeave', I.vLeave.toExponential(2), 'soles m2', I.soles.toFixed(2), 'q', fmt(I.qGround), 'rho', conc.rho);
    console.log('   air blast Elo', fmt(I.Elo), 'Ehi', fmt(I.Ehi), '| ground work bearing-only', fmt(Wbear), 'Poncelet', fmt(Wponc), 'ratio to Ehi', (Wponc / I.Ehi).toFixed(0), 'to Elo', (Wponc / I.Elo).toFixed(0), 'dpLo', fmt(I.dpLo), 'dpHi', fmt(I.dpHi), 'uHead', I.uHead.toFixed(0), 'u', I.u.toFixed(0));
  }
}
