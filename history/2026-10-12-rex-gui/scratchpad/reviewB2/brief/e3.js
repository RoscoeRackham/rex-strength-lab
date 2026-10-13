// Unbreakable footing on: does any two-player test or remaining solo move break or sink into the ground?
global.window = {}; const P = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const bad = [];
for (const sid of ['sand', 'softclay', 'concrete', 'ice', 'granite', 'asphalt']) for (const lk of [3, 4, 5, 6, 8, 10, 12]) for (const mode of ['comic', 'real']) for (const anch of ['friction', 'bolted']) {
  const mk = (b) => ({ F: Math.pow(10, lk) * g, mode, body: P.makeBody({ build: b, H: 3.048, m: 3007 }), surface: surf(sid), anchor: anch, unbreakable: true, keepForm: true, ownRecoil: true, airAbsorb: 1 });
  const cR = mk('rex'), cO = mk('ollie'), tag = sid + ' 1e' + lk + ' ' + mode + ' ' + anch;
  const pu = P.punch(cR); if (pu.sinkRatio > 1 || pu.groundRatio > 1) bad.push('punch ' + tag);
  const pl = P.pull(cR, obj('bus')); if (pl.sinks || pl.groundRatio > 1) bad.push('pull ' + tag);
  const aw = P.armWrestle(cR, cO); if (aw.crater > 0 || aw.tearA > 1 || aw.tearB > 1) bad.push('arm ' + tag + ' crater ' + aw.crater + ' tear ' + aw.tearA);
  const pm = P.pushMatch(cR, cO); if (pm.tear > 1) bad.push('push ' + tag);
  const sh = P.shove(cR, cO); if (sh.clash === 'rockGives' || sh.tear > 1) bad.push('shove ' + tag);
  const tp = P.throwPartner(cR, cO, 45); if (tp.r && tp.r.sinkRatio > 1) bad.push('throwPartner ' + tag);
  if (tp.sinks) bad.push('throwPartner sinks ' + tag);
  for (const src of ['sprint', 'jump', 'stomp']) {
    const co = P.collide(cO, cR, { source: src });
    if (!co || co.noCharge) continue;
    const sp = co.after && co.after.splat, rk = co.rock;
    if ((rk && !rk.comic) || (co.bolts && co.bolts.crater > 0) || (sp && (sp.D > 0 || sp.depth >= 0.01 || sp.Eground > 0))) bad.push('collide ' + src + ' ' + tag + JSON.stringify({ rk, bolts: co.bolts, sp }).slice(0, 120));
  }
  const L = P.catchLeg(cR, cO, obj('car'), 100, 'hard'); if (L.catch && L.catch.sinkRatio > 1) bad.push('catch ' + tag);
}
console.log(bad.length, bad.slice(0, 30).join('\n'));
