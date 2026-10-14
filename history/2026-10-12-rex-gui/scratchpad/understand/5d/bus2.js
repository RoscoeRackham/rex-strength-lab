global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.throw;
for (const extra of [{ anchor: 'bolted' }, { anchor: 'bolted', gentleHold: true }, { anchor: 'friction', gentleHold: true }]) {
  const c = Object.assign({ F: 1e5 * g, mode: 'comic', body: rex, surface: surf('ice'), groundHolds: false, anchor: 'friction' }, extra);
  const p = P.RESTRAINT.planNow('throw', c, Object.assign({ obj: obj('bus'), angle: 45, target: 30, near: 5 }, extra.gentleHold ? { gentleHold: true } : {}));
  const ce = p.ceiling();
  console.log(JSON.stringify(extra), 'ceiling by', ce.by, ce.use / g, 'hazards', p.hazards().map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(4))).join(' '));
}
// friction recoil at all-out and lurch on ice; at the dial
const c = { F: 1e5 * g, mode: 'comic', body: rex, surface: surf('ice'), groundHolds: false, anchor: 'friction' };
const r = P.throwObject(c, obj('bus'), 45);
console.log('allout friction basis', r.basis, 'v', r.v, 'recoilV', r.recoilV, 'xA', r.push.xA, 'slide', M.slide(r, { body: rex, surface: surf('ice'), anchor: 'friction', groundHolds: false, angle: 45 }));
// Also level throw of a car on ice by default 10 ft Rex at 1e5 dial
