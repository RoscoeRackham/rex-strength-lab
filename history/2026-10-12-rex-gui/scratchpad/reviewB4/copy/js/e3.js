const P = require('../lab/src/engine.js'); global.window = {}; require('../lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = D.surfaces.find((s) => s.id === 'concrete');
const car = D.objects.find((x) => x.id === 'car');
const base = { F: 1e5 * 0.90718474 * g, mode: 'comic', body, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: 43.5 * g };
const on = P.pull(base, car), off = P.pull(Object.assign({}, base, { ownRecoil: false }), car);
console.log('pull on', on.t10m, on.ropeT, on.canMove, 'off', off.t10m, off.canMove, off.anchor.R, off.resist);
// punch counterfactual
const c8 = Object.assign({}, base, { F: 1e8 * g }); delete c8.use;
const pOn = P.punch(c8), pOff = P.punch(Object.assign({}, c8, { ownRecoil: false }));
console.log('punch off recoilV', pOff.recoilV, 'lurch', pOff.lurch);
