const { P, D, ctx, surf } = require('./env');
const kg = 100 * 907.18474;
// least effort for stomp: find what the page uses
const M = P.RESTRAINT.MOVES.stomp;
const a = P.stomp(ctx(kg)), b = P.stomp(ctx(kg, { ownRecoil: false }));
console.log('full strength stomp: on vBody', a.vBody, 'E', a.E, 'bolted', a.bolted, '| off vBody', b.vBody, 'E', b.E);
// lift car grip
const car = D.objects.find(o => o.id === 'car');
const L = P.lift(ctx(kg), car), L0 = P.lift(ctx(kg, { keepForm: false }), car);
console.log('lift car gripRatio', L.gripRatio, 'gripRatioRaw', L.gripRatioRaw, '| off gripRatio', L0.gripRatio);
