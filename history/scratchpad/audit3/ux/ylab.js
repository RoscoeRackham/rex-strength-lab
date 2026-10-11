global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
function sig(x, n) { if (!isFinite(x)) return '∞'; if (x === 0) return '0'; const d = Math.floor(Math.log10(Math.abs(x))); const p = Math.pow(10, n - 1 - d); const r = Math.round(x * p) / p; return r.toLocaleString('en-US', { maximumFractionDigits: Math.max(0, n - 1 - d) }); }
const NAMES = [[1e24, 'septillion'], [1e21, 'sextillion'], [1e18, 'quintillion'], [1e15, 'quadrillion'], [1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million']];
function big(x, n) { x = Number(x.toPrecision(n || 3)); for (const [v, name] of NAMES) if (Math.abs(x) >= v) return sig(x / v, n || 3) + ' ' + name; return sig(x, n || 3); }
function fmtDist(m) { if (m < 0.01) return sig(m * 1000, 2) + ' mm'; if (m < 1) return sig(m * 100, 2) + ' cm'; if (m < 1000) return sig(m, 3) + ' m'; if (m < 1e9) return big(m / 1000, 3) + ' km'; return 'sci km'; }
const nice = (v) => { const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };
const base = (lg, extra) => Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction', record: true }, extra || {});
const seen = new Map();
for (const mode of ['comic', 'real']) for (const o of D.objects.filter(x => !x.noThrow)) for (let lg = 2.7; lg <= 26; lg += 0.5) for (const ang of [5, 30, 45, 70, 89]) {
  const r = P.throwObject(base(lg, { mode }), o, ang);
  if (!r.canMove || !r.canHold) continue; const f = r.flight; if (!f || f.relativistic || !f.path || f.path.length < 2) continue;
  let maxY = 0; for (const p of f.path) maxY = Math.max(maxY, p[1]);
  const Y = nice((maxY || 1) * 1.05);
  for (let i = 0; i <= 4; i++) { const s = fmtDist(Y * i / 4); const w = s.length * 6.6; if (w > 52 && !seen.has(s)) seen.set(s, `${mode} ${o.id} lg${lg} ${ang}° -> y label "${s}" ~${w.toFixed(0)}px wide, room 52px`); }
}
console.log([...seen.values()].join('\n'));
