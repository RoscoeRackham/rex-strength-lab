const { P, D, g, R3, O3, surf, mk } = require('./eng.js')(process.argv[2]);
console.log('surfaces', D.surfaces.map(s=>s.id+':'+(s.shear||'-')).join(' '));
const f = (x) => (x == null ? '-' : typeof x === 'number' ? Number(x.toPrecision(4)) : x);
for (const sid of ['concrete','granite','sand','softclay','ice','gravel']) {
  if (!surf(sid)) continue;
  for (const [lr, lo, ancR, ancO] of [[7,3,'friction','bolted'],[6.5,6.5,'friction','bolted'],[7,6.4,'bolted','friction'],[6,3,'friction','bolted'],[5,3,'friction','bolted'],[6.5,6.5,'bolted','bolted'],[8,8,'bolted','bolted']]) {
    const r = P.armWrestle(mk({ F: Math.pow(10, lr) * g, keepForm: false, unbreakable: false, surface: surf(sid), anchor: ancR }), mk({ F: Math.pow(10, lo) * g, keepForm: false, unbreakable: false, surface: surf(sid), anchor: ancO, body: O3 }));
    const loose = (b) => P.anchorCapacity({ body: b, surface: surf(sid), theta: 0, anchor: 'friction', groundHolds: false }).R;
    console.log(sid, lr, lo, ancR, ancO, r.outcome, 'w', r.winner, 'tearA', f(r.tearA), 'tearB', f(r.tearB), 'tornA', r.tornA, 'tornB', r.tornB, 'hA', f(r.holdAfterA), 'hB', f(r.holdAfterB), 'looseR', f(loose(R3)), 'elbow', f(r.loserElbow), 'lS', r.loserSlides, 'wS', r.winnerSlides, 'dA', r.draggedA, 'dB', r.draggedB, 'RA', f(r.RA), 'RB', f(r.RB));
  }
}
