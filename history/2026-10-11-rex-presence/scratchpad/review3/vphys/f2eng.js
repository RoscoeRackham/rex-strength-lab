global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
function coast(M, u, R, k) { if (!isFinite(R) || !(u > 0)) return 0; return k > 0 ? M / (2 * k) * Math.log1p(k * u * u / R) : M * u * u / (2 * R); }
for (const [o, s, kg, mode, dial] of [['bus', 'ice', 28e3, 'comic'], ['bus', 'ice', 27.5e3, 'comic'], ['tank', 'sand', 2160e3, 'comic', 1e7], ['bus','concrete', 28e3,'comic']]) {
  const c = { F: (dial || 100 * 907.18474) * g, use: kg * g, mode, body: rex, surface: surf(s), groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(c, obj(o), 45);
  const Rs = P.anchorCapacity({ body: rex, surface: surf(s), theta: 0, anchor: 'friction', groundHolds: false }).R;
  const k = 0.5 * P.K.rho0 * rex.Cd * rex.frontArea;
  const sl = coast(rex.m, r.recoilV * Math.cos(Math.PI / 4), Rs, k);
  console.log(o, s, kg, 'recoilV', r.recoilV.toFixed(2), 'xA(lurch)', r.push && r.push.xA && r.push.xA.toFixed(2), 'coast', sl.toFixed(2), 'Rs', Rs.toFixed(0), 'range', r.flight.range.toFixed(2));
}
