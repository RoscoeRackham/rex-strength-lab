const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
const c = ctxOf(1e12);
const r = P.throwObject(Object.assign({}, c, { record: true }), obj('car'), 45);
const f = r.flight;
console.log({ v: r.v, Eobj: r.Eobj, EobjTNT_kg: r.Eobj / 4.184e6, recoilV: r.recoilV, recoilE: r.recoilE, recoilTNT_kg: r.recoilE / 4.184e6, range: f.range, vImpact: f.vImpact, Eimpact: r.Eimpact, EimpactTNT_kg: r.Eimpact / 4.184e6, dragLoss: r.dragLoss, dragLossTNT_kg: r.dragLoss / 4.184e6, relativistic: f.relativistic });
const M = P.RESTRAINT.MOVES.throw;
const opt = { obj: obj('car'), angle: 45, near: 5, surface: surf('concrete'), body: c.body };
console.log('blast counted (J):', M.blast(r, opt), 'radius at 6.9 kPa:', P.blastRadius(M.blast(r, opt), 6900));
console.log('if drag loss were a blast: radius at 6.9 kPa', P.blastRadius(r.dragLoss, 6900), ' at 26.8 kPa', P.blastRadius(r.dragLoss, 26800), ' recoil E at 6.9 kPa', P.blastRadius(r.recoilE || 0, 6900));
