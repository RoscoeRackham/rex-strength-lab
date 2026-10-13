const R = __dirname + '/repo/rex-strength-lab/';
const P = require(R + 'src/engine.js'); global.window = {}; require(R + 'src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = (id) => D.surfaces.find((s) => s.id === id);
const F = 100 * 907.18474 * P.K.g;
function run(label, cx, oo) {
  const c = Object.assign({ F, mode: 'comic', body, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, cx);
  const o = Object.assign({ near: 5, target: 30, obj: obj('car'), angle: 45 }, oo);
  const p = P.RESTRAINT.planNow('throw', c, o);
  const h = {}; for (const id of ['ground', 'crush', 'slide']) { const r = p.result('hazard:' + id); h[id] = r.never ? 'never' : (r.use / P.K.g).toPrecision(3) + ' kg'; }
  console.log(label.padEnd(40), JSON.stringify(h), 'ceiling by', p.ceiling().by);
}
run('default (all on)', {});
run('default unbreakable off', { unbreakable: false });
run('default ownRecoil off', { ownRecoil: false });
run('default keepForm off', { keepForm: false });
run('all off', { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false });
console.log('baseball crush prop', obj('baseball').crush, 'car crush', obj('car').crush);
run('baseball keepForm off', { keepForm: false }, { obj: obj('baseball') });
run('bolted ownRecoil off', { ownRecoil: false, anchor: 'bolted' });
run('sand unbreakable off', { unbreakable: false, surface: surf('sand') });
// a case where the credit is right: bigger dial
run('1e6 t unbreakable off', { unbreakable: false, F: 1e9 * P.K.g });
run('1e6 t ownRecoil off', { ownRecoil: false, F: 1e9 * P.K.g });
