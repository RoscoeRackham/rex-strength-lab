global.window = {};
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/verifyR5/verify-ground/lab/src/engine.js');
require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/verifyR5/verify-ground/lab/src/data.js');
const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const mk = (body) => ({ F: Infinity, mode: 'comic', body, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true });
const J = (o) => JSON.stringify(o, (k, v) => typeof v === 'number' && !isFinite(v) ? String(v) : v);
for (const th of [45, 75, 90]) { const o = P.throwPartner(mk(rex), mk(ollie), th); console.log('throwPartner', th, J(o.r.toGround)); }
// finite check: same angle, 1e30 kg dial
for (const th of [45]) { const c = mk(rex); c.F = 1e30 * P.K.g; const r = P.throwObject(c, D.objects.find(o => o.id === 'car'), th); console.log('car 1e30', th, J(r.toGround)); }
// powers-off unchanged? unbreakable false
{ const c = mk(rex); c.unbreakable = false; const r = P.throwObject(c, D.objects.find(o => o.id === 'car'), 45); console.log('unb off', J(r.toGround)); }
