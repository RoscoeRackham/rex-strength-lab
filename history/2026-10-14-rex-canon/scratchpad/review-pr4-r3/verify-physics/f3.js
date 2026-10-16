const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find(s => s.id === id);
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ol = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const ctx = (kg, body, o) => Object.assign({ F: kg * P.K.g, mode: 'comic', body, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
const dial = 90718.474;
const r = P.pushMatch(ctx(dial, rex), ctx(1000, ol));
const pick = (o, ks) => Object.fromEntries(ks.filter(k => k in o).map(k => [k, o[k]]));
console.log(pick(r, ['outcome','winner','HA','HB','DA','DB','holdB','x','t','v','vCap','accel','walkPush','ring','slideB','xB']));
// slide on from v on Ollie's footing (17.65 kN) against drag: the engine's own slideTo
const sl = P.COL ? null : null;
const keys = Object.keys(P).filter(k => /slide/i.test(k)); console.log('slide exports', keys);
const m = 3000, R_ = r.holdB, v = r.v;
console.log('no-drag slide v^2/(2 R/m)=', v*v/(2*R_/m), 'end', r.x + v*v/(2*R_/m));
// with drag: x = m/(2k) ln(1 + k v^2/R), k = rho0 Cd A / 2
const k = 0.5 * P.K.rho0 * ol.Cd * ol.frontArea; console.log('drag slide', m/(2*k)*Math.log(1 + k*v*v/R_), 'end', r.x + m/(2*k)*Math.log(1 + k*v*v/R_));
// power off walkout
const r0 = P.pushMatch(ctx(dial, rex, { ownRecoil: false }), ctx(1000, ol, { ownRecoil: false }));
console.log('power off', pick(r0, ['outcome','winner','x','t','v','slideB']));
