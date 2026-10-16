const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
const ch = (kg) => P.collide(c3(kg * g, O3), c3(kg * g, R3), { source: 'sprint', bounce: true });
const end = (kg, withDuring) => { const r = ch(kg); if (!r.carry) return -1; return r.after.bounce.slideB + (withDuring ? r.carry.v * r.contact.softEl.t : 0); };
const bis = (withDuring) => { let lo = 3090, hi = 4000; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (end(m, withDuring) > 5) hi = m; else lo = m; } return lo; };
const a = bis(false), b = bis(true);
console.log('ceiling slide alone', sig(a), 'kg-force; with the contact travel', sig(b));
for (const kg of [3310, a]) { const r = ch(kg); console.log(sig(kg), 'v', sig(r.carry.v), 'T', sig(r.contact.softEl.t), 'travel during contact', sig(r.carry.v * r.contact.softEl.t), 'slideB', sig(r.after.bounce.slideB), 'ends', sig(r.carry.v * r.contact.softEl.t + r.after.bounce.slideB)); }
// the power-off bounce: does Rex move during the contact there? (two finite bodies: the CM moves at v/2)
const r0 = P.collide(c3(3310 * g, O3, { ownRecoil: false }), c3(3310 * g, R3, { ownRecoil: false }), { source: 'sprint', bounce: true });
console.log('power off 3310 bounce', r0.outcome, 'vB', sig(r0.after.bounce.vB), 'slideB', sig(r0.after.bounce.slideB), 'T', sig(r0.contact.softEl.t));
