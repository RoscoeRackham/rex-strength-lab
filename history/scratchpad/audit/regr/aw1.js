const { P, D, g, surf, obj, V, C } = require('./h.js');
let n = 0;
for (const mode of ['comic', 'real']) for (const gh of [false, true]) for (const anchor of ['friction', 'braced', 'bolted']) for (const [H, oH] of [[2, 2], [0.1, 2], [2, 0.1], [500, 500], [500, 2]]) for (const oKg of [10, 1000, 1e5, 1e9]) {
  let prev = null, row = '';
  for (let lg = 1; lg <= 34; lg += 0.25) {
    const cA = C({ kg: Math.pow(10, lg), mode, gh, anchor, H, m: 1000 * P.bodyVolume(H) });
    const cB = C({ kg: oKg, mode, gh, anchor, H: oH, m: 1000 * P.bodyVolume(oH) });
    let r; try { r = P.armWrestle(cA, cB); } catch (e) { console.log('THROW', e.message); n++; break; }
    row += r.outcome === 'pin' ? (r.winner) : (r.outcome || '?')[0];
    const t = r.outcome === 'pin' && r.winner === 'A' ? r.pin.t : null;
    for (const k of ['contact', 'torqueA', 'torqueB']) if (r[k] !== undefined && Number.isNaN(r[k])) { n++; console.log('NaN', k, mode, gh, anchor, H, oH, oKg, lg); }
    if (prev && prev.t != null && t != null && t > prev.t * 1.02) { n++; if (n < 30) console.log('PIN TIME RISE', mode, 'gh' + gh, anchor, 'H', H, oH, 'oKg', oKg, 'lg' + prev.lg, prev.t.toPrecision(4), '->', 'lg' + lg, t.toPrecision(4)); }
    if (prev && prev.win === 'A' && r.outcome === 'pin' && r.winner === 'B') { n++; if (n < 30) console.log('WINNER FLIPS to B', mode, gh, anchor, H, oH, oKg, lg); }
    prev = { t, lg, win: r.outcome === 'pin' ? r.winner : null };
  }
  if (anchor === 'friction' && H === 2 && oH === 2) console.log(mode, 'gh' + gh, anchor, H, oH, 'oKg', oKg, row);
}
console.log('n', n);
