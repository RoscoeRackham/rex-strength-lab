const P = require(process.argv[2]);
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const c = { F: 1e6 * g, mode: 'comic', body: rex, surface: surf, anchor: 'friction', unbreakable: true };
const j = P.jump(c);
const src = P.RESTRAINT.MOVES.jump.shake(j, { surface: surf, body: rex, m: rex.m, unbreakable: true });
console.log('landing sources J', src.map(s => s && s.J), 'plaster reach', P.plasterReach(src));
