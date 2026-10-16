global.window = {};
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P0 = require(M + '/src/engine.js'); require(M + '/src/data.js'); const P1 = require('./engine-pr4.js');
const D = window.DINO_DATA, g = P0.K.g, surf = (id) => D.surfaces.find((x) => x.id === id);
const sig = (x) => (typeof x === 'number' ? x.toPrecision(4) : String(x));
const DIAL = 100 * 907.18474 * g;
const mk = (P, F, x, b) => Object.assign({ F, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface: surf('concrete'), anchor: 'friction' }, x);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const brief = (r) => [r.outcome, 'DA ' + sig(r.DA), 'HB ' + sig(r.HB), 'contact ' + sig(r.contact), r.pusherSlips ? 'slips' : '', r.rock ? 'rock rT ' + sig(r.rock.rT) + (r.rock.comic ? ' comic' : '') + (r.rock.dipole ? ' dipole' : '') : '', r.tearA != null ? 'tearA ' + sig(r.tearA) : '', r.tearB != null ? 'tearB ' + sig(r.tearB) : ''].filter(Boolean).join(', ');
for (const [lab, x] of [['ON', ON], ['ON, unbreakable off (the break-the-ground run)', Object.assign({}, ON, { unbreakable: false })]]) for (const [F, fl] of [[DIAL, 'dial'], [1e7 * g, '1e7 kg'], [1e8 * g, '1e8 kg'], [Infinity, 'inf']]) for (const [aA, aB, imm] of [['friction', 'friction', false], ['bolted', 'friction', false], ['friction', 'bolted', false], ['bolted', 'bolted', false], ['friction', 'friction', true], ['bolted', 'friction', true]]) {
  const r0 = P0.standoff(mk(P0, F, Object.assign({}, x, { anchor: aA }), 'ollie'), mk(P0, F, Object.assign({}, x, { anchor: aB }, imm ? { immovable: true } : {}), 'rex'));
  const r1 = P1.standoff(mk(P1, F, Object.assign({}, x, { anchor: aA }), 'ollie'), mk(P1, F, Object.assign({}, x, { anchor: aB }, imm ? { immovable: true } : {}), 'rex'));
  if (JSON.stringify(r0) !== JSON.stringify(r1)) console.log(lab, fl, 'Ollie ' + aA + ' pushes Rex ' + aB + (imm ? ' (immovable)' : ''), '\n   main: ' + brief(r0), '\n   new:  ' + brief(r1));
}
// powers off: identical?
let diff = 0; for (const F of [DIAL, Infinity]) for (const aA of ['friction', 'bolted']) for (const aB of ['friction', 'bolted']) for (const imm of [false, true]) { const a = P0.standoff(mk(P0, F, { anchor: aA }, 'ollie'), mk(P0, F, Object.assign({ anchor: aB }, imm ? { immovable: true } : {}), 'rex')), b = P1.standoff(mk(P1, F, { anchor: aA }, 'ollie'), mk(P1, F, Object.assign({ anchor: aB }, imm ? { immovable: true } : {}), 'rex')); if (JSON.stringify(a) !== JSON.stringify(b)) diff++; }
console.log('powers-off differences', diff);
