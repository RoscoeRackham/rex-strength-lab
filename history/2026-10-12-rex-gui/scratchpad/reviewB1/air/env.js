const path = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB1/air/repo';
global.window = {};
require(path + '/src/data.js');
const P = require(path + '/src/engine.js');
const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find(s => s.id === id);
const rex = () => P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const obj = (id) => D.objects.find(o => o.id === id);
module.exports = { P, D, surf, rex, obj };
