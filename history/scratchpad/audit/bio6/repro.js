global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s => s.id === 'concrete');
const ball = D.objects.find(o => o.id === 'baseball');
function ctx(F, mode, H, gh) { const m = 180 * (H/2)**3; return { F, mode, body: P.makeBody({ H, m }), surface: surf, groundHolds: gh, anchor: 'friction' }; }
for (const gh of [true, false]) for (const H of [0.4, 2, 50]) {
  const c = ctx(Infinity, 'real', H, gh);
  const p = P.punch(c), cl = P.clap(c), j = P.jump(c), sp = P.sprint(c), st = P.stomp(c);
  const b = ball ? P.throwObject(c, ball, 45) : null;
  console.log(`gh=${gh} H=${H} s=${c.body.s}: punch ${p.vFist.toFixed(1)} (M${p.mach.toFixed(2)}), clap ${cl.vHand.toFixed(1)}, stompFoot ${st.vFoot.toFixed(1)}, jump v ${j.v.toFixed(1)} apex ${j.flight.apex.toFixed(1)} vacApex ${j.vacuumApex.toFixed(1)}, ball ${b ? b.v.toFixed(1) : 'n/a'}, sprint ${sp.vTop.toFixed(1)} (${sp.topLimit}, M${sp.mach.toFixed(2)}), jumpv/sprint ${(j.v/sp.vTop).toFixed(2)}`);
}
// finite strengths: does size matter there too?
for (const kg of [511, 5e4, 1e7]) for (const H of [2, 50]) {
  const c = ctx(kg*g, 'real', H, true);
  console.log(`kg ${kg} H ${H}: punch ${P.punch(c).vFist.toFixed(1)} jump ${P.jump(c).v.toFixed(2)} sprint ${P.sprint(c).vTop.toFixed(1)} ${P.sprint(c).topLimit}`);
}
