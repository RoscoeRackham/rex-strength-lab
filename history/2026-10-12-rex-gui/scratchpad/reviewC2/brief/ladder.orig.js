/* Rex Super-Strength Lab: the energy ladder's wording (BRIEF-gui.md section 6). Text only, no physics.
 * An energy is compared with the nearest rung on a log scale: a multiple of the rung below it (at most about 10×) or a
 * share of the rung above it (at least about 10%). Rungs are never more than 100× apart, so one of the two always fits.
 * Below the bottom rung or above the top one, the energy is beyond the ladder.
 * Runs in the browser (window.EnergyLadder) and in Node (module.exports) for tests.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EnergyLadder = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const MAX_GAP = 100;    // widest step between neighbouring rungs: √100 = 10× either side of the midpoint
  const SAME = 1.15;      // within 15% of a firm rung: "about the same as"
  const SAME_ROUGH = 1.5; // within 1.5× of a rung uncertain by more than 2×: "roughly the same as"

  // x (between about 0.1 and 100) to n significant figures, plain digits
  function num(x, n) {
    const d = Math.floor(Math.log10(Math.abs(x)));
    const p = Math.pow(10, n - 1 - d);
    const r = Math.round(x * p) / p;
    return String(Number(r.toFixed(Math.max(0, n - 1 - d))));
  }
  const band = (r) => (r.rough ? SAME_ROUGH : SAME);

  // refs: [{ id, short, J, rough }]. Returns { kind, ref, x, text }: kind is 'same', 'times', 'share', 'below', 'above',
  // 'none' (no energy) or 'infinite'; x is J ÷ the rung's energy.
  function compare(J, refs) {
    if (J === Infinity) return { kind: 'infinite', ref: null, x: Infinity, text: 'more than any finite amount' };
    if (!(J > 0) || !isFinite(J)) return { kind: 'none', ref: null, x: 0, text: 'no energy to compare' };
    const list = refs.slice().sort((a, b) => a.J - b.J);
    const lo = list[0], hi = list[list.length - 1];
    if (J < lo.J / band(lo)) return { kind: 'below', ref: lo, x: J / lo.J, text: 'beyond the ladder: less than its smallest rung (' + lo.short + ')' };
    if (J > hi.J * band(hi)) return { kind: 'above', ref: hi, x: J / hi.J, text: 'beyond the ladder: more than its top rung (' + hi.short + ')' };
    let best = lo;
    for (const r of list) if (Math.abs(Math.log(J / r.J)) < Math.abs(Math.log(J / best.J))) best = r;
    const x = J / best.J, b = band(best);
    if (x < b && x > 1 / b) return { kind: 'same', ref: best, x, text: (best.rough ? 'roughly' : 'about') + ' the same as ' + best.short };
    if (x >= 1) return { kind: 'times', ref: best, x, text: (best.rough ? 'roughly ' + num(x, 1) : num(x, 2)) + '× ' + best.short };
    return { kind: 'share', ref: best, x, text: (best.rough ? 'roughly ' + num(100 * x, 1) : num(100 * x, 2)) + '% of ' + best.short };
  }

  // neighbouring rungs more than MAX_GAP apart (an energy in between would need a multiple above 10× or a share below 10%)
  function gaps(refs) {
    const list = refs.slice().sort((a, b) => a.J - b.J), out = [];
    for (let i = 1; i < list.length; i++) if (list[i].J / list[i - 1].J > MAX_GAP) out.push({ from: list[i - 1], to: list[i], ratio: list[i].J / list[i - 1].J });
    return out;
  }

  return { compare, gaps, num, MAX_GAP, SAME, SAME_ROUGH };
});
