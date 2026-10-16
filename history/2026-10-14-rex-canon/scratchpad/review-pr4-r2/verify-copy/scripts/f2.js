const { P, mk, ol, g } = require('./common.js');
const r = P.pushMatch(mk(), ol());
console.log('bothShoved', r.outcome, r.d, r.t, r.vA, r.vB, 'xA during push', r.vA * r.t / 2);
const net = r.DB - r.HA; console.log('DA', r.DA, 'HA', r.HA, 'net', net);
console.log('v over full d', Math.sqrt(2 * net * r.d / 3000), 'over d/2', Math.sqrt(2 * net * r.d / 2 / 3000));
const r2 = P.pushMatch(mk({ anchor: 'bolted' }), ol());
console.log('shovedOff', r2.outcome, r2.winner, r2.vB, r2.slideB);
const F9 = 9060 * g; const r3 = P.pushMatch(mk({ F: F9 }), ol({ F: F9 }));
console.log('9060', r3.outcome, r3.vA, 'full d', Math.sqrt(2 * (r3.DB - r3.HA) * r3.d / 3000), 'slide', r3.slideA);
