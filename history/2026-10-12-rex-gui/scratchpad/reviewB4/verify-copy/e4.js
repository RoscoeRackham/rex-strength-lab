const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ctx = (kg, o) => Object.assign({ F: kg * g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
function check(lbl, move, kg, extra, o2) {
  const c = ctx(kg, extra); const M = P.RESTRAINT.MOVES[move];
  const opt = Object.assign({ near: 5, m: c.body.m, body: c.body, surface: c.surface, anchor: c.anchor, airAbsorb: c.airAbsorb, keepForm: c.keepForm, unbreakable: c.unbreakable, ownRecoil: c.ownRecoil }, o2 || {});
  const r = M.run(Object.assign({}, c, { use: Infinity }), opt); const src = M.shake(r, opt);
  const list = Array.isArray(src) ? src : [src];
  console.log(lbl, 'nonlinear@5m:', P.ppvNonlinear(src, 5), ' plasterReach:', P.plasterReach(src).toPrecision(4), ' ppv5 mm/s:', list.map(s => s && (P.ppvAt(s, 5) * 1000).toPrecision(3)).join(','));
}
check('stomp 1e12', 'stomp', 1e12);
check('allstar throw', 'throw', 1.81436948e23, {}, { obj: D.objects.find(o => o.id === 'baseball'), angle: 0 });
check('jump 1e8', 'jump', 1e8);
check('stomp 1e12, UB off (main-like)', 'stomp', 1e12, { unbreakable: false });
{
  const c = ctx(1.81436948e23); const M = P.RESTRAINT.MOVES.throw; const obj = D.objects.find(o => o.id === 'baseball');
  const opt = { near: 5, m: c.body.m, body: c.body, surface: c.surface, anchor: c.anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, obj, angle: 0 };
  for (const u of [Infinity, c.F]) { const r = M.run(Object.assign({}, c, { use: u }), opt); console.log('use', u, 'canMove', r.canMove, 'toGround', r.toGround, 'v', r.v);
    const src = M.shake(r, opt); console.log(' src', JSON.stringify(src && (Array.isArray(src) ? src.map(s => s && { F: s.F, T: s.T }) : { F: src.F, T: src.T })), 'nonlinear', P.ppvNonlinear(src, 5), 'plaster', P.plasterReach(src)); }
  const p = P.RESTRAINT.planNow('throw', c, opt); console.log('plan allout reach', JSON.stringify(P.RESTRAINT.reach('throw', p.run ? p.run(c.F) : null, opt)));
}
