// Independent re-check of F9: jump ground-status chip vs engine groundFails
const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g;
// verbatim helpers from app.html
function sig(x, n) { if (x === 0) return '0'; const d = Math.floor(Math.log10(Math.abs(x))); const p = Math.pow(10, n - 1 - d); const r = Math.round(x * p) / p; return r.toLocaleString('en-US', { maximumFractionDigits: Math.max(0, n - 1 - d) }); }
const NAMES = [[1e24, 'septillion'], [1e21, 'sextillion'], [1e18, 'quintillion'], [1e15, 'quadrillion'], [1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million']];
function big(x, n) { if (!isFinite(x)) return '∞'; for (const [v, name] of NAMES) if (Math.abs(x) >= v) return sig(x / v, n || 3) + ' ' + name; if (Math.abs(x) >= 1000) return Math.round(x).toLocaleString('en-US'); return sig(x, n || 3); }
function fmtRatio(r) { return r >= 1000 ? big(r, 2) + '×' : sig(r, 2) + '×'; }
function groundStatus(c, ratio) { if (c.groundHolds) return 'info: Ground: comic, never breaks'; if (ratio <= 1) return 'good: Ground holds (' + sig(ratio * 100, 2) + '% of limit)'; return 'bad: Ground fails: ' + fmtRatio(ratio) + ' its limit'; }
function ctx(kg, mode, surface) {
  const body = P.makeBody({ H: 2, m: 180 });
  return { F: kg * g, mode, body, surface: D.surfaces.find((s) => s.id === surface), groundHolds: false, anchor: 'friction' };
}
console.log('jump comicFrac', P.MUSCLE.jump.comicFrac, 'forceFrac', P.MUSCLE.jump.forceFrac);
for (const mode of ['comic', 'real']) {
  for (const surface of ['concrete', 'sand']) {
    const RB = D.surfaces.find((s) => s.id === surface).qult * 2 * P.makeBody({}).footArea;
    const lo = RB / g / P.MUSCLE.jump.comicFrac / 1.0, hi = RB / g;
    for (const kg of [0.9 * RB / g, RB / g * 0.999, (RB / g) * 1.2, (RB / g) / P.MUSCLE.jump.comicFrac * 0.99, (RB / g) / P.MUSCLE.jump.comicFrac * 1.01]) {
      const c = ctx(kg, mode, surface);
      const r = P.jump(c);
      const appRatio = r.groundFails ? (c.F / r.groundLimitForce) : (c.F / Math.max(r.groundLimitForce, 1));
      console.log(mode.padEnd(5), surface.padEnd(8), 'lift', (kg / 1000).toFixed(2), 't | r.F', r.F.toExponential(4), 'RB', r.groundLimitForce.toExponential(4),
        '| groundFails', r.groundFails, '| sink', r.sink.toExponential(2), '| apex', r.flight.apex.toFixed(2), 'm | chip:', groundStatus(c, appRatio), '| true r.F/RB', (r.F / r.groundLimitForce).toFixed(4));
    }
  }
}
for (const kg of [110e3, 125e3]) {
  const c = ctx(kg, 'comic', 'concrete');
  const r = P.jump(c);
  const appRatio = r.groundFails ? (c.F / r.groundLimitForce) : (c.F / Math.max(r.groundLimitForce, 1));
  const ground = (!c.groundHolds && !r.groundFails) ? 'happens: The ground held this time...' : '';
  console.log('FINDING CASE', kg, 'chip:', groundStatus(c, appRatio), '| r.F/RB', (r.F / r.groundLimitForce).toFixed(4), '| groundFails', r.groundFails, '| apex', r.flight.apex.toFixed(1), '|', ground, '| verdict holes?', r.groundFails);
}
