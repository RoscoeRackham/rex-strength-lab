/*
 * Build Comparison model: a size-independent muscle score for every men's build.
 *
 * Plain JS. In node: const Compare = require('./model.js'). In a page: window.Compare.
 * Needs the Build Calculator model (calc.js, as BuildCalc) for the builds and their girths.
 *
 * The score: S = 1.8 x FFM / H^3, the FFMI the same body would have rescaled to 1.80 m at the
 * same shape (FFM fat-free mass in kg, H height to the top of the skull in m). At 1.80 m it equals
 * plain FFMI (FFM / H^2). Every score is a range across the build's plausible body fat, and across
 * its height and weight where sources disagree.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.Compare = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var REF_H = 1.8;
  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  /** S = 1.8 x FFM / H^3. */
  function score(ffmKg, H) { return REF_H * ffmKg / (H * H * H); }
  /** Plain FFMI = FFM / H^2. */
  function ffmi(ffmKg, H) { return ffmKg / (H * H); }
  /** Plain FFMI from S at height H: F = S x H / 1.8. */
  function plainFromScore(S, H) { return S * H / REF_H; }
  /** S of a solid ball as tall as the figure: 1.8 x density x pi / 6 x (1 - fat). */
  function ballScore(density, fatPct) { return REF_H * density * Math.PI / 6 * (1 - fatPct / 100); }
  /** US Army one-site body-fat equation (men, AD 2023-11): weight in lb, navel waist in inches. */
  function armyBodyFat(weightKg, waistM) { return -26.97 - 0.12 * (weightKg / 0.45359237) + 1.99 * (waistM / 0.0254); }
  /**
   * Taylor 2024's one-site equation for men, fitted to 1,261 soldiers' DXA (RMSE 3.35 points).
   * On a cohort of the same size it reads about 2.5 points above the official equation, which
   * reads low against DXA (research/round1/verify_fat.json).
   */
  function taylorBodyFat(weightKg, waistM) { return -27.05 - 0.12 * (weightKg / 0.45359237) + 2.06 * (waistM / 0.0254); }

  /**
   * Bind the model to its data.
   * BC: the Build Calculator model (BuildCalc.create(builds.json)); D: data/comparison.json.
   */
  function create(BC, D) {
    var settings = D.builds;
    var classes = D.fat_classes;

    /** Body fat for a build: { value, lo, hi, status, basis, cls }. */
    function bodyFat(b, s) {
      var own = b.body_fat_pct || {};
      if (s.fat && s.fat.kind === 'own' && isNum(own.value)) {
        var e = s.fat.error_points != null ? s.fat.error_points : 3;
        return { value: own.value, lo: Math.max(0, own.value - e), hi: own.value + e, status: own.status, basis: s.fat.basis, cls: null, own: true };
      }
      if (s.fat && s.fat.kind === 'army_equation') {
        // The mean of the two DXA-fitted Army equations; the range covers both, plus their error.
        var waist = b.girths.waist.value_m, w = b.weight_kg.value;
        var o = armyBodyFat(w, waist), t = taylorBodyFat(w, waist), e2 = s.fat.error_points;
        return { value: (o + t) / 2, lo: Math.min(o, t) - e2, hi: Math.max(o, t) + e2, status: 'estimate', basis: s.fat.basis, cls: null, equation: true, official: o, taylor: t };
      }
      if (s.fat && s.fat.kind === 'value') {
        return { value: s.fat.value, lo: s.fat.lo, hi: s.fat.hi, status: s.fat.status || 'estimate', basis: s.fat.basis, cls: null };
      }
      var c = classes[s.fat_class];
      if (!c) throw new Error('no fat class for ' + b.id);
      return { value: c.working_pct, lo: c.range_pct[0], hi: c.range_pct[1], status: 'estimate', basis: c.label, cls: s.fat_class };
    }

    /** Everything the chart needs for one build. */
    function evaluate(id) {
      var b = BC.byId[id], s = settings[id];
      if (!b || !s) throw new Error('unknown build ' + id);
      var H = s.score_height ? s.score_height.value_m : b.height_m.value;
      // Height and weight ranges widen the score range where sources disagree. Comic ranges are
      // different editions (each a height and weight pair), so they are not mixed: settings say 'none'.
      var useRanges = s.ranges !== 'none';
      var Hr = s.score_height && s.score_height.range_m ? s.score_height.range_m : (useRanges && b.height_m.range ? b.height_m.range : [H, H]);
      // Mass that counts: the girth-basis weight (Wolverine without adamantium), less excluded parts (tails).
      var W = BC.girthBasisW(b), Wr = useRanges && b.weight_kg.range ? b.weight_kg.range.slice() : [W, W];
      if (isNum(b.girth_basis_weight_kg)) Wr = [W, W];
      var excluded = (s.exclude_mass || []).reduce(function (t, e) { return t + e.mass_kg; }, 0);
      W -= excluded; Wr = [Wr[0] - excluded, Wr[1] - excluded];
      var bf = bodyFat(b, s);
      var ffmAt = function (w, f) { return w * (1 - f / 100); };
      var S = score(ffmAt(W, bf.value), H);
      // Range: lowest mass and fat-free share at the tallest height, and the reverse.
      var lo = score(ffmAt(Wr[0], bf.hi), Math.max(Hr[0], Hr[1]));
      var hi = score(ffmAt(Wr[1], bf.lo), Math.min(Hr[0], Hr[1]));
      var varies = ['body fat'];
      if (Wr[0] !== Wr[1]) varies.push('weight');
      if (Hr[0] !== Hr[1]) varies.push('height');
      var r = BC.compute({ buildId: id });
      return {
        id: id, build: b, setting: s, group: s.group || b.group, name: b.name, short: s.short || b.name,
        height: { value: H, range: Hr, status: s.score_height ? s.score_height.status : b.height_m.status, basis: s.score_height ? s.score_height.basis : null },
        mass: { value: W, range: Wr, status: b.weight_kg.status, excludedKg: excluded },
        bodyFat: bf,
        score: { value: S, lo: lo, hi: hi, status: 'estimate', varies: varies },
        plain: { value: ffmi(ffmAt(W, bf.value), H), lo: ffmi(ffmAt(Wr[0], bf.hi), Math.max(Hr[0], Hr[1])), hi: ffmi(ffmAt(Wr[1], bf.lo), Math.min(Hr[0], Hr[1])) },
        // 'yes'; 'overstated' (official text says the tissue is denser than ours or partly not
        // tissue, so the score is too high); 'no' (the body is not tissue: shown, not ranked).
        comparable: s.comparable || 'yes', comparableNote: s.comparable_note || null, comparableKeys: s.comparable_keys || [],
        girths: r.girths, calc: r
      };
    }

    /** Every build on the chart, sorted by score. */
    function all() {
      return Object.keys(settings).filter(function (id) { return !settings[id].hidden; }).map(evaluate)
        .sort(function (a, b) { return a.score.value - b.score.value; });
    }

    /**
     * Empty stretches of the scale: places where no comparable build's range reaches (builds whose
     * score is overstated or not comparable do not fill a stretch), wider than
     * ratio (default 1.25: the top of the stretch over its bottom), and from the top build to the
     * meatball. A stretch runs from the highest range top of every build below it to the lowest
     * range bottom of every build above it, so an overlapping range never sits inside a gap.
     */
    function gaps(list, top, ratio) {
      ratio = ratio || 1.25;
      var xs = list.filter(function (e) { return e.comparable === 'yes'; }).slice().sort(function (a, b) { return a.score.value - b.score.value; });
      var out = [];
      for (var i = 1; i < xs.length; i++) {
        var below = xs.slice(0, i).reduce(function (m, e) { return e.score.hi > m.score.hi ? e : m; });
        var above = xs.slice(i).reduce(function (m, e) { return e.score.lo < m.score.lo ? e : m; });
        if (above.score.lo / below.score.hi > ratio && !out.some(function (g) { return g.below === below.id && g.above === above.id; })) {
          out.push({ from: below.score.hi, to: above.score.lo, below: below.id, above: above.id });
        }
      }
      var last = xs.reduce(function (m, e) { return e.score.hi > m.score.hi ? e : m; });
      if (top && top / last.score.hi > ratio) out.push({ from: last.score.hi, to: top, below: last.id, above: null });
      return out;
    }

    return { evaluate: evaluate, all: all, gaps: gaps, bodyFat: bodyFat, settings: settings, classes: classes };
  }

  return { REF_H: REF_H, score: score, ffmi: ffmi, plainFromScore: plainFromScore, ballScore: ballScore, armyBodyFat: armyBodyFat, taylorBodyFat: taylorBodyFat, create: create, isNum: isNum };
});
