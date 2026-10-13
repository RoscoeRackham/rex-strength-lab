// prototype of the recommended 5d semantics on the HEAD engine (no file edits): ownRecoil = bolted footing for the
// throw's stroke, plus the stroke's push into the ground as a shaking source at his feet
global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.throw;
const landShake = M.shake;
const runOrig = M.run;
M.run = (c, o) => { const r = runOrig(c.ownRecoil ? Object.assign({}, c, { anchor: 'bolted' }) : c, o); if (c.ownRecoil && r.canMove && !r.push.stalled) r.toGround = { J: r.push.pB - r.push.pA, T: r.push.t }; return r; };
M.shake = (r, o) => { const land = landShake(r, o); if (!r.toGround) return land; const own = P.vibSource(o.surface, 'hann', 2 * r.toGround.J / r.toGround.T, r.toGround.T); return [land, own].filter(Boolean); };
for (const [sid, F, gentle] of [['ice', 1e5, false], ['ice', 1e5, true], ['softclay', 1e5, true], ['softclay', 1e6, true], ['sand', 1e6, true], ['concrete', 1e6, true]]) for (const own of [false, true]) {
  const c = { F: F * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction', ownRecoil: own, gentleHold: gentle };
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('bus'), angle: 45, target: 30, near: 5, gentleHold: gentle });
  const ce = p.ceiling();
  const r = p.run(ce.below === Infinity ? undefined : ce.below), ra = p.run(undefined);
  const src = M.shake(ra, p.opt);
  console.log(sid, F, 'gentle', gentle, 'own', own, '| ceiling', ce.by, isFinite(ce.use) ? (ce.use / g).toPrecision(4) + ' kg' : ce.use, '| hazards', p.hazards().map(h => h.id + ':' + (h.never ? '-' : (h.use / g).toPrecision(3))).join(' '),
    '| presets', p.presets().map(h => h.id + ':' + (h.never ? '-' : (h.use / g).toPrecision(3))).join(' '),
    '| allout v', ra.v.toFixed(2), 'recoilV', ra.recoilV.toFixed(2), 'slide', M.slide(ra, p.opt).toFixed(2), 'J', ra.toGround ? ra.toGround.J.toFixed(0) : '-', 'T', ra.toGround ? ra.toGround.T.toFixed(3) : '-', 'ppv5 mm/s', (P.ppvAt(src, 5) * 1e3).toFixed(3));
}
console.log('--- which source sets plaster (sand and softclay, 1e6 dial, own on)');
for (const sid of ['sand', 'softclay', 'concrete']) {
  const c = { F: 1e6 * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction', ownRecoil: true, gentleHold: true };
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('bus'), angle: 45, target: 30, near: 5, gentleHold: true });
  const h = p.result('hazard:plaster');
  const r = p.run(h.use);
  const land = landShake(r, p.opt), own = P.vibSource(p.opt.surface, 'hann', 2 * r.toGround.J / r.toGround.T, r.toGround.T);
  console.log(sid, 'use', (h.use / g).toPrecision(4), 'land ppv5', (P.ppvAt(land, 5) * 1e3).toFixed(2), 'limit', (P.plasterLimitHz(1 / land.T) * 1e3).toFixed(2), 'own ppv5', (P.ppvAt(own, 5) * 1e3).toFixed(2), 'own limit', (P.plasterLimitHz(1 / own.T) * 1e3).toFixed(2), 'J', r.toGround.J.toFixed(0), 'T', r.toGround.T.toFixed(3), 'v', r.v.toFixed(2), 'range', r.flight.range.toFixed(1));
}
