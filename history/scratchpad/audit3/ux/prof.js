global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const o = D.objects.find(x => x.id === 'shuttle');
const c = { F: 1e7 * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
let t0 = Date.now(); let r; for (let i = 0; i < 5; i++) r = P.throwObject(Object.assign({}, c, { record: true }), o, 89); console.log('throwObject record', (Date.now() - t0) / 5, 'ms', 'v', r.v, 'steps', r.flight.steps, 'pts', r.flight.path.length, 'time', r.flight.time);
t0 = Date.now(); for (let i = 0; i < 5; i++) r = P.throwObject(Object.assign({}, c), o, 89); console.log('throwObject no record', (Date.now() - t0) / 5, 'ms');
t0 = Date.now(); let v; for (let i = 0; i < 5; i++) v = P.fly({ v0: r.v, thetaDeg: 89, h0: c.body.releaseHeight, m: o.m, A: o.area, Cd: 0, record: true }); console.log('vac fly', (Date.now() - t0) / 5, 'ms', 'steps', v.steps);
// calibration callout? (only at human strength) - n/a
// Profile throwObject internals
const prof = require('inspector');
