global.window = {};
const ROOT = __dirname + '/head/rex-strength-lab/';
const P = require(ROOT + 'src/engine.js');
require(ROOT + 'src/data.js');
const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
module.exports = { P, D, surf, obj, rex, ollie, g: P.K.g };
