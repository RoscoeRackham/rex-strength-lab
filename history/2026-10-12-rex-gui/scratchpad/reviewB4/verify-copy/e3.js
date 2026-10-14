const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const c = { F: 1e8 * g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false, use: Infinity };
const r = P.punch(c); console.log('recoil off: recoilV', r.recoilV, 'lurch', r.lurch, 'tPush', r.t || r.tPush, Object.keys(r).join(','));
