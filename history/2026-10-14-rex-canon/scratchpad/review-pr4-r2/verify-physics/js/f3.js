const { P, g, R3, O3, dial, c3 } = require('./common.js');
const r = P.pushMatch(c3(dial, R3), c3(1000 * g, O3));
const pick = ['outcome', 'winner', 'DA', 'DB', 'HA', 'HB', 'contact', 'accel', 'aLoser', 'aFeet', 't', 'v', 'x', 'net', 'recoilAbsorbedA', 'recoilAbsorbedB'];
const o = {}; for (const k of pick) o[k] = r[k]; console.log(JSON.stringify(o));
console.log('Ollie momentum at end', (3000 * r.v).toFixed(0), ' feet share Hl*t', (r.HB * r.t).toFixed(0), ' sum', (3000 * r.v + r.HB * r.t).toFixed(0), ' contact*t', (r.contact * r.t).toFixed(0), ' DA*t', (r.DA * r.t).toFixed(0));
console.log('a if DA acted on Ollie', ((r.DA - r.HB) / 3000).toFixed(1));
const st = P.standoff(c3(dial, O3), c3(1000 * g, R3));  // pusher Ollie at dial vs Rex at 1t? swap: Rex pushes Ollie 1t
const st2 = P.standoff(c3(dial, R3), c3(1000 * g, O3));
console.log('standoff Rex(dial) pushes Ollie(1t):', st2.outcome, 'drive vB', st2.drive && st2.drive.vB, 'slideB', st2.drive && st2.drive.slideB);
const rb = P.pushMatch(c3(dial, R3, { anchor: 'bolted' }), c3(1000 * g, O3));
console.log('bolted Rex shoving match:', rb.outcome, 'vB', rb.vB, 'slideB', rb.slideB);
