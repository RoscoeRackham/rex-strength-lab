global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
for (const s of D.surfaces) { const c = { F: 1e6 * g, mode: 'comic', surface: s, anchor: 'friction' }; const r = P.liftPartner(Object.assign({ body: rex }, c), Object.assign({ body: ollie }, c)); console.log(s.id, P.RESTRAINT.SOIL.has(s.id) ? 'soil' : 'hard', 'groundRatio', r.groundRatio.toPrecision(3)); }
