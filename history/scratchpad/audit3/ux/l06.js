global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const vals = D.feats.filter(f => f.run && f.run.liftKg).map(f => [f.title, f.run.liftKg, f.run.obj]).concat(D.tiers.filter(t => isFinite(t.liftKg)).map(t => ['tier ' + t.id, t.liftKg]));
for (const [n, kg, obj] of vals) {
  const lg = Math.log10(kg) + 1e-12;
  const back = Math.pow(10, lg);
  const o = obj && D.objects.find(x => x.id === obj);
  let lift = '';
  if (o) { const r = P.lift({ F: back * P.K.g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' }, o); lift = ' canLift=' + r.canLift + ' margin=' + r.strengthMargin + ' objm=' + o.m; }
  console.log((back >= kg ? 'ok ' : 'LOW') + ' ' + n + ' ' + kg + ' -> ' + back + ' lg ' + lg + (lg > 34 || lg < 1 ? ' OUT OF VALID RANGE' : '') + lift);
}
