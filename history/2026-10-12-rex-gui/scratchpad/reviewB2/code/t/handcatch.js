global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const P = require(S + '/lab/src/engine.js');
require(S + '/lab/src/data.js');
const D = window.DINO_DATA, g = 9.80665, c = P.K.c;
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const surf = D.surfaces.find((s) => s.id === 'concrete'), ball = D.objects.find((o) => o.id === 'baseball');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
for (const lg of [9, 14]) {
  const R = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf, anchor: 'friction' }, ON), O = Object.assign({}, R, { body: ollie });
  const L = P.catchLeg(R, O, ball, 100, 'hard');
  const r = P.throwObject(R, ball, 0), M = P.RESTRAINT.MOVES.throw, o = { obj: ball, angle: 0, body: rex, surface: surf, anchor: 'friction', airAbsorb: 1, near: 5 };
  const parts = M.blastParts(r, o);
  console.log('dial 1e' + lg, 'catch result', L.result, 'fast', !!L.fast, 'vL/c', (L.aim.vL / c).toPrecision(3), 'drag.E', L.drag && L.drag.E,
    '| Throw tab level: v/c', (r.v / c).toPrecision(3), 'blast parts', JSON.stringify(parts), 'from', M.blastFrom(r, o), 'windows radius m', P.blastRadius(M.blast(r, o), 6900).toPrecision(3));
}
