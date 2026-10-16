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

  // The shimmer's level (BRIEF-canon.md item 6; canon, CLAUDE.md "Where absorbed energy goes" and the rulings of 14 Oct
  // 2026): his eyes, feather tips and mouth-glow shimmer in proportion to what he takes in, a faint flicker below a car
  // crash, a blinding flare for a dinosaur-killer-scale hit. The engine's RESTRAINT.takenBack gives the energy; this
  // words it. A log scale between the canon's two anchors, both ladder rungs found by key (no copied numbers):
  //   level 0, a flicker: a car crash (GLOW_KEYS.flicker, a Toyota Corolla at 100 km/h);
  //   level 1, a blinding flare: the dinosaur-killer (GLOW_KEYS.flare; a rough, disputed rung). Past it the level is
  //     held at 1: the canon gives no step beyond it.
  //   Below the flicker, a faint flicker, fading to nothing at a floor (GLOW_KEYS.floor, Usain Bolt at top speed): a
  //     design proposal, not canon. Below the floor energy is still taken back, but it is too faint to see.
  // Named steps at a quarter, a half and three quarters of the log span between flicker and flare. From the flicker up,
  // the word is the nearest named step on the log scale (the ladder's nearest-rung rule; a tie takes the lower step);
  // below it the canon's faint flicker. A step is rough by the ladder's own rule: the rung compare() words its energy
  // against is rough (the flare's own rung, and the hurricane beside the three-quarter step), so its word takes
  // 'roughly'; the others 'about'.
  // glow(J, refs) returns { J, none, unbounded, level, strength, word, rough, text, held, steps, floor, flicker, flare }:
  //   none: true when nothing is taken back (J 0, negative, NaN or missing): no tile, no glow; level and word null.
  //   unbounded: true for J = Infinity (an unlimited run): the flare, with no figure.
  //   level: 0 at the flicker, 1 at the flare, log scale; held at 1 above the flare (held: true); negative below the
  //     flicker (the floor's level is about -0.1).
  //   strength: the glow's strength, 0 at the floor or below, 1 at the flare (linear in the log of the energy between them).
  //   word: 'too faint to see' below the floor, 'faint flicker' from the floor up to the flicker, then the nearest named
  //     step: 'flicker', 'faint glow', 'glow', 'bright', 'blinding flare'. rough: that step's word takes 'roughly'.
  //   text: the word as a phrase: 'too faint to see', 'a faint flicker', then 'about a glow', 'roughly a blinding flare';
  //     unbounded, 'a blinding flare'.
  //   steps: the named steps [{ word, level, J, text: compare()'s wording of its energy, rough }]; floor, flicker,
  //     flare: { J, level, text, key, rough } for the three anchors.
  const GLOW_KEYS = { floor: 'energy_usain_bolt_top_speed', flicker: 'energy_corolla_100kmh_kinetic', flare: 'energy_chicxulub_impact' };
  const GLOW_STEPS = [['flicker', 0, 'a flicker'], ['faint glow', 0.25, 'a faint glow'], ['glow', 0.5, 'a glow'], ['bright', 0.75, 'bright'], ['blinding flare', 1, 'a blinding flare']];
  function glow(J, refs) {
    const rung = (k) => {
      const r = refs.find((x) => x.key === k);
      if (!r || !(r.J > 0)) throw new Error('EnergyLadder.glow: no ladder rung ' + k);
      return r;
    };
    const fo = rung(GLOW_KEYS.floor), fl = rung(GLOW_KEYS.flicker), fx = rung(GLOW_KEYS.flare);
    const L0 = Math.log10(fl.J), span = Math.log10(fx.J) - L0;
    const levelOf = (e) => (Math.log10(e) - L0) / span;
    const floorLevel = levelOf(fo.J);
    const roughAt = (e) => { const c = compare(e, refs); return !!(c.ref && c.ref.rough); };
    const anchor = (r) => ({ J: r.J, level: levelOf(r.J), text: compare(r.J, refs).text, key: r.key, rough: !!r.rough });
    const steps = GLOW_STEPS.map(([word, level, phrase]) => {
      const e = Math.pow(10, L0 + level * span), Je = level === 0 ? fl.J : level === 1 ? fx.J : e;
      return { word, level, J: Je, text: compare(Je, refs).text, rough: level === 1 ? !!fx.rough : roughAt(Je), phrase };
    });
    const out = { J, none: false, unbounded: false, level: null, strength: 0, word: null, rough: false, text: null, held: false,
      steps: steps.map(({ phrase, ...s }) => s), floor: anchor(fo), flicker: anchor(fl), flare: anchor(fx) };
    if (J === Infinity) return Object.assign(out, { unbounded: true, level: 1, strength: 1, word: 'blinding flare', text: 'a blinding flare', held: true });
    if (!(J > 0) || !isFinite(J)) return Object.assign(out, { none: true });
    const level = levelOf(J);
    const strength = Math.min(1, Math.max(0, (level - floorLevel) / (1 - floorLevel)));
    if (J < fo.J) return Object.assign(out, { level, strength: 0, word: 'too faint to see', text: 'too faint to see' });
    if (J < fl.J) return Object.assign(out, { level, strength, word: 'faint flicker', text: 'a faint flicker' });
    const lv = Math.min(1, level);
    let best = steps[0];
    for (const s of steps) if (Math.abs(lv - s.level) < Math.abs(lv - best.level)) best = s;
    return Object.assign(out, { level: lv, strength, word: best.word, rough: best.rough, text: (best.rough ? 'roughly ' : 'about ') + best.phrase, held: level > 1 });
  }

  return { compare, gaps, num, glow, GLOW_KEYS, MAX_GAP, SAME, SAME_ROUGH };
});
