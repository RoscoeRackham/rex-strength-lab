global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = 9.80665;
function ctx(s) {
  const body = P.makeBody({ H: s.H||2, m: s.m||180 });
  const surface = D.surfaces.find((x) => x.id === (s.surface||'concrete'));
  return { F: s.inf ? Infinity : Math.pow(10, s.logKg) * g, mode: s.mode||'comic', body, surface, groundHolds: !!s.groundHolds, anchor: s.anchor||'friction' };
}
function run(s, objId, angle) {
  const c = ctx(s); const o = D.objects.find(x=>x.id===objId);
  const r = P.throwObject(c, o, angle);
  const contact = r.hands * c.body.palmArea;
  const th = angle*Math.PI/180;
  const perp = r.mB*g*Math.cos(th);
  console.log(objId, s.mode, 'logKg', s.logKg, 'angle', angle, 'basis', r.basis||'-');
  console.log('  canMove', r.canMove, 'v', r.v.toFixed(3), 'range', r.flight && r.flight.range, 'heldBack', r.heldBack);
  console.log('  F', r.F, 'Fdrive', r.Fdrive, 'anchor.R', r.anchor.R, 'perp', perp, 'contact', contact, 'crush', o.crush);
  console.log('  gripRatio', r.gripRatio, 'plateNeeded', r.plateNeeded);
  const Fc = r.anchor.R*(1-1e-9);
  const handF = Math.hypot(Fc, perp);
  console.log('  handF at held-back', handF, 'ratio', handF/contact/o.crush, 'plate', handF/o.crush);
}
run({logKg:4.0, mode:'comic'}, 'car', 45);
run({logKg:34, mode:'real'}, 'tank', 30);
