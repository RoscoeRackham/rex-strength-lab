const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ H: 50, m: 180 * 25 ** 3 });
const surface = D.surfaces.find(s => s.id === 'clay');
const c = { F: 150e9 * 907.18474 * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' };
const a0 = P.anchorCapacity({ body, surface, theta: 0, anchor: 'friction' });
console.log('anchor theta=0', a0, 'W=', body.m * g, 'two-foot bearing cap=', surface.qult * 2 * body.footArea);
const s = P.sprint(c); console.log('sprint', { thrust: s.thrust, accelG: s.accelG, t100: s.t100, vTop: s.vTop, limit: s.limit });
// limit label when strength-limited
const c2 = Object.assign({}, c, { F: 511 * g });
const s2 = P.sprint(c2); console.log('Kaiju clay human strength: thrust', s2.thrust, 'mu*m*g', 0.4 * body.m * g, 'limit label', s2.limit);
