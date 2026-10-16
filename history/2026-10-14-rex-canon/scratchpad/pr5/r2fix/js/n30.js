// N30: is there a game-of-catch leg whose full-drag flight (as realAirLeg flies it) times out? A grid of objects,
// styles, distances and dials, with all and half the drag absorbed
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const conc = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((o) => o.id === id);
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: conc, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, x || {});
let n = 0, t = 0; const kinds = {}; const t0 = Date.now();
for (const id of ['baseball', 'car', 'person', 'bus', 'shot', 'esb', 'tank']) for (const st of ['hard', 'easy']) for (let ld = 1; ld <= 6.5; ld += 0.5) for (let e = 4; e <= 18; e++) for (const s of [1, 0.5]) {
  const x = { airAbsorb: s }, A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, O3, x);
  let L; try { L = P.catchLeg(A, B, obj(id), Math.pow(10, ld), st); } catch (err) { continue; }
  if (!L || L.fast || L.result === 'fireball' || L.result === 'falls-back' || (L.wells && L.wells.wellDominated)) continue;
  const ob = obj(id), full = { m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup };
  let f;
  if (L.result === 'overshoots') { if (!(L.vL > 0) || L.relativistic || L.vL >= P.CATCH.V_FIREBALL) continue; f = P.flyTo(Object.assign({ v0: L.vL, thetaDeg: L.thetaDeg, h0: L.h0, hStop: 0, xStop: L.Dfl, Dend: L.Dfl }, full)); }
  else { if (!L.aim || !(L.aim.vL > 0)) continue; const hard = L.style === 'hard' || !!L.fullStrength; f = P.flyTo(Object.assign({ v0: L.aim.vE, thetaDeg: L.aim.thetaDeg, h0: L.h0, hStop: hard ? 0 : L.hStop, Dend: L.Dfl }, hard ? { xStop: L.Dfl } : {}, full)); }
  n++; if (f.timedOut) { t++; kinds[id + ' ' + st + ' 10^' + ld + ' m 10^' + e + ' ' + s + ' ' + L.result] = 1; }
}
console.log(n + ' legs flown at the full drag, ' + t + ' timed out', Object.keys(kinds).slice(0, 10), (Date.now() - t0) / 1000 + ' s');
