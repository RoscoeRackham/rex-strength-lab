const R = __dirname + '/repo/rex-strength-lab/';
const P = require(R + 'src/engine.js'); global.window = {}; require(R + 'src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
let n = 0, withTG = 0, plN = 0;
for (const sid of D.surfaces.map((s) => s.id)) for (const src of ['sprint', 'jump', 'stomp']) for (const anchor of ['bolted', 'friction']) for (let lk = 2; lk <= 10; lk += 0.25) {
  const F = Math.pow(10, lk) * g;
  const cA = { F, mode: 'comic', body: ollie, surface: surf(sid), anchor: 'friction' }, cB = { F, mode: 'comic', body: rex, surface: surf(sid), anchor };
  let r; try { r = P.collide(cA, cB, { source: src, toGround: true }); } catch (e) { continue; }
  n++; if (!r || !r.toGround) continue; withTG++;
  const s = P.impulseSource(surf(sid), r.toGround.J, Math.max(1e-9, r.toGround.T));
  if (P.plasterOver(s, +process.argv[2])) { plN++; const rk = r.rock; const cracked = !!(rk && !rk.comic && (rk.planet || !isFinite(rk.rT) || rk.rT >= 0.05)) || !!(r.bolts && r.bolts.crater > 0); if (!cracked && plN < 400) console.log('uncracked plaster', sid, src, anchor, lk, 'rT', rk && rk.rT, 'outcome', r.outcome); }
}
console.log({ n, withTG, plN });
