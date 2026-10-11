global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./r8fix/engine.js');
const D = window.DINO_DATA;
const g = 9.80665; let diffs = 0, n = 0;
for (const H of [0.4, 2, 50]) for (const surface of D.surfaces) for (const gh of [false, true]) for (const mode of ['comic','real']) for (let lk = 0; lk <= 30; lk += 0.5) for (const inf of [false, true]) {
  const body = A.makeBody({ H, m: 180 * Math.pow(H/2, 3) });
  const c = { F: inf ? Infinity : Math.pow(10, lk)*g, mode, body, surface, groundHolds: gh, anchor: 'friction' };
  const a = A.stomp(c), b = B.stomp(Object.assign({}, c, { body: B.makeBody({ H, m: 180 * Math.pow(H/2, 3) }) }));
  n++;
  const same = ['E','vFoot','vBody','holeDepth','crater','quake'].every(k => Object.is(a[k], b[k]));
  if (!same) { diffs++; if (!gh) console.log('UNEXPECTED diff without groundHolds', H, surface.id, mode, lk, inf); if (b.crater !== 0 || b.holeDepth !== 0) console.log('fix leaves crater', H, surface.id, lk); }
}
console.log('cases', n, 'changed', diffs);
