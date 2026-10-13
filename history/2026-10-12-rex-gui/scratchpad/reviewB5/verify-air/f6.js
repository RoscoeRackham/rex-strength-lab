const { P, D, rex, surf, obj } = require('./h.js');
const car = obj('car');
const c = { F: 1e8 * P.K.g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: 0.5, keepForm: true, unbreakable: true, ownRecoil: true };
const r = P.throwObject(c, car, 45);
const o = Object.assign({}, c, { obj: car, angle: 45 });
const b = P.RESTRAINT.MOVES.throw.blastParts(r, o);
console.log('v', r.v, 'dragLoss', r.dragLoss, 'dragLoss0', r.dragLoss0, 'blastParts', b);
const R = (E) => P.blastRadius ? P.blastRadius(E, 100) : null;
console.log(Object.keys(P).filter(k => /blast|overpress|radius/i.test(k)));
