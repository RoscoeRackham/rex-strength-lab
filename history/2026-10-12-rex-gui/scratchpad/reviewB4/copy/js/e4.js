const P = require('../lab/src/engine.js'); global.window = {}; require('../lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = D.surfaces.find((s) => s.id === 'concrete');
const M = P.RESTRAINT.MOVES;
const opt = (o) => Object.assign({ surface: surf, body, anchor: 'friction', angle: 0, near: 5, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o);
const base = { mode: 'comic', body, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
// stomp at 1e12
let c = Object.assign({}, base, { F: 1e12 * g });
let o = opt({});
let r = M.stomp.run(c, o); let sh = M.stomp.shake(r, o); sh = Array.isArray(sh) ? sh : [sh];
console.log('stomp 1e12', sh.map((s) => s && [P.ppvNonlinear(s, 5), P.plasterReach(s)]));
// throw allstar baseball
const ball = D.objects.find((x) => x.id === 'baseball');
c = Object.assign({}, base, { F: 1.8e23 * g }); o = opt({ obj: ball, angle: 0 });
r = M.throw.run(c, o); sh = M.throw.shake(r, o); sh = Array.isArray(sh) ? sh : [sh];
console.log('throw allstar', sh.map((s) => s && [P.ppvNonlinear(s, 5), P.plasterReach(s)]));
// jump 1e8
c = Object.assign({}, base, { F: 1e8 * g }); o = opt({});
r = M.jump.run(c, o); sh = M.jump.shake(r, o); sh = Array.isArray(sh) ? sh : [sh];
console.log('jump 1e8', sh.map((s) => s && [P.ppvNonlinear(s, 5), P.plasterReach(s)]));
