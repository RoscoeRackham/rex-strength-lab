global.window = {};
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/verifyR5/verify-ground/lab/src/engine.js');
require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/verifyR5/verify-ground/lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const objs = D.objects || D.things;
console.log(Object.keys(D));
const car = (D.objects||[]).find(o => o.id === 'car');
for (const sid of ['concrete', 'sand']) for (const ang of [30, 45, 60, 89, 90]) for (const pw of ['all4', 'unbBolted', 'unbFriction']) {
  const ctx = { F: Infinity, mode: 'comic', body, surface: D.surfaces.find(s => s.id === sid), anchor: pw === 'unbBolted' ? 'bolted' : 'friction',
    airAbsorb: pw === 'all4' ? 1 : 0, keepForm: pw === 'all4', unbreakable: true, ownRecoil: pw === 'all4' };
  const r = P.throwObject(ctx, car, ang);
  const tg = r.toGround || (r.extra && r.extra.toGround);
  console.log(sid, ang, pw, JSON.stringify(tg, (k, v) => typeof v === 'number' && !isFinite(v) ? String(v) : v));
}
