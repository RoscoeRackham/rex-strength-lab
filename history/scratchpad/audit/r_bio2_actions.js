const P = require('/home/user/dino-strength-sim/src/engine.js');
const { limit, brute } = require('./r_bio2_ref.js');
if (!global.window) global.window = {}; require("/home/user/dino-strength-sim/src/data.js"); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
// monkey-patch pushApart to capture the args of the call made by each action
const orig = P.pushApart; let last;
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
for (const sid of ['concrete', 'sand']) {
  const ctx = { F: 1.36e14 * g, mode: 'real', body, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const rows = [];
  for (const oid of ['baseball', 'shot', 'car', 'bus']) {
    const r = P.throwObject(ctx, obj(oid), 45);
    // rebuild args exactly as throwObject does
    const th = Math.PI / 4, style = obj(oid).m <= 1 ? 'whip' : 'push', hands = obj(oid).m > 20 ? 2 : 1;
    const key = style === 'whip' ? 'throwWhip' : 'throwPush';
    const arm = hands * (style === 'whip' ? body.whipEff : body.handEff);
    const c = { d: style === 'whip' ? body.strokes.whip : body.strokes.throw, mA: body.m - arm, mB: obj(oid).m + arm, RA: r.anchor.R, RB: (obj(oid).m + arm) * g * Math.sin(th), vmax: P.MUSCLE[key].vmax };
    const L = limit(c);
    rows.push([sid, 'throw ' + oid + ' 45', 'vB', r.v, L.vB, 'recoil vA', r.recoilV, L.vA, 'RA', c.RA]);
  }
  const j = P.jump(ctx);
  const cj = { d: body.strokes.leg, mA: body.m - body.feetMass, mB: body.feetMass, RA: (body.m - body.feetMass) * g, RB: surf(sid).qult * 2 * body.footArea, vmax: 30 };
  rows.push([sid, 'jump', 'vA', j.push.vA, limit(cj).vA]);
  const s = P.stomp(ctx);
  const cs = { d: body.strokes.stomp, mA: body.m - body.legEff, mB: body.legEff, RA: (body.m - body.legEff) * g, RB: 0, vmax: 16 };
  rows.push([sid, 'stomp', 'vFoot', s.vFoot, limit(cs).vB, 'body vA', s.push.vA, limit(cs).vA]);
  const p = P.punch(ctx);
  const cp = { d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: p.anchor.R, RB: 0, vmax: 17 };
  rows.push([sid, 'punch', 'vFist', p.vFist, limit(cp).vB, 'recoil vA', p.recoilV, limit(cp).vA, 'RA', cp.RA]);
  const cl = P.clap(ctx);
  rows.push([sid, 'clap', 'vHand', cl.vHand, 17]);
  for (const r of rows) console.log(r.map(x => typeof x === 'number' ? x.toPrecision(4) : x).join('  '));
}
