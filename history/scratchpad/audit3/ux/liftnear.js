global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
function sig(x, n) { if (!isFinite(x)) return '∞'; if (x === 0) return '0'; const d = Math.floor(Math.log10(Math.abs(x))); const p = Math.pow(10, n - 1 - d); const r = Math.round(x * p) / p; return r.toLocaleString('en-US', { maximumFractionDigits: Math.max(0, n - 1 - d) }); }
const ctx = (lg, mode) => ({ F: Math.pow(10, lg) * g, mode: mode || 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' });
let hits = [];
for (const o of D.objects) {
  for (let k = 100; k <= 3400; k++) {
    const lg = k / 100;
    const r = P.lift(ctx(lg), o);
    if (!r.canLift) {
      const chip = sig(r.strengthMargin * 100, 2);
      const need = 1 / r.strengthMargin;
      const verdict = need < 2 ? sig((need - 1) * 100, 2) + '% more strength.' : sig(need, 2) + '× the strength he has.';
      if (chip === '100' || verdict.startsWith('0%')) hits.push(`${o.id} (${o.m} kg) at slider ${lg}: chip "Strength: ${chip}% of what’s needed" / verdict "Rex can’t budge it. It needs ${verdict}"`);
    }
  }
}
console.log(hits.length + ' slider positions:'); console.log(hits.slice(0, 40).join('\n'));
// throw "about N× more strength"
const fmtRatio = (r) => r >= 1000 ? r.toExponential(1) + '×' : sig(r, 2) + '×';
let th = [];
for (const mode of ['comic', 'real']) for (const o of D.objects.filter(x => !x.noThrow)) for (let k = 100; k <= 3400; k++) {
  const lg = k / 100; const r = P.throwObject(Object.assign(ctx(lg, mode), { record: true }), o, 45);
  if (r.canHold && !r.canMove) { const t = fmtRatio(r.needed / Math.max(r.Fdrive, 1e-9)); if (/^1(\.0)?×$|^1\.[0-4]×$/.test(t) || r.needed / r.Fdrive < 1.05) th.push(`${mode} ${o.id} @${lg}: "Try a lighter object, or about ${t} more strength."`); }
}
console.log(th.length + ' throw positions with ~1× wording'); console.log(th.slice(0, 10).join('\n'));
