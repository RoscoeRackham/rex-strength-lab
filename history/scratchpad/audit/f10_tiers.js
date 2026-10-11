const fs = require('fs'), vm = require('vm');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const win = {}; vm.runInNewContext(fs.readFileSync('/home/user/dino-strength-sim/src/data.js','utf8'), { window: win });
const D = win.DINO_DATA;
const cdSphere = (M) => M <= 0.722 ? 0.45*M*M + 0.424 : 2.1*Math.exp(-1.2*(M+0.35)) - 8.9*Math.exp(-2.2*(M+0.35)) + 0.92;
// Carter cube fit, clamped to avoid the discontinuity at M 1.15
const cdCube = (M) => M <= 1.15 ? 0.60*M*M + 1.04 : 2.1*Math.exp(-1.16*(M+0.35)) - 6.5*Math.exp(-2.23*(M+0.35)) + 1.67;
const src = fs.readFileSync('/home/user/dino-strength-sim/src/engine.js','utf8');
const patchedSrc = src.replace('const dk = -beta * rho * v;', 'const dk = -beta * rho * v * (o.cdFn ? o.cdFn(v / K.a0) / Cd : 1);');
const m = { exports: {} }; vm.runInNewContext(patchedSrc, { module: m, self: undefined, Math, isFinite, Infinity });
const P2 = m.exports;
const body = P.makeBody({});
const surf = D.surfaces.find(s=>s.id==='concrete');
const cdFor = (o) => o.id==='baseball' ? (M)=> M < 0.7 ? o.Cd : Math.max(o.Cd, cdSphere(M))
                   : o.id==='shot' ? (M)=> Math.max(o.Cd, cdSphere(M))
                   : (M)=> o.Cd * cdCube(M)/1.04; // bluff body, scale cube curve to the object's subsonic Cd
for (const mode of ['comic','real']) for (const t of D.tiers) for (const oid of ['baseball','shot','car','tank']) {
  const o = D.objects.find(x=>x.id===oid);
  const ctx = { F: t.liftKg*g, mode, body, surface: surf, groundHolds:false, anchor:'friction' };
  const r = P.throwObject(ctx, o, 45);
  const f = r.flight;
  if (!r.canMove) { console.log(mode, t.id, oid, 'cannot move'); continue; }
  if (f.relativistic) { console.log(mode, t.id, oid, 'v', r.v.toExponential(2), 'relativistic'); continue; }
  const b = P2.fly({ v0: r.v, thetaDeg: 45, h0: body.releaseHeight, m: o.m, A: o.area, Cd: o.Cd, cdFn: cdFor(o) });
  const cdL = cdFor(o)(r.v/K.a0);
  console.log(mode, t.id.padEnd(10), oid.padEnd(8), 'v', r.v.toFixed(0).padStart(7), 'M', (r.v/K.a0).toFixed(2).padStart(6),
    '| UI eFold', f.eFold.toFixed(0), 'launch-Cd eFold', (2*o.m/(K.rho0*cdL*o.area)).toFixed(0),
    '| range', f.range.toFixed(0), 'vs Cd(M)', b.range.toFixed(0), 'ratio', (f.range/b.range).toFixed(2), f.escaped ? 'ESC' : '', b.escaped ? 'ESC2':'');
}
