// Independent sweep: with They take their own recoil on, the pull's feet push on his own body (walkPush J/T) never
// exceeds 1.4x the strength he uses, nor (on friction) his footing; the pace is min(load's, body's); the rope <= usable.
const root = process.argv[2];
global.window = {}; const P = require(root + '/src/engine.js'); require(root + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const objs = D.objects.filter((o) => o.m < 1e9);
let n = 0, bad = [], maxRatio = 0, maxAt = '', fl = 0, nfl = 0, minRatioFL = Infinity;
for (const mode of ['comic', 'real']) for (const s of D.surfaces) for (const anchor of ['friction', 'bolted']) for (const lk of [3.5, 4, 4.5, 4.958, 5.5, 6, 8, 10, 15, 20]) for (const o of objs) for (const ef of [null, 1e-6, 1e-4, 1e-3, 0.01, 0.05, 0.1, 0.3, 0.5, 0.9]) {
  const F = Math.pow(10, lk) * g, use = ef == null ? null : Math.max(30 * g, ef * F);
  const c = Object.assign({ F, mode, body, surface: s, anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, use != null ? { use } : {});
  const r = P.pull(c, o); n++;
  if (!r.canMove) continue;
  const legs = r.walkPush.J / r.walkPush.T, u = r.usable, R = r.anchor.R, cap = Math.min(R, 1.4 * u);
  const tag = [mode, s.id, anchor, '10^' + lk, o.id, ef == null ? 'allout' : 'use ' + (use / g).toPrecision(3)].join(' ');
  const ratio = legs / u; if (ratio > maxRatio) { maxRatio = ratio; maxAt = tag; }
  if (r.footLimited) { fl++; minRatioFL = Math.min(minRatioFL, legs / cap); } else nfl++;
  if (!(legs <= 1.4 * u * (1 + 1e-9))) bad.push(tag + ' legs ' + ratio.toFixed(4) + 'x');
  if (anchor === 'friction' && !(legs <= R * (1 + 1e-9))) bad.push(tag + ' legs past footing');
  if (!(r.ropeT <= u * (1 + 1e-9))) bad.push(tag + ' rope past usable');
  const aLoad = (u - r.resist) / o.m, aFeet = cap / body.m;
  if (Math.abs(r.accel / Math.min(aLoad, aFeet) - 1) > 1e-9) bad.push(tag + ' accel ' + r.accel + ' vs ' + Math.min(aLoad, aFeet));
  // walkPush is his body's momentum gamma m v
  const pBody = P.vToMomentum(r.vEnd, body.m); if (isFinite(pBody) && Math.abs(r.walkPush.J / pBody - 1) > 1e-6) bad.push(tag + ' walkPush vs body momentum ' + r.walkPush.J + ' ' + pBody);
}
console.log('cases ' + n + ', footLimited ' + fl + ', load-paced ' + nfl + '; max legs/usable ' + maxRatio.toFixed(6) + ' at ' + maxAt + '; footLimited legs/cap min ' + minRatioFL.toFixed(6));
console.log('bad ' + bad.length); console.log(bad.slice(0, 15).join('\n'));
