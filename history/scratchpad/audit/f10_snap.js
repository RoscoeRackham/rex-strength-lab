const fs = require('fs'), vm = require('vm'), path = require('path');
const S = path.join(__dirname, 'snap_f10');
const P = require(S + '/engine.js'); const K = P.K, g = K.g;
const win = {}; vm.runInNewContext(fs.readFileSync(S + '/data.js','utf8'), { window: win }); const D = win.DINO_DATA;
const src = fs.readFileSync(S + '/engine.js','utf8');
const pat = src.replace('const dk = -beta * rho * v;', 'const dk = -beta * rho * v * (o.cdFn ? o.cdFn(v / K.a0) / Cd : 1);');
if (pat === src) throw 'patch failed';
const m = { exports: {} }; vm.runInNewContext(pat, { module: m, self: undefined, Math, isFinite, Infinity }); const P2 = m.exports;
// Mach table using the data's own Cd (subsonic) and CdSup: flat to M0.6, linear to CdSup at M1.2, flat above
const cdTable = (o) => (M) => M <= 0.6 ? o.Cd : M >= 1.2 ? o.CdSup : o.Cd + (o.CdSup - o.Cd) * (M - 0.6) / 0.6;
const body = P.makeBody({}); const surf = D.surfaces.find(s => s.id === 'concrete');
const objs = ['baseball','shot','car','tank'].map(id => D.objects.find(o => o.id === id));
console.log('objects:', objs.map(o => `${o.id} m=${o.m} A=${o.area} Cd=${o.Cd} CdSup=${o.CdSup}`).join(' | '));
const fmt = (x) => x >= 1000 ? (x/1000).toFixed(2)+' km' : x.toFixed(0)+' m';
for (const t of D.tiers) for (const o of objs) {
  const r = P.throwObject({ F: t.liftKg * g, mode: 'comic', body, surface: surf, groundHolds: false, anchor: 'friction' }, o, 45);
  const f = r.flight;
  if (!r.canMove || f.relativistic || !(r.v > 0)) continue;
  const M = r.v / K.a0;
  const b = P2.fly({ v0: r.v, thetaDeg: 45, h0: body.releaseHeight, m: o.m, A: o.area, Cd: o.Cd, cdFn: cdTable(o) });
  const eSup = 2 * o.m / (K.rho0 * cdTable(o)(M) * o.area);
  console.log(t.id.padEnd(10), o.id.padEnd(8), 'v', r.v.toFixed(0).padStart(7), 'M', M.toFixed(2).padStart(6), '| UI: "63% every', fmt(f.eFold) + '"', ' launch-Mach eFold', fmt(eSup),
    '| range engine', fmt(f.range), ' Cd(M)', fmt(b.range), ' ratio', (f.range / b.range).toFixed(2));
}
// The finding's specific speeds for the shot and baseball
for (const o of objs.slice(0,2)) for (const v of [600, 1000, 3000]) {
  const a = P.fly({ v0: v, thetaDeg: 45, h0: 1.8, m: o.m, A: o.area, Cd: o.Cd });
  const b = P2.fly({ v0: v, thetaDeg: 45, h0: 1.8, m: o.m, A: o.area, Cd: o.Cd, cdFn: cdTable(o) });
  console.log(o.id, 'v0', v, 'range ratio const/Cd(M)', (a.range / b.range).toFixed(2));
}
