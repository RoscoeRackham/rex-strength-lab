// load either engine: VER=main or branch
const base = process.env.VER === 'main' ? '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/physics/main' : '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/physics/repo/rex-strength-lab';
global.window = {};
const P = require(base + '/src/engine.js');
require(base + '/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g, c = P.K.c;
const surf = (id) => D.surfaces.find((x) => x.id === id);
const obj = (id) => D.objects.find((x) => x.id === id);
const rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ollie = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, extra, body) => Object.assign({ F, mode: 'comic', body: body || rex, surface: surf('concrete'), anchor: 'friction' }, extra || {});
const DEF = 100 * 907.18474 * g;
const sig = (x, n) => (x == null ? String(x) : Number(x).toPrecision(n || 4));
module.exports = { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig };
