const { P, g, R3, O3, ON, DIAL, ctx, sig, surf, obj } = require('./common');
const J = (r) => JSON.stringify(r, (k, v) => typeof v === 'number' ? sig(v) : (k === 'grav' ? undefined : v));
const pm = (lab, FR, FO, x, xo) => { const r = P.pushMatch(ctx(FR, R3, Object.assign({}, ON, x)), ctx(FO, O3, Object.assign({}, ON, x, xo))); console.log('PM', lab, J(r)); return r; };
pm('default dial', DIAL, DIAL);
pm('least (walk need)', 1.2 * 3000 * g / 1.4, 1.2 * 3000 * g / 1.4);
pm('gravel Rex dial vs Ollie 2200 kgf', DIAL, 2200 * g, { surface: surf('gravel') });
pm('concrete Ollie 1000 kgf', DIAL, 1000 * g);
pm('Rex bolted', DIAL, DIAL, {}, {}); 
console.log('PM Rex bolted', J(P.pushMatch(ctx(DIAL, R3, Object.assign({}, ON, { anchor: 'bolted' })), ctx(DIAL, O3, ON))));
pm('unlimited', Infinity, Infinity);
console.log('PM unl vs bolted real', J(P.pushMatch(ctx(Infinity, R3, Object.assign({}, ON, { unbreakable: false })), ctx(DIAL, O3, Object.assign({}, ON, { unbreakable: false, anchor: 'bolted' })))));
console.log('PM unl vs bolted unbreakable', J(P.pushMatch(ctx(Infinity, R3, ON), ctx(DIAL, O3, Object.assign({}, ON, { anchor: 'bolted' })))));
console.log('PM off', J(P.pushMatch(ctx(DIAL, R3), ctx(DIAL, O3))));
// shoveBoth
const sb = P.shoveBoth(ctx(DIAL, R3, ON), ctx(DIAL, O3, ON)); console.log('SB', sb.shover, sb.both, sig(sb.vA), sig(sb.vB), sig(sb.slideA), sig(sb.slideB));
const sb0 = P.shoveBoth(ctx(DIAL, R3), ctx(DIAL, O3)); console.log('SB off', sb0.shover, sig(sb0.vA), sig(sb0.vB));
// standoff
const so = P.standoff(ctx(DIAL, O3, ON), ctx(DIAL, R3, ON)); console.log('SO', J(so));
const so0 = P.standoff(ctx(DIAL, O3), ctx(DIAL, R3)); console.log('SO off', so0.outcome, sig(so0.contact));
console.log('SO unl vs bolted real', J(P.standoff(ctx(Infinity, O3, Object.assign({}, ON, { unbreakable: false })), ctx(DIAL, R3, Object.assign({}, ON, { unbreakable: false, anchor: 'bolted' })))));
console.log('SO unl vs bolted unbreak', J(P.standoff(ctx(Infinity, O3, ON), ctx(DIAL, R3, Object.assign({}, ON, { anchor: 'bolted' })))));
console.log('SO bolted real rock dial', J(P.standoff(ctx(DIAL, O3, Object.assign({}, ON, { unbreakable: false })), ctx(DIAL, R3, Object.assign({}, ON, { unbreakable: false, anchor: 'bolted' }))).rock));
// arm
const aw = (lab, FR, FO, x) => { const r = P.armWrestle(ctx(FR, R3, Object.assign({}, ON, x)), ctx(FO, O3, Object.assign({}, ON, x))); console.log('AW', lab, r.outcome, r.winner, 'table', r.tableBreaks, r.tableBreaksBy, 'pad', sig(r.padLoad), 'AA', sig(r.AA), 'AB', sig(r.AB), r.pin ? 'pin v ' + sig(r.pin.v) : '', 'slam', sig(r.slamRatio), r.draggedA, r.draggedB, r.winnerSlides, r.loserSlides, r.clash); };
aw('dial vs 1t', DIAL, 1000 * g);
aw('dial vs 1t kf off', DIAL, 1000 * g, { keepForm: false });
aw('both dial kf off', DIAL, DIAL, { keepForm: false });
aw('100t vs 200t kf off', 1e5 * g, 2e5 * g, { keepForm: false });
aw('unl both kf off', Infinity, Infinity, { keepForm: false });
aw('unl both kf off bolted unbreak', Infinity, Infinity, { keepForm: false, anchor: 'bolted' });
aw('unl both kf off bolted real', Infinity, Infinity, { keepForm: false, anchor: 'bolted', unbreakable: false });
