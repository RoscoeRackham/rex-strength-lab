const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, K = P.K;
const body = P.makeBody({ H: 2, m: 180 });
const vesc = Math.sqrt(2 * K.GM / K.R_E);
// find threshold logKg where v crosses v_esc for each setting
for (const gh of [false, true]) {
  const surface = D.surfaces.find(s => s.id === 'concrete');
  let lo = 5, hi = 16;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; const r = P.jump({ F: 10 ** mid * K.g, mode: 'comic', body, surface, groundHolds: gh, anchor: 'friction' }); if (r.v > vesc) hi = mid; else lo = mid; }
  const lkEsc = hi;
  lo = 5; hi = 16;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; const r = P.jump({ F: 10 ** mid * K.g, mode: 'comic', body, surface, groundHolds: gh, anchor: 'friction' }); if (r.v > 0.01 * K.c) hi = mid; else lo = mid; }
  console.log('groundHolds', gh, 'v exceeds v_esc at logKg', lkEsc.toFixed(3), '; relativistic cutoff (UI hides tiles) at logKg', hi.toFixed(3));
  for (const t of D.tiers.filter(t => isFinite(t.liftKg))) {
    const r = P.jump({ F: t.liftKg * K.g, mode: 'comic', body, surface, groundHolds: gh, anchor: 'friction' });
    const f = r.flight;
    console.log('  ', t.id, 'v', r.v.toPrecision(5), 'rel', f.relativistic, 'escapedWithDrag', f.escaped, 'UI no-air shown', !f.relativistic && !f.escaped, 'value km', (r.vacuumApex / 1e3).toPrecision(5), 'truth', r.v > vesc ? 'ESCAPES' : 'finite');
  }
}
