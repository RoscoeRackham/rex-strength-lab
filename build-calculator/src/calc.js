/*
 * Build calculator model.
 *
 * Plain JS. In node: const BuildCalc = require('./calc.js'). In a page: window.BuildCalc.
 * Every function that needs the compiled data takes it through BuildCalc.create(data),
 * where data is data/builds.json. All internal units are SI: metres, kilograms.
 *
 * Every number the model returns carries a status from the data's vocabulary:
 *   measured | official | reported | derived | estimate | unknown
 * plus 'input' for a number the user typed. A value the model cannot support is null
 * with status 'unknown'. Nothing is invented to fill a gap.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.BuildCalc = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SITES = ['chest', 'waist', 'arm_flexed', 'forearm', 'thigh', 'calf', 'neck'];
  var IN = 0.0254;           // metres per inch (exact)
  var LB = 0.45359237;       // kilograms per pound (exact)

  // Highest BMI of anyone with measured girths in these data (ANSUR II men, max 43.45; fact
  // ansur2_bmi). Above it, girths are beyond human data (see NOTES.md, "Flags").
  var BMI_MAX_MEASURED_GIRTHS = 43.45;

  // Heights more than 10% outside the ANSUR II stature range (1.409-1.993 m, fact ansur2_stature)
  // are also beyond human data: the scaling law is checked to about 1% only for height changes of
  // about 10% or less (fact ansur_geometric_law_test).
  var HEIGHT_MARGIN = 1.1;

  // Default body fat when a build has none: the brief's 15%. Always labelled an estimate.
  var DEFAULT_BODY_FAT = 15;

  // Kouri height normalisation. The abstract prints 6.3; Trexler 2017, McDonald and most
  // calculators use 6.1. The gap is at most 0.05 FFMI units for 1.55-2.05 m
  // (facts kouri1995_normalization_constant, ffmi_height_correction). We use 6.1, and only
  // inside 1.55-2.05 m, for men (Kouri's sample was men).
  var KOURI_C = 6.1;
  var FFMI_NORM_RANGE = [1.55, 2.05];
  // Trexler 2017 height-adjusted its football players to 1.80 m with its own slope (fact ffmi_height_correction).
  var TREXLER_SLOPE = 2.943;

  /** A value calculated from inputs is at best 'derived'; an 'estimate' input keeps it an estimate. */
  function weakest() {
    for (var i = 0; i < arguments.length; i++) if (arguments[i] === 'estimate') return 'estimate';
    return 'derived';
  }

  // Fact keys used for each site in the different ANSUR fits.
  var PRED_KEY = { chest: 'chest', waist: 'waist_omphalion', arm_flexed: 'biceps_flexed', forearm: 'forearm_flexed', thigh: 'thigh_upper', calf: 'calf', neck: 'neck' };
  var ALLO_KEY = { chest: 'chest', waist: 'waist', arm_flexed: 'upper_arm_flexed', forearm: 'forearm_flexed', thigh: 'thigh', calf: 'calf', neck: 'neck' };
  var RANGE_FACT = { chest: 'ansur2_chest', waist: 'ansur2_waist_omphalion', arm_flexed: 'ansur2_biceps_flexed', forearm: 'ansur2_forearm_flexed', thigh: 'ansur2_thigh', calf: 'ansur2_calf', neck: 'ansur2_neck' };

  /*
   * Frustum volume model, calculator inputs only (stature + the 7 girths).
   *
   * Construction: physics/scripts/segment_volume_lib.py (circular cross-sections, stacked
   * frustums, ellipsoid head, box hands and feet). The verifier's recheck4.py ran it with
   * calculator inputs only: every other length set to its ANSUR II mean ratio to stature,
   * buttock girth from a log-linear fit on waist, thigh and stature, and lower thigh,
   * ankle, wrist and neck-base girths from their mean ratio to the nearest calculator girth.
   * Result (fact ansur_frustum_volume_model, calc_inputs_only): k = W/V of 1052.5 kg/m^3
   * (men) and 1052.8 (women); mass error SD 2.31% (men, P95 4.6%) and 2.78% (women, P95 5.5%).
   * k is a calibration constant, not a tissue density: it absorbs lung air, the circular
   * cross-section bias and omitted shoulder mass.
   *
   * The ratios below come from tools/derive_frustum.js run on the ANSUR II public CSVs
   * (4,082 men, 1,986 women). test/test.js re-derives k and the SD from the CSVs when present.
   */
  var FRUSTUM = {
    M: {
      L: { suprasternaleheight: 0.819056, chestheight: 0.735092, waistheightomphalion: 0.601433, buttockheight: 0.505412, crotchheight: 0.481526, kneeheightmidpatella: 0.277994, tibialheight: 0.266497, lateralmalleolusheight: 0.041516, headlength: 0.113714, headbreadth: 0.088001, shoulderelbowlength: 0.207084, radialestylionlength: 0.152522, handlength: 0.110072, handbreadth: 0.050288, handcircumference: 0.120954, footlength: 0.154436, footbreadthhorizontal: 0.058035 },
      lowerthigh_over_thigh: 0.656247, ankle_over_calf: 0.585715, wrist_over_forearm: 0.568736, neckbase_over_neck: 1.093587,
      // ln(buttock) = c0 + c1 ln(waist) + c2 ln(thigh) + c3 ln(stature), all in metres
      buttock: [0.160255, 0.195622, 0.526635, 0.212166]
    },
    F: {
      L: { suprasternaleheight: 0.816435, chestheight: 0.719358, waistheightomphalion: 0.601717, buttockheight: 0.511842, crotchheight: 0.480228, kneeheightmidpatella: 0.275646, tibialheight: 0.268722, lateralmalleolusheight: 0.038538, headlength: 0.116679, headbreadth: 0.090862, shoulderelbowlength: 0.205259, radialestylionlength: 0.148171, handlength: 0.111214, handbreadth: 0.048023, handcircumference: 0.114633, footlength: 0.151259, footbreadthhorizontal: 0.056973 },
      lowerthigh_over_thigh: 0.651345, ankle_over_calf: 0.579008, wrist_over_forearm: 0.587481, neckbase_over_neck: 1.126185,
      buttock: [0.250396, 0.139062, 0.60944, 0.17922]
    }
  };

  function circArea(c) { return c * c / (4 * Math.PI); }
  function frustum(a1, a2, h) { return h * (a1 + a2 + Math.sqrt(a1 * a2)) / 3; }

  /**
   * Body volume (m^3) from stature and the 7 girths (m), by the calculator-inputs frustum model.
   * Mirrors segment_volume_lib.model(d, 'circle') with recheck4.py's imputations.
   */
  function frustumVolume(sex, H, g) {
    var c = FRUSTUM[sex === 'F' ? 'F' : 'M'];
    var L = {};
    Object.keys(c.L).forEach(function (k) { L[k] = c.L[k] * H; });
    var b = c.buttock;
    var buttock = Math.exp(b[0] + b[1] * Math.log(g.waist) + b[2] * Math.log(g.thigh) + b[3] * Math.log(H));
    var lthigh = g.thigh * c.lowerthigh_over_thigh;
    var ankle = g.calf * c.ankle_over_calf;
    var wrist = g.forearm * c.wrist_over_forearm;
    var neckBase = g.neck * c.neckbase_over_neck;

    var st = H, ss = L.suprasternaleheight, ch = L.chestheight, wo = L.waistheightomphalion,
      bh = L.buttockheight, cr = L.crotchheight, kn = L.kneeheightmidpatella, ti = L.tibialheight,
      lm = L.lateralmalleolusheight;
    var A_b = circArea(buttock), A_w = circArea(g.waist), A_c = circArea(g.chest);
    var A_cr = 2 * circArea(g.thigh), A_nb = circArea(neckBase);
    var vTrunk = frustum(A_cr, A_b, Math.max(bh - cr, 0.005)) + frustum(A_b, A_w, wo - bh) +
      frustum(A_w, A_c, ch - wo) + frustum(A_c, A_nb, ss - ch);
    var headH = 0.13 * st;
    var vHead = Math.PI / 6 * L.headlength * L.headbreadth * headH;
    var vNeck = circArea(g.neck) * Math.max(st - ss - headH, 0.02);
    var vUarm = frustum(circArea(g.arm_flexed), circArea(g.forearm), L.shoulderelbowlength);
    var vFarm = frustum(circArea(g.forearm), circArea(wrist), L.radialestylionlength);
    var P = L.handcircumference, w = L.handbreadth;
    var t = Math.max((P - 2 * w) / (Math.PI - 2), 0.01);
    var vHand = ((w - t) * t + Math.PI * t * t / 4) * L.handlength * 0.6;
    var ltLvl = kn + 0.05, calfLvl = lm + 0.65 * (ti - lm), ankLvl = lm + 0.04;
    var vThigh = frustum(circArea(g.thigh), circArea(lthigh), cr - ltLvl);
    var vKnee = frustum(circArea(lthigh), circArea(g.calf), ltLvl - calfLvl);
    var vShank = frustum(circArea(g.calf), circArea(ankle), calfLvl - ankLvl);
    var vFoot = L.footlength * L.footbreadthhorizontal * ankLvl * 0.4;
    return vTrunk + vHead + vNeck + 2 * (vUarm + vFarm + vHand + vThigh + vKnee + vShank + vFoot);
  }

  /** Siri two-compartment tissue density (kg/m^3) at a body fat %: fat 900, fat-free 1100. */
  function siriDensity(fatPct) {
    var f = fatPct / 100;
    return 1000 / (f / 0.900 + (1 - f) / 1.100);
  }

  function isNum(x) { return typeof x === 'number' && isFinite(x); }
  function round(x, dp) { var p = Math.pow(10, dp || 0); return Math.round(x * p) / p; }

  // ---------- formatting (shared by the page and the tests) ----------
  // One rule for every number on the page: thousands separators, and decimals that depend on
  // magnitude. Display strings use separators; the *Field functions give plain numbers for inputs.
  function trimZero(s) { return s.replace(/\.0$/, ''); }
  /** Fixed decimals with thousands separators: sep(22898.1, 0) = '22,898'. */
  function sep(x, dp) {
    var s = Math.abs(x).toFixed(dp), parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (x < 0 && Number(s) !== 0 ? '-' : '') + parts.join('.');
  }
  /** Decimals for a mass in display units: kg 1 dp (0 from 1,000), lb whole (1 dp below 10); 2 dp below 1. */
  function massDp(v, units) {
    var a = Math.abs(v);
    if (a < 1) return 2;
    if (units === 'metric') return a >= 1000 ? 0 : 1;
    return a >= 10 ? 0 : 1;
  }
  function massUnits(kg, units) { return units === 'metric' ? kg : kg / LB; }
  function lenUnits(m, units) { return units === 'metric' ? m * 100 : m / IN; }
  var fmt = {
    sep: sep,
    /** Length (girth) in the chosen units, one decimal. */
    len: function (m, units, dp) {
      if (!isNum(m)) return 'unknown';
      return fmt.lenNum(m, units, dp) + (units === 'metric' ? ' cm' : ' in');
    },
    lenNum: function (m, units, dp) {
      if (!isNum(m)) return '';
      return sep(lenUnits(m, units), dp == null ? 1 : dp);
    },
    /** Plain number for an input field (no separators). */
    lenField: function (m, units, dp) {
      if (!isNum(m)) return '';
      return lenUnits(m, units).toFixed(dp == null ? 1 : dp);
    },
    /** 'a-b cm', or one value when both ends print the same. */
    lenRange: function (r, units) {
      if (!r) return '';
      var a = fmt.lenNum(r[0], units), b = fmt.lenNum(r[1], units);
      return (a === b ? a : a + '-' + b) + (units === 'metric' ? ' cm' : ' in');
    },
    height: function (m, units) {
      if (!isNum(m)) return 'unknown';
      if (units === 'metric') return trimZero(sep(m * 100, 1)) + ' cm';
      var p = fmt.heightParts(m);
      return p.ft + ' ft ' + trimZero(p.inch.toFixed(1)) + ' in';
    },
    /** Height split for the ft/in inputs. */
    heightParts: function (m) {
      var inches = round(m / IN, 1);
      var ft = Math.floor(inches / 12 + 1e-9);
      return { ft: ft, inch: round(inches - ft * 12, 1) };
    },
    mass: function (kg, units) {
      if (!isNum(kg)) return 'unknown';
      return fmt.massNum(kg, units) + (units === 'metric' ? ' kg' : ' lb');
    },
    massNum: function (kg, units) {
      if (!isNum(kg)) return '';
      var v = massUnits(kg, units);
      return sep(v, massDp(v, units));
    },
    /** Plain number for an input field (no separators). */
    massField: function (kg, units) {
      if (!isNum(kg)) return '';
      var v = massUnits(kg, units);
      return v.toFixed(massDp(v, units));
    },
    /** 'a-b lb', or one value when both ends print the same. */
    massRange: function (r, units) {
      if (!r) return '';
      var a = fmt.massNum(r[0], units), b = fmt.massNum(r[1], units);
      return (a === b ? a : a + '-' + b) + (units === 'metric' ? ' kg' : ' lb');
    },
    num: function (x, dp) { return isNum(x) ? sep(x, dp == null ? 1 : dp) : 'unknown'; },
    pct: function (x, dp) { return isNum(x) ? sep(x, dp == null ? 1 : dp) + '%' : 'unknown'; },
    /** BMI: one decimal, two when it is within 0.1 of the 43.45 limit so the comparison reads right. */
    bmi: function (x) { return isNum(x) ? sep(x, Math.abs(x - BMI_MAX_MEASURED_GIRTHS) < 0.1 ? 2 : 1) : 'unknown'; }
  };

  // ---------- the model bound to a data set ----------
  function create(data) {
    var F = data.facts;
    var byId = {};
    data.builds.forEach(function (b) { byId[b.id] = b; });

    // Limits read from the data, so the page and the facts give one value each.
    var bmiMax = F.ansur2_bmi.values.male_max_kg_per_m2;            // 43.45
    var stv = F.ansur2_stature.values;
    var heightRange = { dataMin: Math.min(stv.male_min_m, stv.female_min_m), dataMax: Math.max(stv.male_max_m, stv.female_max_m) };
    heightRange.min = heightRange.dataMin / HEIGHT_MARGIN;           // 1.28 m
    heightRange.max = heightRange.dataMax * HEIGHT_MARGIN;           // 2.19 m

    function sexOf(b) { return b && b.sex === 'F' ? 'F' : 'M'; }
    function isHuman(b) { return b.group !== 'Rex and Ollie'; }
    function refH(b) { return b.height_m.value; }
    function refW(b) { return b.weight_kg.value; }
    /** Weight that carries girth (Wolverine: body without the adamantium). */
    function girthBasisW(b) { return isNum(b.girth_basis_weight_kg) ? b.girth_basis_weight_kg : refW(b); }

    /** ANSUR II average-shape girth predictor: G_cm = A W^p H^q (fact ansur2_girth_predictor_*). */
    function predictGirth(sex, site, W, H) {
      var v = F['ansur2_girth_predictor_' + (sex === 'F' ? 'female' : 'male')].values;
      var k = PRED_KEY[site];
      return v[k + '_A'] * Math.pow(W, v[k + '_p_weight']) * Math.pow(H, v[k + '_q_height']) / 100;
    }

    /** ANSUR II allometry exponents [b_W, c_H] for one site (fact ansur_girth_allometry). */
    function allometry(sex, site) {
      var a = F.ansur_girth_allometry.values[sex === 'F' ? 'women' : 'men'][ALLO_KEY[site]];
      return { b: a[0], c: a[1], r2: a[2], sd: a[3] };
    }

    var refCache = {};
    /**
     * A build's girth at its own reference height and weight.
     * Own value: kept with its own status. Missing value: taken from the template build
     * (recursively), rescaled to this build by the template method:
     *   geometric:        G = G_t * sqrt((W/H) / (W_t/H_t))   (fixed cross-section shape)
     *   isometric:        G = G_t * (H / H_t)                 (pure size scaling)
     *   ansur_predictor:  G = A W^p H^q                       (ANSUR II average shape)
     * Filled girths are labelled derived, with the template chain.
     */
    function refGirth(id, site, depth) {
      var key = id + '|' + site;
      if (refCache[key]) return refCache[key];
      depth = depth || 0;
      var b = byId[id];
      var g = b.girths[site] || { value_m: null, status: 'unknown' };
      var out;
      if (isNum(g.value_m)) {
        out = { value: g.value_m, range: g.range_m || null, status: g.status, kind: 'own', chain: [], method: null, entry: g, owner: id };
      } else if (b.template && depth < 6) {
        var t = b.template;
        var H0 = refH(b), Wg = girthBasisW(b);
        if (t.method === 'ansur_predictor') {
          var sx = sexOf(b);
          out = { value: predictGirth(sx, site, Wg, H0), range: null, status: weakest(b.weight_kg.status, b.height_m.status), kind: 'template', chain: ['ansur_predictor'], method: t.method, entry: null, owner: null,
            predictorFact: 'ansur2_girth_predictor_' + (sx === 'F' ? 'female' : 'male') };
        } else {
          var T = byId[t.build_id];
          var tg = refGirth(T.id, site, depth + 1);
          if (!isNum(tg.value)) {
            out = { value: null, range: null, status: 'unknown', kind: 'none', chain: [], method: null, entry: null, owner: null };
          } else {
            var f = t.method === 'isometric' ? H0 / refH(T) : Math.sqrt((Wg / H0) / (girthBasisW(T) / refH(T)));
            // Carry the weakest input: an estimated template girth, height or weight keeps the result an estimate.
            var st = t.method === 'isometric'
              ? weakest(tg.status, b.height_m.status, T.height_m.status)
              : weakest(tg.status, b.height_m.status, T.height_m.status, b.weight_kg.status, T.weight_kg.status);
            out = {
              value: tg.value * f,
              range: tg.range ? [tg.range[0] * f, tg.range[1] * f] : null,
              status: st, kind: 'template', chain: [T.id].concat(tg.chain), method: t.method,
              entry: tg.entry, owner: tg.owner, ownerStatus: tg.kind === 'own' ? tg.status : tg.ownerStatus,
              predictorFact: tg.predictorFact
            };
          }
        }
      } else {
        out = { value: null, range: null, status: 'unknown', kind: 'none', chain: [], method: null, entry: null, owner: null };
      }
      refCache[key] = out;
      return out;
    }

    /**
     * The main calculation.
     * opts: { buildId, heightM (null = reference), weightKg (null = scale with height),
     *         bodyFatPct (null = build value or 15%), mode: 'geometric' | 'ansur',
     *         showBeyond (default true): show model girths beyond human data, else 'unknown' }
     *
     * Same-shape scaling (default): W = W0 (H/H0)^3 and G = G0 (H/H0).
     * With a weight set: G = G0 sqrt((W/H) / (W0/H0)), the geometric law (fixed cross-section
     * shape). In ANSUR II men the chest follows this law (free exponent 1.02 on sqrt(W/H));
     * waist grows faster (1.44) and forearm (0.76), calf (0.84) and neck (0.70) slower
     * (fact ansur2_girth_scaling_male).
     * 'ansur' mode ("average soldier"): G = G0 (W/W0)^b (H/H0)^c with ANSUR II per-girth
     * exponents (fact ansur_girth_allometry). They describe how soldiers differ, and ANSUR II
     * has no body-composition data (by Forbes's relation, roughly 60-70% of between-person
     * weight difference is fat; estimate). So results in this mode are labelled estimates.
     */
    function compute(opts) {
      var b = byId[opts.buildId];
      if (!b) throw new Error('Unknown build: ' + opts.buildId);
      var sex = sexOf(b);
      var mode = opts.mode === 'ansur' ? 'ansur' : 'geometric';
      var showBeyond = opts.showBeyond !== false;
      var H0 = refH(b), W0 = refW(b), Wg0 = girthBasisW(b);
      var H = isNum(opts.heightM) && opts.heightM > 0 ? opts.heightM : H0;
      var s = H / H0;
      var atRefH = Math.abs(s - 1) < 1e-9;
      var override = isNum(opts.weightKg) && opts.weightKg > 0;
      var notes = [];

      // Height
      var height = { value: H, status: atRefH ? b.height_m.status : 'input', ref: H0, refStatus: b.height_m.status, atRef: atRefH,
        range: atRefH && b.height_m.range ? b.height_m.range.slice() : null };

      // Weight
      var W, Wg, weight;
      if (override) {
        W = opts.weightKg;
        Wg = W * (Wg0 / W0);
        weight = { value: W, status: 'input', basis: 'input', range: null };
      } else {
        W = W0 * s * s * s;
        Wg = Wg0 * s * s * s;
        var wr = b.weight_kg.range ? [b.weight_kg.range[0] * s * s * s, b.weight_kg.range[1] * s * s * s] : null;
        // Scaling an estimate by height cubed does not make it more certain.
        weight = { value: W, status: atRefH ? b.weight_kg.status : weakest(b.weight_kg.status), basis: atRefH ? 'reference' : 'scaled', range: wr,
          sameBmi: atRefH ? null : W0 * s * s };
      }
      weight.ref = W0; weight.refStatus = b.weight_kg.status; weight.disputed = !!b.weight_kg.disputed;

      var bmi = W / (H * H);
      var bmiGirth = Wg / (H * H);
      var beyondBmi = isHuman(b) && bmiGirth > bmiMax;
      var beyondHeight = !isHuman(b) ? null : H < heightRange.min ? 'low' : H > heightRange.max ? 'high' : null;
      var beyond = beyondBmi || !!beyondHeight;

      // Girths
      var girths = {};
      var fGeo = Math.sqrt((Wg / H) / (Wg0 / H0));
      SITES.forEach(function (site) {
        var r = refGirth(b.id, site);
        var gOut = { site: site, refValue: r.value, refStatus: r.status, kind: r.kind, chain: r.chain, method: r.method,
          entry: r.entry, owner: r.owner, ownerStatus: r.ownerStatus || null, predictorFact: r.predictorFact || null,
          beyond: false, hidden: false };
        if (!isNum(r.value)) {
          gOut.value = null; gOut.range = null; gOut.status = 'unknown'; gOut.scaled = false;
          girths[site] = gOut; return;
        }
        var f;
        if (mode === 'ansur') {
          var a = allometry(sex, site);
          f = Math.pow(Wg / Wg0, a.b) * Math.pow(H / H0, a.c);
        } else {
          f = fGeo;
        }
        var scaled = Math.abs(f - 1) > 1e-9;
        gOut.scaled = scaled;
        gOut.factor = f;
        gOut.value = r.value * f;
        gOut.range = r.range ? [r.range[0] * f, r.range[1] * f] : null;
        if (r.kind === 'own' && !scaled) gOut.status = r.status;
        else if (mode === 'ansur' && scaled) gOut.status = 'estimate';
        // A typed weight is scaled against the build's own weight, so that weight's status counts too.
        else gOut.status = weakest(r.status, override && scaled ? b.weight_kg.status : null);
        if (beyond && (r.kind === 'template' || scaled)) {
          gOut.beyond = true;
          gOut.status = 'estimate';
          if (!showBeyond) { gOut.hidden = true; gOut.value = null; gOut.range = null; gOut.status = 'unknown'; }
        }
        girths[site] = gOut;
      });

      // Body fat, FFMI
      var bfData = b.body_fat_pct || {};
      var bf, bfStatus;
      if (isNum(opts.bodyFatPct)) { bf = opts.bodyFatPct; bfStatus = 'input'; }
      else if (isNum(bfData.value)) { bf = bfData.value; bfStatus = bfData.status; }
      else { bf = DEFAULT_BODY_FAT; bfStatus = 'estimate'; }
      // FFMI uses the weight that carries tissue girth (Wolverine: adamantium excluded).
      // ffmi is the plain value at this height. The Kouri height normalisation is used only where it
      // was made and checked: men, 1.55-2.05 m. Elsewhere the normalised value is unknown (null).
      var ffmWeight = Wg;
      var ffm = ffmWeight * (1 - bf / 100);
      var ffmi = ffm / (H * H);
      var inNormRange = H >= FFMI_NORM_RANGE[0] && H <= FFMI_NORM_RANGE[1];
      var normReason = !isHuman(b) ? 'nonhuman' : sex === 'F' ? 'women' : !inNormRange ? 'height' : null;
      var ffmiNorm = normReason ? null : ffmi + KOURI_C * (1.8 - H);
      var ffmiStatus = weakest(bfStatus, weight.status, height.status);

      var kouri = F.kouri1995_ffmi_natural_limit.values;
      var kMax = kouri.nonuser_normalized_FFMI_upper_limit_kg_m2;
      var ffmiRef;
      if (normReason === 'nonhuman') ffmiRef = { applies: false, reason: 'No human reference applies to this build.' };
      else if (normReason === 'women') ffmiRef = { applies: false, reason: "Kouri's sample is men only. It is not a valid reference for women." };
      else if (normReason === 'height') ffmiRef = { applies: false, reason: "Kouri's height adjustment is checked only between 1.55 and 2.05 m, so this height has no normalised FFMI and no Kouri comparison." };
      else {
        // Body fat at which normalised FFMI equals 25.0: Wg (1 - bf) / H^2 + c (1.8 - H) = 25.
        var breakEven = 100 * (1 - (kMax - KOURI_C * (1.8 - H)) * H * H / Wg);
        // With an assumed body fat there is no verdict: only the break-even body fat.
        var verdict = bfStatus === 'estimate' ? 'unknown' : ffmiNorm > kMax ? 'above' : 'below';
        ffmiRef = { applies: true, kouriMax: kMax, verdict: verdict, above: verdict === 'unknown' ? null : verdict === 'above', breakEvenBf: breakEven };
      }
      // Reference lines for the FFMI scale, converted to this build's height so they share the
      // plotted basis (plain FFMI at this height). Height-adjusted references are given only where
      // the adjustment applies; unadjusted ones are drawn as printed.
      var refLines = [];
      if (isHuman(b)) {
        var pn = F.ffmi_population_norms.values, ath = F.ffmi_athletes.values;
        if (sex === 'F') {
          refLines.push({ id: 'schutz_f', v: pn.median_women_18_34_kg_m2, basis: 'unadjusted' });
          refLines.push({ id: 'blue_max', v: ath.blue2019_women.range[1], basis: 'unadjusted' });
        } else {
          refLines.push({ id: 'schutz_m', v: pn.median_men_18_34_kg_m2, basis: 'unadjusted' });
          if (inNormRange) {
            refLines.push({ id: 'kouri', v: kMax - KOURI_C * (1.8 - H), printed: kMax, basis: 'kouri' });
            refLines.push({ id: 'trexler_p975', v: ath.trexler2017_football.p97_5 - TREXLER_SLOPE * (1.8 - H), printed: ath.trexler2017_football.p97_5, basis: 'trexler' });
            refLines.push({ id: 'trexler_max', v: ath.trexler2017_football.max - TREXLER_SLOPE * (1.8 - H), printed: ath.trexler2017_football.max, basis: 'trexler' });
          }
        }
      }

      // The page states the girth-basis weight in its own units (build.girth_basis_weight_kg).

      return {
        build: b, sex: sex, human: isHuman(b), mode: mode,
        height: height, weight: weight,
        bmi: { value: bmi, status: weakest(weight.status, height.status) },
        bmiGirth: bmiGirth, bmiMax: bmiMax, beyond: beyond, beyondBmi: beyondBmi, beyondHeight: beyondHeight, heightRange: heightRange,
        bodyFat: { value: bf, status: bfStatus, method: bfData.method || null, dataValue: isNum(bfData.value) ? bfData.value : null },
        ffmi: { value: ffmi, norm: ffmiNorm, normReason: normReason, normRange: FFMI_NORM_RANGE, status: ffmiStatus, ffmKg: ffm, basisWeight: ffmWeight,
          ref: ffmiRef, refLines: refLines, c: KOURI_C },
        girths: girths,
        notes: notes
      };
    }

    // ---------- reverse mode ----------
    function ansurRange(sex) {
      var p = sex === 'F' ? 'female_' : 'male_';
      var out = { girths: {} };
      SITES.forEach(function (site) {
        var v = F[RANGE_FACT[site]].values;
        out.girths[site] = { min: v[p + 'min_m'], max: v[p + 'max_m'], p50: v[p + 'p50_m'] };
      });
      var st = F.ansur2_stature.values, wt = F.ansur2_weight.values, bm = F.ansur2_bmi.values;
      out.stature = { min: st[p + 'min_m'], max: st[p + 'max_m'], p50: st[p + 'p50_m'] };
      out.weight = { min: wt[p + 'min_kg'], max: wt[p + 'max_kg'], p50: wt[p + 'p50_kg'] };
      out.bmi = { min: bm[p + 'min_kg_per_m2'], max: bm[p + 'max_kg_per_m2'] };
      return out;
    }

    /**
     * ANSUR II log-linear weight regression (fact ansur2_weight_regression_male/female):
     * W = smear * exp(a + b_H ln H_cm + sum b_i ln G_i_cm). Men: RMSE 1.634 kg (1.91%).
     * Women: RMSE 1.502 kg (2.19%). Valid only inside the ANSUR II range.
     */
    function regressionWeight(sex, H, g) {
      var v = F['ansur2_weight_regression_' + (sex === 'F' ? 'female' : 'male')].values;
      var lnW = v.loglog_ln_intercept + v.loglog_ln_stature_cm * Math.log(H * 100);
      for (var i = 0; i < SITES.length; i++) {
        var site = SITES[i];
        if (!isNum(g[site]) || g[site] <= 0) return null;
        lnW += v['loglog_ln_' + PRED_KEY[site] + '_cm'] * Math.log(g[site] * 100);
      }
      return v.loglog_smearing_factor * Math.exp(lnW);
    }

    /**
     * Reverse mode: weight from height and the 7 girths, two ways.
     * opts: { sex: 'M'|'F', heightM, girths: {site: m}, bodyFatPct (nullable), refFatPct (nullable) }
     *  A. ANSUR II log-linear regression.
     *  B. Frustum volume x k_eff, scaled by Siri density at the given body fat relative to an
     *     assumed reference fat for the ANSUR sample. ANSUR II has no body-fat data, so the
     *     reference is an assumption (research design note: about 20% for men). With no
     *     body fat or no reference, no density adjustment is made.
     */
    function reverse(opts) {
      var sex = opts.sex === 'F' ? 'F' : 'M';
      var H = opts.heightM, g = opts.girths || {};
      var missing = SITES.filter(function (s) { return !isNum(g[s]) || g[s] <= 0; });
      var res = { sex: sex, missing: missing, warnings: [], regression: null, frustum: null, agreement: null };
      if (!isNum(H) || H <= 0) { res.missing = ['height'].concat(missing); return res; }
      if (missing.length) return res;

      var rv = F['ansur2_weight_regression_' + (sex === 'F' ? 'female' : 'male')].values;
      var wReg = regressionWeight(sex, H, g);
      res.regression = { value: wReg, status: 'estimate', rmseKg: rv.loglog_rmse_kg, rmsePct: rv.loglog_rmse_pct,
        resid90: [rv.loglog_resid_p5_kg, rv.loglog_resid_p95_kg], r2: rv.loglog_r2,
        fact: 'ansur2_weight_regression_' + (sex === 'F' ? 'female' : 'male') };

      var fv = F.ansur_frustum_volume_model.values.calc_inputs_only;
      var k = sex === 'F' ? fv.k_eff_women_kg_m3 : fv.k_eff_men_kg_m3;
      var sd = sex === 'F' ? fv.mass_err_sd_women_pct : fv.mass_err_sd_men_pct;
      var p95 = sex === 'F' ? fv.p95_abs_women_pct : fv.p95_abs_men_pct;
      var V = frustumVolume(sex, H, g);
      var bf = isNum(opts.bodyFatPct) ? opts.bodyFatPct : null;
      var ref = isNum(opts.refFatPct) ? opts.refFatPct : null;
      var dFactor = 1, dNote;
      if (bf != null && ref != null) {
        dFactor = siriDensity(bf) / siriDensity(ref);
        dNote = 'Siri density at ' + bf + '% fat (' + round(siriDensity(bf), 1) + ' kg/m3) over the assumed ANSUR reference at ' + ref + '% (' + round(siriDensity(ref), 1) + ' kg/m3).';
      } else if (bf != null) {
        dNote = 'No reference body fat is set, so no density adjustment was made.';
      } else {
        dNote = 'No body fat given. The figure assumes ANSUR-average composition.';
      }
      res.frustum = { value: k * V * dFactor, unadjusted: k * V, volumeM3: V, k: k, densityFactor: dFactor, densityNote: dNote,
        sdPct: sd, p95Pct: p95, status: 'estimate', fact: 'ansur_frustum_volume_model' };

      var diff = res.frustum.value - wReg;
      var mean = (res.frustum.value + wReg) / 2;
      var pct = 100 * diff / mean;
      var combined = Math.sqrt(rv.loglog_rmse_pct * rv.loglog_rmse_pct + sd * sd);
      res.agreement = { diffKg: diff, diffPct: pct, combinedSdPct: combined,
        verdict: Math.abs(pct) <= combined ? 'within1' : Math.abs(pct) <= 2 * combined ? 'within2' : 'outside' };

      // Range warnings against the ANSUR II sample of the same sex.
      var R = ansurRange(sex);
      var who = sex === 'F' ? 'women' : 'men';
      SITES.forEach(function (site) {
        var r = R.girths[site];
        if (g[site] > r.max) res.warnings.push({ site: site, kind: 'above', value: g[site], limit: r.max, who: who });
        else if (g[site] < r.min) res.warnings.push({ site: site, kind: 'below', value: g[site], limit: r.min, who: who });
      });
      if (H > R.stature.max) res.warnings.push({ site: 'height', kind: 'above', value: H, limit: R.stature.max, who: who });
      else if (H < R.stature.min) res.warnings.push({ site: 'height', kind: 'below', value: H, limit: R.stature.min, who: who });
      var bmiReg = wReg / (H * H);
      if (bmiReg > R.bmi.max) res.warnings.push({ site: 'bmi', kind: 'above', value: bmiReg, limit: R.bmi.max, who: who });
      if (wReg > R.weight.max) res.warnings.push({ site: 'weight', kind: 'above', value: wReg, limit: R.weight.max, who: who });
      res.outside = res.warnings.length > 0;
      return res;
    }

    /** Groups in data order, each with its builds. */
    function groups() {
      return data.groups.map(function (name) {
        return { name: name, builds: data.builds.filter(function (b) { return b.group === name; }) };
      });
    }

    function templateName(id) {
      if (id === 'ansur_predictor') return 'the ANSUR II average-shape formula';
      return byId[id] ? byId[id].name : id;
    }

    /** Facts the current result rests on, in display order, without duplicates. */
    function factKeysFor(result, extra) {
      var keys = [];
      function add(k) { if (k && F[k] && keys.indexOf(k) < 0) keys.push(k); }
      var b = result.build;
      (b.height_m.source_keys || []).forEach(add);
      (b.weight_kg.source_keys || []).forEach(add);
      ((b.body_fat_pct || {}).source_keys || []).forEach(add);
      SITES.forEach(function (site) {
        var g = result.girths[site];
        if (g.entry && g.entry.source_keys) g.entry.source_keys.forEach(add);
        if (g.predictorFact) add(g.predictorFact);
      });
      if (b.template) add('build_templates_rule');
      (extra || []).forEach(add);
      return keys;
    }

    return {
      data: data, byId: byId, sites: SITES, bmiMax: bmiMax, heightRange: heightRange,
      compute: compute, reverse: reverse, refGirth: refGirth, predictGirth: predictGirth, allometry: allometry,
      regressionWeight: regressionWeight, ansurRange: ansurRange, groups: groups, templateName: templateName,
      factKeysFor: factKeysFor, girthBasisW: girthBasisW
    };
  }

  return {
    SITES: SITES, IN: IN, LB: LB, BMI_MAX_MEASURED_GIRTHS: BMI_MAX_MEASURED_GIRTHS, DEFAULT_BODY_FAT: DEFAULT_BODY_FAT,
    KOURI_C: KOURI_C, FFMI_NORM_RANGE: FFMI_NORM_RANGE, TREXLER_SLOPE: TREXLER_SLOPE, HEIGHT_MARGIN: HEIGHT_MARGIN, FRUSTUM: FRUSTUM,
    create: create, frustumVolume: frustumVolume, siriDensity: siriDensity, fmt: fmt, isNum: isNum
  };
});
