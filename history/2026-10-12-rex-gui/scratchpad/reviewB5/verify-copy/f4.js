const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const car = D.objects.find(o => o.id === 'car');
const ctx = { F: Infinity, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const r = P.throwObject(ctx, car, 90);
console.log('hand', JSON.stringify(P.RESTRAINT.MOVES.throw.hand(r, { body, obj: car })), 'blast', P.RESTRAINT.MOVES.throw.blast ? 'has blast' : '');
