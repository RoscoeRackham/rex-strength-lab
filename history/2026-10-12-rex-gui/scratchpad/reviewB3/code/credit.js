global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(R + '/src/engine.js'); require(R + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
function haz(move, o, sid, anchor, kg, powers) {
  const c = Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: surf(sid), anchor }, powers);
  const p = P.RESTRAINT.planNow(move, c, Object.assign({ near: 5 }, o));
  const out = {};
  for (const h of ['ground', 'slide', 'crush']) { const r = p.result('hazard:' + h); out[h] = r.never ? 'never' : (r.use / g).toPrecision(3) + ' kg'; }
  return out;
}
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const [label, move, o, sid, anchor, kg] of [
  ['throw car 45 concrete friction 100t', 'throw', { obj: obj('car'), angle: 45, target: 30 }, 'concrete', 'friction', 1e5],
  ['throw car 45 sand friction 100t', 'throw', { obj: obj('car'), angle: 45, target: 30 }, 'sand', 'friction', 1e5],
  ['throw car 45 concrete BOLTED 100t', 'throw', { obj: obj('car'), angle: 45, target: 30 }, 'concrete', 'bolted', 1e5],
  ['throw baseball 30 concrete friction 100t', 'throw', { obj: obj('baseball'), angle: 30, target: 100 }, 'concrete', 'friction', 1e5],
  ['punch concrete bolted 100t', 'punch', { target: 10.4 }, 'concrete', 'bolted', 1e5],
  ['stomp sand friction 100t', 'stomp', {}, 'sand', 'friction', 1e5],
]) console.log(label, '\n  off:', JSON.stringify(haz(move, o, sid, anchor, kg, {})), '\n  on: ', JSON.stringify(haz(move, o, sid, anchor, kg, ON)));
