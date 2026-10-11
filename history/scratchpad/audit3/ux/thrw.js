global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
function sig(x, n) { if (!isFinite(x)) return '∞'; if (x === 0) return '0'; const d = Math.floor(Math.log10(Math.abs(x))); const p = Math.pow(10, n - 1 - d); const r = Math.round(x * p) / p; return r.toLocaleString('en-US', { maximumFractionDigits: Math.max(0, n - 1 - d) }); }
const ctx = (lg, mode) => ({ F: Math.pow(10, lg) * g, mode, body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction', record: false });
for (const mode of ['comic', 'real']) for (const o of D.objects.filter(x => !x.noThrow)) {
  let prev = null;
  for (let k = 100; k <= 3400; k += 10) {
    const r = P.throwObject(ctx(k / 100, mode), o, 45);
    if (r.canHold && !r.canMove) prev = k;
    if (r.canMove && prev != null) {
      for (let j = prev; j <= k; j++) {
        const rr = P.throwObject(ctx(j / 100, mode), o, 45);
        if (rr.canHold && !rr.canMove && rr.needed / rr.Fdrive < 1.05) console.log(`${mode} ${o.id} slider ${j / 100}: "Try a lighter object, or about ${sig(rr.needed / rr.Fdrive, 2)}× more strength." (exact ${(rr.needed / rr.Fdrive).toFixed(4)})`);
      }
      break;
    }
    if (r.canMove) break;
  }
}
