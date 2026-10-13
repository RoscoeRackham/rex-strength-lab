global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const Pm = require(S + '/engine-main.js');
const Pb = require(S + '/lab/src/engine.js');
require(S + '/lab/src/data.js');
const D = window.DINO_DATA;
const g = 9.80665;
const surf = D.surfaces.find((s) => s.id === 'granite'), obj = (id) => D.objects.find((o) => o.id === id);
const run = (P) => {
  const b = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), bo = P.makeBody({ build: 'ollie', H: 3.048, m: 2e23 });
  const R = { F: Infinity, mode: 'comic', body: b, surface: surf, anchor: 'bolted' }, O = { F: Infinity, mode: 'comic', body: bo, surface: surf, anchor: 'bolted' };
  return P.catchLeg(R, O, obj('shot'), 100, 'easy');
};
const a = run(Pm), b = run(Pb);
console.log('vArrive', a.vArrive, b.vArrive, 'wellDominated', a.wells.wellDominated, 'inStroke', a.wells.inStroke);
const pick = (k) => ({ Ecatch: k.Ecatch, Ediss: k.Ediss, E1: k.E1, F: k.F, clean: k.clean, uAfter: k.uAfter, slide: k.slide, decelG: k.decelG, firstShare: k.firstShare, tStroke: k.tStroke, rel: k.relativistic, pIn: k.pIn });
console.log('main', pick(a.catch)); console.log('branch', pick(b.catch));
console.log('KE of shot at vArrive', 0.5 * 7.26 * a.vArrive ** 2);
console.log('result', a.result, b.result, 'toGroundC', b.toGroundC);
