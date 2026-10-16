const { P, D, g, mk, ol, DIAL } = require('./eng.js');
const f = (x) => typeof x === 'number' ? +x.toPrecision(4) : x;
const show = (lab, o) => console.log(lab, JSON.stringify(o, (k, x) => typeof x === 'number' ? f(x) : x));
// 1 m/s set speed
let r = P.collide(ol(), mk(), { source: 'set', gb: 1 / P.K.c });
show('1m/s', { pGain: r.carry.pGain, footJ: r.carry.footJ, sup: r.carry.supplied, F: r.carry.F, Q: r.Q, hQ: r.h && r.h.Q });
// jump onto Rex on real ground (unbreakable off), default dial
r = P.collide(ol({ unbreakable: false }), mk({ unbreakable: false }), { source: 'jump' });
show('jump real', { out: r.outcome, pGain: r.carry && r.carry.pGain, footJ: r.carry && r.carry.footJ, sup: r.carry && r.carry.supplied, F: r.carry && r.carry.F, Q: r.Q, v: r.vRel });
// granite
const gr = D.surfaces.find((s) => s.id === 'granite');
r = P.collide(ol({ unbreakable: false, surface: gr }), mk({ unbreakable: false, surface: gr }), { source: 'jump' });
show('jump granite', { out: r.outcome, F: r.carry && r.carry.F, Q: r.Q });
// jump at 1e9
const F9 = 1e9 * g;
r = P.collide(ol({ F: F9 }), mk({ F: F9 }), { source: 'jump' });
show('jump 1e9', { out: r.outcome, v: r.vRel, v0: r.v0 });
r = P.collide(ol({ F: F9 }), mk({ F: F9 }), { source: 'stomp' });
show('stomp 1e9', { out: r.outcome, v: r.vRel, v0: r.v0 });
// bounce 0.1%c
r = P.collide(ol(), mk(), { source: 'set', gb: 0.001 / Math.sqrt(1 - 1e-6), bounce: true });
show('bounce .1c', { sup: r.carry && r.carry.supplied, bounce: r.after && r.after.bounce, pg: r.carry && r.carry.pGainBounce });
console.log(Object.keys(r.carry || {}));
// shoving match at least effort 2570 kg-force
r = P.pushMatch(mk({ F: 2570 * g }), ol({ F: 2570 * g }));
show('match 2570', { o: r.outcome, vA: r.vA, slideA: r.slideA, xA: r.xA });
// standing dead heat arm, keepForm off, equal
r = P.armWrestle(mk({ keepForm: false }), ol({ keepForm: false }));
show('arm eq kf off', { o: r.outcome, contact: r.contact, by: r.by, draggedA: r.draggedA, draggedB: r.draggedB });
// steady push 1800 kg-force Ollie
r = P.standoff(ol({ F: 1800 * g }), mk());
show('push 1800', { o: r.outcome, DA: r.DA, cantStand: r.cantStand });
