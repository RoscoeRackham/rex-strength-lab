global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
function run(H, m, kg, surfaceId, anchor, groundHolds, mode) {
  const body = P.makeBody({ H, m });
  const surface = D.surfaces.find(s => s.id === surfaceId);
  const c = { F: kg * g, mode, body, surface, groundHolds, anchor };
  const ob = id => D.objects.find(o => o.id === id);
  console.log(`--- H=${H} m=${m} kg=${kg} surf=${surfaceId} anchor=${anchor} gh=${groundHolds} mode=${mode}; F/W=${(kg/m).toFixed(4)}`);
  const sp = P.sprint(c); console.log('sprint cantStand', sp.cantStand);
  for (const id of ['car','shot','tank']) { const l = P.lift(c, ob(id)); console.log('lift', id, 'canLift', l.canLift, 'margin', l.strengthMargin.toFixed(2), 'groundRatio', l.groundRatio.toFixed(3), 'standRatio', l.standRatio.toFixed(3)); }
  for (const id of ['car','shot','tank','baseball']) { const t = P.throwObject(c, ob(id), 30); console.log('throw', id, 'canHold', t.canHold, 'canMove', t.canMove, 'v', t.v && t.v.toFixed(2), 'range', t.flight && t.flight.range && t.flight.range.toFixed(1), 'recoilV', t.recoilV && t.recoilV.toFixed(3)); }
  for (const id of ['car']) { const p = P.pull(c, ob(id)); console.log('pull', id, p.canMove, p.t10m, 'anchorR', p.anchor.R, 'resist', p.resist); }
  const pu = P.punch(c); console.log('punch vFist', pu.vFist, 'recoilV', pu.recoilV, 'anchorR', pu.anchor.R);
  const j = P.jump(c); console.log('jump v', j.v, 'apex', j.flight.apex);
  const st = P.stomp(c); console.log('stomp vFoot', st.vFoot, 'E', st.E, 'vBody', st.vBody);
  const cl = P.clap(c); console.log('clap vHand', cl.vHand);
}
console.log(D.surfaces.map(s=>s.id));
run(50, 180*Math.pow(25,3), 90718.474, D.surfaces[0].id, 'friction', false, 'comic');
run(2, 180, 100, D.surfaces[0].id, 'friction', false, 'comic');
