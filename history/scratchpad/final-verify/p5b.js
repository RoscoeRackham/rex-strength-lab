global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (b, F, extra) => Object.assign({ F, mode: 'comic', body: P.makeBody(b), surface, groundHolds: false, anchor: 'friction' }, extra || {});
const R = P.DEFAULT_BODIES.rex, O = P.DEFAULT_BODIES.ollie;
let n=0, bad=[], forcedRT=0, unf=0;
for (const id of D.objects.filter(o=>!o.noThrow).map(o=>o.id)) for (const lg of [2,2.5,3,3.5,4,5,6,8]) for (const style of ['easy','hard']) for (const anchor of ['friction','bolted']) for (const Dd of [10,100,1000]) {
  const F0 = Math.pow(10, lg) * g;
  const ex = { anchor };
  let G; try { G = P.catchGame(mk({ H: R.H, m: R.m, build: 'rex' }, F0, ex), mk({ H: O.H, m: O.m, build: 'ollie' }, F0, ex), obj(id), Dd, style); } catch (e) { bad.push([id,lg,style,anchor,Dd,'throw '+e.message]); continue; }
  for (const L of [G.a, G.b]) {
    if (!L || !L.catch || L.result !== 'caught') continue;
    n++;
    const k = L.catch, m = obj(id).m;
    const removed = m * L.vArrive - (m + k.mh) * (k.uAfter);
    // impulse in the ground frame: object + hands decelerate by (F - Fpull)/mS; final speed relative to ground = uAfter (shares body motion) 
    const imp = (k.F - k.Fpull) * k.tStroke;
    const target = k.clean ? removed : (m * L.vArrive - (m + k.mh) * (k.vSlam + k.aC_ || 0));
    if (k.clean && Math.abs(imp / removed - 1) > 1e-6) bad.push([id,lg,style,anchor,Dd,'impulse', imp, removed, k.slips]);
    if (!isFinite(k.tStroke) || k.tStroke < 0) bad.push([id,lg,style,anchor,Dd,'tStroke',k.tStroke]);
    if (k.forced) forcedRT++; else unf++;
  }
  if (G.round != null) {
    const st = (L) => L.catch.forced ? L.catch.tStroke : 0;
    const want = G.a.time + G.b.time + G.a.tPush + G.b.tPush + st(G.a) + st(G.b);
    if (Math.abs(G.round - want) > 1e-9 * want) bad.push([id,lg,style,anchor,Dd,'round',G.round,want]);
  }
}
console.log('legs', n, 'forced', forcedRT, 'unforced', unf, 'bad', bad.length); console.log(bad.slice(0,20));
