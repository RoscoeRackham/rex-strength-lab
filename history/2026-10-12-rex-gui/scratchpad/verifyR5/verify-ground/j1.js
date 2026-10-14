global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const RS = P.RESTRAINT, M = RS.MOVES.jump;
const build = process.argv[2] || 'rex', surfId = process.argv[3] || 'concrete';
const body = P.makeBody({ build, H: build === 'rex' ? 3.048 : 3.06, m: 3007 });
const surface = D.surfaces.find(s => s.id === surfId);
function run(lk, on) {
  const ctx = { F: Math.pow(10, lk) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: on ? 1 : 0, keepForm: on, unbreakable: on, ownRecoil: on };
  const r = P.jump(ctx);
  const o = { near: 5, m: body.m, body, surface, anchor: 'friction', airAbsorb: ctx.airAbsorb, keepForm: on, unbreakable: on, ownRecoil: on, groundHolds: false };
  const src = M.shake(r, o);
  const list = (Array.isArray(src) ? src : [src]).filter(Boolean);
  return { r, list, ppv5: list.length ? Math.max(...list.map(x => P.ppvAt(x, 5))) : 0, pr: src ? P.plasterReach(src) : 0,
    parts: list.map(x => ({ J: x.F * x.T / 2, ppv5: P.ppvAt(x, 5), pr: P.plasterReach(x) })) };
}
for (let lk = 3; lk <= 13.01; lk += 0.4) {
  const a = run(lk, true), b = run(lk, false);
  const L = a.r.landing;
  console.log(lk.toFixed(1), 'v', a.r.v.toExponential(3), 'landV', L && L.v.toFixed(2), 'v1', a.r.landV1 && a.r.landV1.toFixed(3), 'ratioReal', a.r.landRatioReal && a.r.landRatioReal.toExponential(2),
    '| ON ppv5', (a.ppv5*1000).toFixed(2), 'mm/s plR', a.pr.toFixed(2), 'parts(J ppv5 pr)', a.parts.map(p => p.J.toPrecision(3)+'|'+(p.ppv5*1000).toFixed(1)+'|'+p.pr.toFixed(1)).join(' '),
    '| OFF ppv5', (b.ppv5*1000).toFixed(1), 'plR', b.pr.toFixed(1));
}
