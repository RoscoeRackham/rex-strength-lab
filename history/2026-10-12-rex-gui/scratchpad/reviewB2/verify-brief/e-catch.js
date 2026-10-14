const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (build) => ({ F: 1.81436948e23 * g, mode: 'comic', surface, anchor: 'friction', airAbsorb: 1, keepForm: true, ownRecoil: true, unbreakable: true, body: P.makeBody({ build, H: 3.048, m: 3007 }) });
const o = D.objects.find((x) => x.id === 'baseball');
const L = P.catchLeg(mk('rex'), mk('ollie'), o, Math.pow(10, 4.3), 'hard');
console.log('result', L.result, 'hitsGround', JSON.stringify(L.hitsGround), 'miss', JSON.stringify(L.miss));
