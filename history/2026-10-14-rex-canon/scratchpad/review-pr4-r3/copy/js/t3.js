const { P, D, g, mk, ol } = require('./eng.js');
const f = (k, x) => typeof x === 'number' ? +x.toPrecision(4) : x;
for (const kg of [100 * 907.18474, 1e6, 1e7]) {
  const F = kg * g;
  const r = P.armWrestle(mk({ F, keepForm: false, unbreakable: false }), ol({ F, keepForm: false, unbreakable: false, anchor: 'bolted' }));
  console.log(kg, JSON.stringify({ o: r.outcome, contact: r.contact, dA: r.draggedA, dB: r.draggedB, tearA: r.tearA, tearB: r.tearB, RB: r.RB, clash: r.clash, tB: r.tornB }, f));
  // mirror: power off
  const r0 = P.armWrestle(mk({ F, keepForm: false, unbreakable: false, ownRecoil: false }), ol({ F, keepForm: false, unbreakable: false, anchor: 'bolted', ownRecoil: false }));
  console.log('  off', JSON.stringify({ o: r0.outcome, contact: r0.contact, dA: r0.draggedA, dB: r0.draggedB, tearB: r0.tearB }, f));
}
