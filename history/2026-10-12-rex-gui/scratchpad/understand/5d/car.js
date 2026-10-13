global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const footPulse = (body) => 2 * P.WALK.STAMP.t * Math.sqrt(P.WALK.HIP * body.H / P.WALK.HS.h);
const M = P.RESTRAINT.MOVES.throw;
const landShake = M.shake, runOrig = M.run;
M.run = (c, o) => { const r = runOrig(c.ownRecoil ? Object.assign({}, c, { anchor: 'bolted' }) : c, o); if (c.ownRecoil && r.canMove && !r.push.stalled) r.toGround = { J: r.push.pB - r.push.pA, T: Math.max(footPulse(c.body), r.push.t) }; return r; };
M.shake = (r, o) => { const land = landShake(r, o); if (!r.toGround) return land; const own = P.vibSource(o.surface, 'hann', 2 * r.toGround.J / r.toGround.T, r.toGround.T); return [land, own].filter(Boolean); };
console.log('car', JSON.stringify(obj('car')));
for (const sid of ['concrete', 'sand', 'ice']) for (const own of [false, true]) {
  const c = { F: 90718.474 * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction', ownRecoil: own, gentleHold: true };
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('car'), angle: 45, target: 30, near: 5, gentleHold: true });
  const gl = p.goal(), ce = p.ceiling(), r = p.run(gl.use), ra = p.run(undefined);
  console.log(sid, 'own', own, '| goal use', (gl.use / g).toPrecision(4), 'v', r.v.toFixed(2), 'recoilV', r.recoilV.toFixed(3), 'range', r.flight.range.toFixed(1), '| ceiling', ce.by, isFinite(ce.use) ? (ce.use / g).toPrecision(4) : ce.use,
    '| hazards', p.hazards().map(h => h.id + ':' + (h.never ? '-' : (h.use / g).toPrecision(3))).join(' '), '| presets', p.presets().map(h => h.id + ':' + (h.never ? '-' : (h.use / g).toPrecision(3))).join(' '),
    '| allout v', ra.v.toFixed(2), 'recoilV', ra.recoilV.toFixed(2), 'J', ra.toGround ? ra.toGround.J.toFixed(0) : '-', 'T', ra.toGround ? ra.toGround.T.toFixed(3) : '-');
}
