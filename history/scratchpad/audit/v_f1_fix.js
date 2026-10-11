global.window = {};
const fs = require('fs');
let src = fs.readFileSync('/home/user/dino-strength-sim/src/engine.js', 'utf8');
const old = "const holeDepth = ctx.groundHolds ? 0 : E / (surface.qult * body.footArea);\n    const L = Math.cbrt(6 * mB / (Math.PI * 1000));\n    const crater = vFoot >= 2000 ? craterDiameter({ L, v: vFoot, rhoI: 1000, rhoT: surface.rho || 2000, angleDeg: 90 }) : 0;";
if (!src.includes(old)) throw new Error('anchor not found');
const neu = "const L = Math.cbrt(6 * mB / (Math.PI * 1000));\n    const crater = vFoot >= 2000 ? craterDiameter({ L, v: vFoot, rhoI: 1000, rhoT: surface.rho || 2000, angleDeg: 90 }) : 0;\n    const rhoT = surface.rho || 2000, kP = 1;\n    const pen = mB / (2 * kP * rhoT * body.footArea) * Math.log1p(kP * rhoT * vFoot * vFoot / surface.qult);\n    const holeDepth = ctx.groundHolds ? 0 : Math.max(pen, crater / 1.25 / (2 * Math.SQRT2));";
src = src.replace(old, neu);
fs.writeFileSync(__dirname + '/vf1/engine_fixed.js', src);
const P = require(__dirname + '/vf1/engine_fixed.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
for (const mode of ['comic', 'real']) for (const sid of ['sand', 'concrete', 'granite']) for (const t of D.tiers) {
  const body = P.makeBody({ H: 2 });
  const r = P.stomp({ F: isFinite(t.liftKg) ? t.liftKg * g : Infinity, mode, body, surface: S[sid], groundHolds: false, anchor: 'friction' });
  console.log(mode, sid.padEnd(8), t.id.padEnd(10), 'vFoot', r.vFoot.toExponential(2), 'hole(fixed)', r.holeDepth.toPrecision(3), 'crater D', r.crater.toPrecision(3), isFinite(r.holeDepth) ? '' : 'NONFINITE');
}
