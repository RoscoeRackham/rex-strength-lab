// Lens item 1: the drag part over a sweep of throws (every throwable object, angles, dials from a lob to light speed,
// shares, light and dense Rex). Independent real-air figure: a full-drag flight from vOut at the release height; where it
// lands, energy conservation; where it doesn't, fly() at dragK = 1 - 1e-12 and its air tally / k; past 1% of c, Eobj.
const H = require('./h.js')(process.argv[2]);
const { P, D, g, obj, R3, c9, TB, PE, sig } = H;
const k = 1 - 1e-12;
const indep = (r, ob, th, body) => {
  if (!r || !r.canMove || !r.flight || r.fallsBack || !(r.v > 0)) return { x: 0, why: 'none' };
  if (!isFinite(r.Eobj)) return { x: Infinity, why: 'inf' };
  if (r.flight.relativistic) return { x: r.Eobj, why: 'rel' };
  const fl = { v0: r.vOut, thetaDeg: th, h0: body.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup };
  const E1 = P.keFromV(r.vOut, ob.m) + PE(ob.m, body.releaseHeight);
  const ft = P.fly(Object.assign({}, fl, { dragK: k }));
  const f0 = P.fly(fl);
  if (f0.landed) return { x: Math.max(0, E1 - P.keFromV(f0.vImpact, ob.m)), why: 'landed', tallyE: ft.air ? ft.air.E / k : NaN, E1 };
  return { x: Math.min(E1, ft.air.E / k), why: f0.escaped ? 'escaped' : f0.orbit ? 'orbit' : f0.timedOut ? 'timedOut' : '?', E1 };
};
const bodies = [['3000 kg', R3], ['dense 1e12', P.makeBody({ build: 'rex', H: 3.048, m: 1e12 })], ['giant 30 m', P.makeBody({ build: 'rex', H: 30, m: 3e6 })]];
const objs = D.objects.filter((o) => !o.noThrow).map((o) => o.id);
let n = 0, bad = [], over = [], eqOcean = 0, kinds = {}, ecVsTally = [], maxRelErr = 0;
for (const [bl, body] of bodies) for (const id of objs) for (const th of [0, 30, 60, 90]) for (let e = 0; e <= 22; e += 1) for (const s of [1, 0.75, 0.25]) {
  const ob = obj(id), F = e === 22 ? Infinity : Math.pow(10, e) * g;
  const c = c9(F, body, { airAbsorb: s, safePassenger: false });
  let r; try { r = P.throwObject(c, ob, th); } catch (err) { bad.push('throw threw ' + id + ' ' + err.message); continue; }
  const tb = TB('throw', r, Object.assign({}, c, { obj: ob, angle: th }));
  const want = indep(r, ob, th, body);
  const d = tb.parts.drag;
  n++;
  kinds[want.why] = (kinds[want.why] || 0) + 1;
  const exp = s * want.x;
  if (!(d === exp || Math.abs(d - exp) <= 1e-9 * Math.abs(exp))) bad.push(bl + ' ' + id + ' ' + th + ' 1e' + e + ' s' + s + ': ' + sig(d) + ' vs ' + sig(exp) + ' (' + want.why + ')');
  if (Number.isNaN(d) || d < 0) bad.push('NaN/neg ' + id);
  const top = isFinite(r.Eobj) ? Math.max(r.Eobj, (want.E1 || 0)) + PE(ob.m, body.releaseHeight) : Infinity;
  if (isFinite(d) && d > top * (1 + 1e-9)) over.push(bl + ' ' + id + ' ' + th + ' 1e' + e + ': ' + sig(d) + ' > ' + sig(top));
  if (r.flight && r.flight.ocean && d > 0 && Math.abs(d - r.flight.ocean.E) <= 1e-9 * d) eqOcean++;
  if (want.why === 'landed' && isFinite(want.tallyE) && want.x > 1e-6 * want.E1) { const rel = Math.abs(want.tallyE - want.x) / want.x; if (rel > maxRelErr) maxRelErr = rel; if (rel > 0.01) ecVsTally.push(bl + ' ' + id + ' ' + th + ' 1e' + e + ': EC ' + sig(want.x) + ' tally ' + sig(want.tallyE)); }
}
console.log('throws', n, JSON.stringify(kinds));
console.log('mismatch vs independent (s x real air):', bad.length, bad.slice(0, 6).join(' | '));
console.log('over the object\'s energy:', over.length, over.slice(0, 4).join(' | '));
console.log('drag equal to the drag-free tally (ocean.E):', eqOcean);
console.log('landed: energy conservation vs the full-drag flight\'s own tally: max rel diff', maxRelErr.toExponential(2), '; >1%:', ecVsTally.length, ecVsTally.slice(0, 5).join(' | '));
