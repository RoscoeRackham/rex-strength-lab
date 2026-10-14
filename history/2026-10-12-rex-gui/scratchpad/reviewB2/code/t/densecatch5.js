global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const Pb = require(S + '/lab/src/engine.js');
require(S + '/lab/src/data.js');
const D = window.DINO_DATA;
const g = 9.80665;
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const sid of ['concrete', 'granite']) for (const oid of ['shot', 'baseball', 'car']) for (const anchor of ['friction', 'bolted']) {
  const surf = D.surfaces.find((s) => s.id === sid), obj = D.objects.find((o) => o.id === oid);
  const b = Pb.makeBody({ build: 'rex', H: 3.048, m: 3007 }), bo = Pb.makeBody({ build: 'ollie', H: 3.06, m: 2e23 });
  const R = Object.assign({ F: 1e30 * g, mode: 'comic', body: b, surface: surf, anchor }, ON), O = Object.assign({ F: 1e30 * g, mode: 'comic', body: bo, surface: surf, anchor }, ON);
  const L = Pb.catchLeg(R, O, obj, 100, 'easy');
  const k = L.catch || {};
  console.log(sid, oid, anchor, L.result, 'vArrive/c', L.vArrive && (L.vArrive / Pb.K.c).toPrecision(3), 'Ecatch', k.Ecatch, 'KE', L.vArrive && Pb.keFromV(L.vArrive, obj.m).toPrecision(3), 'firstShare', k.firstShare, 'mh', k.mh && k.mh.toPrecision(3), 'rel', k.relativistic);
}
