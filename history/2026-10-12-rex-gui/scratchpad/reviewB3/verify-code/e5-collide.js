const R = __dirname + '/repo/rex-strength-lab/';
const P = require(R + 'src/engine.js'); global.window = {}; require(R + 'src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
let found = 0;
for (const sid of ['concrete', 'granite', 'sand', 'gravel', 'stiffclay', 'softclay', 'asphalt'].filter((s) => surf(s)))
for (const src of ['sprint', 'jump', 'stomp'])
for (const anchor of ['bolted', 'friction'])
for (let lk = 3; lk <= 9; lk += 0.5) {
  const F = Math.pow(10, lk) * g;
  const cA = { F, mode: 'comic', body: ollie, surface: surf(sid), anchor: 'friction' }, cB = { F, mode: 'comic', body: rex, surface: surf(sid), anchor };
  let r; try { r = P.collide(cA, cB, { source: src, toGround: true }); } catch (e) { continue; }
  if (!r || !r.toGround || r.noCharge) continue;
  const srcS = P.impulseSource ? P.impulseSource(surf(sid), r.toGround.J, r.toGround.T) : null;
  const pl = srcS && P.plasterOver ? P.plasterOver([srcS], 5) : null;
  const rk = r.rock; const cracked = !!(rk && !rk.comic && (rk.planet || !isFinite(rk.rT) || rk.rT >= 0.05)) || !!(r.bolts && r.bolts.crater > 0);
  if (pl && !cracked && found < 12) { found++; console.log(sid, src, anchor, 'logKg', lk, 'plaster from the hit push on real ground, rock not cracked; J', r.toGround.J.toExponential(2), 'v0', r.v0 && r.v0.toFixed(1)); }
}
console.log('impulseSource?', !!P.impulseSource, 'plasterOver?', !!P.plasterOver, 'found', found);
