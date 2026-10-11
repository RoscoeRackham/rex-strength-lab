const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const vm = require('vm');
const sb = { window: {} }; vm.createContext(sb);
vm.runInContext(require('fs').readFileSync('/home/user/dino-strength-sim/src/data.js','utf8'), sb);
const D = sb.window.DINO_DATA;
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const ctx = (logKg, mode) => ({ F: Math.pow(10, logKg) * g, mode, body, surface, groundHolds: false, anchor: 'friction' });
const p = P.punch(ctx(8.77, 'comic'));
console.log('punch comic logKg 8.77: vFist', p.vFist.toFixed(0), 'mach', p.mach.toFixed(2), 'stagT K', p.stagT.toFixed(0), 'shown degC', (p.stagT-273.15).toFixed(0));
const tank = D.objects.find(o => o.id === 'tank');
const t = P.throwObject(ctx(16.86, 'comic'), tank, 30);
console.log('throw tank 30deg logKg 16.86: v', t.v.toFixed(0), 'canMove', t.canMove, 'relativistic', t.flight.relativistic, 'maxMach', t.flight.maxMach.toFixed(1), 'maxStagT K', t.flight.maxStagT.toExponential(3), 'shown degC', (t.flight.maxStagT-273.15).toExponential(3));
for (const v of [1000, 2000, 3000, 7000, 11000, 15000, 112000]) console.log('v', v, 'ideal T0', P.stagnationT(v / P.K.a0).toFixed(0), 'ratio-check h0/cp', (288.15 + v*v/2/1004.5).toFixed(0));
// jump reaching hypersonic?
for (const L of [8, 10, 12, 14]) { const j = P.jump(ctx(L, 'comic')); console.log('jump logKg', L, 'v', j.v && j.v.toFixed(0), 'maxStagT', j.flight.maxStagT.toFixed(0), 'rel', j.flight.relativistic); }
