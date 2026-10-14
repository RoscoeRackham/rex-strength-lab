// Node tests for the build calculator model. Run: node test/test.js
// The ANSUR II CSV checks run when the CSVs are found (ANSUR_DIR, data/ansur2/, or the
// research scratchpad); otherwise they check the stored summary instead.
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const BC = require('../src/calc.js');
const data = require('../data/builds.json');
const M = BC.create(data);
const F = data.facts;
const SITES = BC.SITES;

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('ok   ' + name); }
  catch (e) { failed++; console.log('FAIL ' + name + '\n     ' + (e && e.message)); }
}
function near(a, b, tol, msg) {
  assert.ok(Math.abs(a - b) <= tol, (msg || '') + ' expected ' + b + ' +/- ' + tol + ', got ' + a);
}
function relNear(a, b, rel, msg) { near(a, b, Math.abs(b) * rel, msg); }

// ---------- ANSUR CSV (optional) ----------
const CSV_DIRS = [process.env.ANSUR_DIR, path.join(__dirname, '..', 'data', 'ansur2'),
  '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ansur2/raw'].filter(Boolean);
function findCsv(name) {
  for (const d of CSV_DIRS) { const p = path.join(d, name); if (fs.existsSync(p)) return p; }
  return null;
}
function readCsv(file) {
  const lines = fs.readFileSync(file, 'latin1').trim().split(/\r?\n/);
  const head = lines[0].split(',').map(s => s.trim().toLowerCase());
  return lines.slice(1).map(l => { const c = l.split(','); const o = {}; head.forEach((h, i) => { o[h] = Number(c[i]); }); return o; });
}
const CSV_COL = { chest: 'chestcircumference', waist: 'waistcircumference', arm_flexed: 'bicepscircumferenceflexed', forearm: 'forearmcircumferenceflexed', thigh: 'thighcircumference', calf: 'calfcircumference', neck: 'neckcircumference' };
const csv = { M: findCsv('ANSUR_II_MALE_Public.csv'), F: findCsv('ANSUR_II_FEMALE_Public.csv') };
const rows = {};
for (const s of ['M', 'F']) if (csv[s]) rows[s] = readCsv(csv[s]);
function rowGirths(r) { const g = {}; for (const s of SITES) g[s] = r[CSV_COL[s]] / 1000; return g; }

// ---------- 1. ANSUR 50th man at his own height ----------
test('ANSUR II 50th percentile man reproduces his own numbers at his own height', () => {
  const b = M.byId.ansur2_m_p50;
  const r = M.compute({ buildId: 'ansur2_m_p50' });
  assert.strictEqual(r.height.value, b.height_m.value);
  assert.strictEqual(r.height.status, 'measured');
  assert.strictEqual(r.weight.value, b.weight_kg.value);
  assert.strictEqual(r.weight.status, 'measured');
  for (const s of SITES) {
    assert.strictEqual(r.girths[s].value, b.girths[s].value_m, s);
    assert.strictEqual(r.girths[s].status, 'measured', s + ' status');
  }
  // And typing his height in explicitly changes nothing.
  const r2 = M.compute({ buildId: 'ansur2_m_p50', heightM: 1.755 });
  for (const s of SITES) near(r2.girths[s].value, b.girths[s].value_m, 1e-12, s);
  near(r2.weight.value, 84.6, 1e-9, 'weight');
  // The p50 numbers match the fact table.
  near(b.girths.chest.value_m, F.ansur2_chest.values.male_p50_m, 1e-9, 'chest fact');
  near(b.girths.arm_flexed.value_m, F.ansur2_biceps_flexed.values.male_p50_m, 1e-9, 'arm fact');
});

// ---------- 2. Doubling height ----------
test('doubling height multiplies weight by 8 and girths by 2 (every build, same-shape mode)', () => {
  for (const b of data.builds) {
    const r1 = M.compute({ buildId: b.id });
    const r2 = M.compute({ buildId: b.id, heightM: 2 * b.height_m.value });
    relNear(r2.weight.value, 8 * r1.weight.value, 1e-9, b.id + ' weight');
    for (const s of SITES) {
      if (r1.girths[s].value == null) continue;
      relNear(r2.girths[s].value, 2 * r1.girths[s].value, 1e-9, b.id + ' ' + s);
    }
  }
});

test('a scaled weight is labelled derived; a typed weight is labelled input', () => {
  const r = M.compute({ buildId: 'ronnie_coleman', heightM: 1.85 });
  assert.strictEqual(r.weight.status, 'derived');
  assert.strictEqual(r.girths.chest.status, 'derived');
  assert.strictEqual(r.girths.forearm.kind, 'template');
  const r2 = M.compute({ buildId: 'ronnie_coleman', weightKg: 120 });
  assert.strictEqual(r2.weight.status, 'input');
  // G = G0 sqrt((W/H)/(W0/H0)) at the same height
  relNear(r2.girths.arm_flexed.value, 0.6096 * Math.sqrt(120 / 134.3), 1e-9, 'arm');
});

test('missing girths come from the template, rescaled, and say which template', () => {
  const r = M.compute({ buildId: 'ronnie_coleman' });
  const t = M.byId.mr_america_1938_1954_mean;
  const f = Math.sqrt((134.3 / 1.8034) / (t.weight_kg.value / t.height_m.value));
  relNear(r.girths.neck.value, t.girths.neck.value_m * f, 1e-9, 'neck');
  assert.deepStrictEqual(r.girths.neck.chain, ['mr_america_1938_1954_mean']);
  assert.strictEqual(r.girths.neck.status, 'derived');
  // Chain: Wolverine -> Yates -> Mr America mean for the forearm.
  const w = M.compute({ buildId: 'wolverine' });
  assert.deepStrictEqual(w.girths.forearm.chain, ['dorian_yates', 'mr_america_1938_1954_mean']);
  // Isometric: Colossus armoured = human form scaled by height only.
  const c = M.compute({ buildId: 'colossus_armored' });
  const ch = M.compute({ buildId: 'colossus_human' });
  relNear(c.girths.chest.value, ch.girths.chest.value * 2.2606 / 1.9812, 1e-9, 'colossus');
});

test('builds above BMI 43.5 get estimate girths flagged beyond human data, or unknown when hidden', () => {
  const r = M.compute({ buildId: 'hulk_savage' });
  assert.ok(r.beyond);
  for (const s of SITES) { assert.strictEqual(r.girths[s].status, 'estimate'); assert.ok(r.girths[s].beyond); }
  const h = M.compute({ buildId: 'hulk_savage', showBeyond: false });
  for (const s of SITES) { assert.strictEqual(h.girths[s].value, null); assert.strictEqual(h.girths[s].status, 'unknown'); }
  // Measured builds at their own size are never flagged.
  assert.ok(!M.compute({ buildId: 'ansur2_m_largest_arm' }).beyond);
});

test('average-soldier mode uses the ANSUR II per-girth exponents and labels results estimates', () => {
  const r = M.compute({ buildId: 'ansur2_m_p50', heightM: 1.755 * 1.1, mode: 'ansur' });
  const a = F.ansur_girth_allometry.values.men.waist;
  relNear(r.girths.waist.value, 0.937 * Math.pow(1.1, 3 * a[0] + a[1]), 1e-9, 'waist');
  assert.strictEqual(r.girths.waist.status, 'estimate');
  // Chest exponent is close to the geometric law (3*0.508 - 0.492 = 1.032).
  near(Math.log(r.girths.chest.value / 1.056) / Math.log(1.1), 1.032, 1e-9, 'chest exponent');
});

test('FFMI uses the given body fat and Kouri normalisation with c = 6.1', () => {
  const r = M.compute({ buildId: 'ansur2_m_p50', bodyFatPct: 20 });
  near(r.ffmi.value, 84.6 * 0.8 / (1.755 * 1.755), 1e-9, 'FFMI');
  near(r.ffmi.norm, r.ffmi.value + 6.1 * (1.8 - 1.755), 1e-9, 'normalised');
  assert.strictEqual(r.bodyFat.status, 'input');
  const d = M.compute({ buildId: 'ansur2_m_p50' });
  assert.strictEqual(d.bodyFat.value, 15); assert.strictEqual(d.bodyFat.status, 'estimate');
  const k = M.compute({ buildId: 'kouri1995_nonusers' });
  assert.strictEqual(k.bodyFat.value, 12.5); assert.strictEqual(k.bodyFat.status, 'measured'); // Kouri 1995 Table 1
  assert.strictEqual(F.kouri1995_ffmi_natural_limit.values.nonuser_normalized_FFMI_upper_limit_kg_m2, 25.0);
  assert.ok(/sample maximum, not a hard physiological limit/.test(F.kouri1995_ffmi_natural_limit.label));
  assert.strictEqual(M.compute({ buildId: 'she_hulk' }).ffmi.ref.applies, false);
});

// ---------- 3. Regression RMSE ----------
test('weight regression reproduces the research RMSE (' + (rows.M ? 'on the ANSUR II CSV' : 'stored summary only') + ')', () => {
  const want = { M: F.ansur2_weight_regression_male.values, F: F.ansur2_weight_regression_female.values };
  if (!rows.M) {
    // Fallback: the stored coefficients agree with the SI restatement in ansur_weight_from_girths.
    const si = F.ansur_weight_from_girths.values.loglinear_men;
    const v = want.M;
    const sumExp = v.loglog_ln_stature_cm + ['chest', 'waist_omphalion', 'biceps_flexed', 'forearm_flexed', 'thigh_upper', 'calf', 'neck'].reduce((s, k) => s + v['loglog_ln_' + k + '_cm'], 0);
    near(v.loglog_ln_intercept + sumExp * Math.log(100) + Math.log(v.loglog_smearing_factor), si.const, 0.0005, 'SI constant');
    near(v.loglog_rmse_kg, si.rmse_kg, 0.01, 'RMSE');
    return;
  }
  for (const s of ['M', 'F']) {
    let se = 0, n = 0;
    for (const r of rows[s]) {
      const w = M.regressionWeight(s, r.stature / 1000, rowGirths(r));
      const e = r.weightkg / 10 - w; se += e * e; n++;
    }
    const rmse = Math.sqrt(se / n);
    console.log('     ' + s + ': n=' + n + ' RMSE ' + rmse.toFixed(3) + ' kg (research ' + want[s].loglog_rmse_kg + ')');
    near(rmse, want[s].loglog_rmse_kg, 0.002, s + ' RMSE');
  }
});

test('frustum model reproduces k and its error on calculator inputs (' + (rows.M ? 'on the ANSUR II CSV' : 'stored summary only') + ')', () => {
  const fv = F.ansur_frustum_volume_model.values.calc_inputs_only;
  if (!rows.M) {
    // Fallback: the ANSUR median man comes out near his weight with the stored k.
    const g = {}; for (const s of SITES) g[s] = M.byId.ansur2_m_p50.girths[s].value_m;
    relNear(fv.k_eff_men_kg_m3 * BC.frustumVolume('M', 1.755, g), 84.6, 0.03, 'p50');
    return;
  }
  for (const s of ['M', 'F']) {
    const ln = rows[s].map(r => Math.log((r.weightkg / 10) / BC.frustumVolume(s, r.stature / 1000, rowGirths(r))));
    const mean = ln.reduce((a, b) => a + b, 0) / ln.length;
    const k = Math.exp(mean);
    const sd = 100 * Math.sqrt(ln.reduce((a, b) => a + (b - mean) * (b - mean), 0) / ln.length);
    const wantK = s === 'M' ? fv.k_eff_men_kg_m3 : fv.k_eff_women_kg_m3;
    const wantSd = s === 'M' ? fv.mass_err_sd_men_pct : fv.mass_err_sd_women_pct;
    console.log('     ' + s + ': k ' + k.toFixed(1) + ' kg/m3 (research ' + wantK + '), SD ' + sd.toFixed(2) + '% (research ' + wantSd + '%)');
    near(k, wantK, 0.15, s + ' k');
    near(sd, wantSd, 0.01, s + ' SD');
  }
});

// ---------- 4. Reverse mode on the ANSUR median man ----------
test('reverse mode on the ANSUR median man returns his weight within 3% (both estimators)', () => {
  const b = M.byId.ansur2_m_p50;
  const g = {}; for (const s of SITES) g[s] = b.girths[s].value_m;
  const r = M.reverse({ sex: 'M', heightM: b.height_m.value, girths: g, bodyFatPct: null, refFatPct: 20 });
  relNear(r.regression.value, 84.6, 0.03, 'regression');
  relNear(r.frustum.value, 84.6, 0.03, 'frustum');
  assert.strictEqual(r.warnings.length, 0);
  assert.strictEqual(r.agreement.verdict, 'within1');
  const bw = M.byId.ansur2_f_p50; const gf = {}; for (const s of SITES) gf[s] = bw.girths[s].value_m;
  const rf = M.reverse({ sex: 'F', heightM: bw.height_m.value, girths: gf });
  relNear(rf.regression.value, 66.8, 0.03, 'women regression'); relNear(rf.frustum.value, 66.8, 0.03, 'women frustum');
});

test('reverse mode warns outside the ANSUR range (flexed arm above 49 cm)', () => {
  const g = {}; for (const s of SITES) g[s] = M.byId.ansur2_m_p50.girths[s].value_m;
  g.arm_flexed = 0.55;
  const r = M.reverse({ sex: 'M', heightM: 1.755, girths: g });
  const w = r.warnings.find(x => x.site === 'arm_flexed');
  assert.ok(w && w.kind === 'above' && Math.abs(w.limit - 0.49) < 1e-9);
  // Density: 5% fat vs the 20% reference adds about 3% (Siri 1087.9 / 1053.2).
  const r5 = M.reverse({ sex: 'M', heightM: 1.755, girths: g, bodyFatPct: 5, refFatPct: 20 });
  near(r5.frustum.densityFactor, 1087.9 / 1053.2, 0.0002, 'density factor');
  near(BC.siriDensity(20), F.density_from_fat_table.values.pct20, 0.06, 'Siri 20%');
  // Missing girth: no number, no invention.
  const r0 = M.reverse({ sex: 'M', heightM: 1.755, girths: Object.assign({}, g, { neck: null }) });
  assert.strictEqual(r0.regression, null); assert.deepStrictEqual(r0.missing, ['neck']);
});

// ---------- 5. Every build, 3 heights ----------
function walk(o, p, bad, seen) {
  if (o === undefined) { bad.push(p + ' undefined'); return; }
  if (typeof o === 'number' && !isFinite(o)) { bad.push(p + ' ' + o); return; }
  if (typeof o === 'string' && /NaN|undefined|Infinity/.test(o)) { bad.push(p + ' "' + o + '"'); return; }
  if (o && typeof o === 'object') {
    if (seen.has(o)) return; seen.add(o);
    for (const k of Object.keys(o)) walk(o[k], p + '.' + k, bad, seen);
  }
}
test('every build computes without NaN, undefined or Infinity at 3 heights, both modes, both unit systems', () => {
  const bad = [];
  for (const b of data.builds) {
    for (const H of [b.height_m.value * 0.8, b.height_m.value, 2.1]) {
      for (const mode of ['geometric', 'ansur']) {
        const r = M.compute({ buildId: b.id, heightM: H, mode });
        walk({ h: r.height, w: r.weight, bmi: r.bmi, ffmi: r.ffmi, bf: r.bodyFat, g: SITES.map(s => ({ v: r.girths[s].value, st: r.girths[s].status, r: r.girths[s].range })) }, b.id + '@' + H.toFixed(2), bad, new Set());
        if (!['measured', 'official', 'reported', 'derived', 'estimate', 'input'].includes(r.weight.status)) bad.push(b.id + ' weight status ' + r.weight.status);
        for (const u of ['imperial', 'metric']) {
          const txt = [BC.fmt.height(r.height.value, u), BC.fmt.mass(r.weight.value, u), BC.fmt.num(r.bmi.value), BC.fmt.num(r.ffmi.norm)]
            .concat(SITES.map(s => BC.fmt.len(r.girths[s].value, u))).join(' ');
          if (/NaN|undefined|Infinity/.test(txt)) bad.push(b.id + ' ' + u + ': ' + txt);
        }
        for (const s of SITES) {
          const g = r.girths[s];
          if (g.value == null && g.status !== 'unknown') bad.push(b.id + ' ' + s + ' null but ' + g.status);
          if (g.value != null && g.status === 'unknown') bad.push(b.id + ' ' + s + ' value but unknown');
        }
        // Reverse mode driven by the build's own result.
        const gg = {}; SITES.forEach(s => { gg[s] = r.girths[s].value; });
        const rv = M.reverse({ sex: r.sex, heightM: H, girths: gg, bodyFatPct: r.bodyFat.value, refFatPct: 20 });
        walk({ reg: rv.regression, fr: rv.frustum, ag: rv.agreement }, b.id + ' reverse', bad, new Set());
      }
    }
  }
  assert.deepStrictEqual(bad, []);
});

test('every template chain ends in a real girth; no build is left with an unknown girth', () => {
  for (const b of data.builds) {
    const r = M.compute({ buildId: b.id });
    for (const s of SITES) assert.ok(r.girths[s].value > 0, b.id + ' ' + s);
  }
});

test('formatting: heights, masses and girths read correctly', () => {
  assert.strictEqual(BC.fmt.height(1.8034, 'imperial'), '5 ft 11 in');
  assert.strictEqual(BC.fmt.height(1.9, 'imperial'), '6 ft 2.8 in');
  assert.strictEqual(BC.fmt.height(1.755, 'metric'), '175.5 cm');
  assert.strictEqual(BC.fmt.height(10, 'metric'), '1,000 cm');
  assert.strictEqual(BC.fmt.mass(134.3, 'imperial'), '296 lb');
  assert.strictEqual(BC.fmt.mass(2700, 'metric'), '2,700 kg');
  assert.strictEqual(BC.fmt.len(0.6096, 'imperial'), '24.0 in');
  assert.strictEqual(BC.fmt.len(null, 'metric'), 'unknown');
  // One formatter: thousands separators everywhere, decimals by magnitude.
  assert.strictEqual(BC.fmt.mass(22898.1, 'metric'), '22,898 kg');
  assert.strictEqual(BC.fmt.mass(22898.1, 'imperial'), '50,482 lb');
  assert.strictEqual(BC.fmt.massNum(21441.3, 'metric'), '21,441');
  assert.strictEqual(BC.fmt.mass(2.9, 'imperial'), '6.4 lb');
  assert.strictEqual(BC.fmt.mass(0.62, 'metric'), '0.62 kg');
  // Input fields get plain numbers (a comma would be read as a decimal point).
  assert.strictEqual(BC.fmt.massField(22898.1, 'metric'), '22898');
  assert.strictEqual(BC.fmt.lenField(0.6096, 'imperial'), '24.0');
  // Ranges collapse when both ends print the same.
  assert.strictEqual(BC.fmt.massRange([2300, 3000], 'imperial'), '5,071-6,614 lb');
  assert.strictEqual(BC.fmt.massRange([2.72, 2.74], 'imperial'), '6.0 lb');
  assert.strictEqual(BC.fmt.lenRange([0.8636, 0.9144], 'imperial'), '34.0-36.0 in');
  // BMI near the 43.45 limit prints two decimals, so 43.54 does not read as 44 or 43.5.
  assert.strictEqual(BC.fmt.bmi(43.538), '43.54');
  assert.strictEqual(BC.fmt.bmi(31.66), '31.7');
});

// ---------- 6. Audit fixes ----------
test('the girth BMI limit is the ANSUR II maximum, 43.45, everywhere', () => {
  assert.strictEqual(BC.BMI_MAX_MEASURED_GIRTHS, 43.45);
  assert.strictEqual(M.bmiMax, F.ansur2_bmi.values.male_max_kg_per_m2);
  if (rows.M) {
    const max = Math.max(...rows.M.map(r => (r.weightkg / 10) / Math.pow(r.stature / 1000, 2)));
    near(max, 43.45, 0.005, 'CSV max BMI');
  }
  const k = M.compute({ buildId: 'kraemer2020_strongmen' });
  assert.ok(k.beyondBmi && k.bmiGirth > 43.45 && k.bmiGirth < 43.6);
});

test('an estimate stays an estimate when scaled: Rex at 9 ft', () => {
  const r = M.compute({ buildId: 'rex', heightM: 9 * 12 * BC.IN });
  assert.strictEqual(r.weight.status, 'estimate');
  assert.strictEqual(r.bmi.status, 'estimate');
  assert.strictEqual(r.ffmi.status, 'estimate');
  // A sourced weight scales to derived, and BMI from sourced numbers is derived.
  const c = M.compute({ buildId: 'ronnie_coleman', heightM: 1.9 });
  assert.strictEqual(c.weight.status, 'derived');
  assert.strictEqual(c.bmi.status, 'derived');
  // A typed weight against Rex's estimated weight leaves his scaled girths estimates.
  const w = M.compute({ buildId: 'rex', weightKg: 2000 });
  for (const s of SITES) assert.strictEqual(w.girths[s].status, 'estimate', s);
});

test('heights more than 10% outside the ANSUR II range are beyond human data', () => {
  near(M.heightRange.min, 1.409 / 1.1, 1e-9, 'min'); near(M.heightRange.max, 1.993 * 1.1, 1e-9, 'max');
  const hi = M.compute({ buildId: 'ansur2_m_p50', heightM: 10, weightKg: 2500 });
  assert.ok(hi.beyond); assert.strictEqual(hi.beyondHeight, 'high'); assert.ok(!hi.beyondBmi);
  for (const s of SITES) { assert.strictEqual(hi.girths[s].status, 'estimate', s); assert.ok(hi.girths[s].beyond, s); }
  const lo = M.compute({ buildId: 'ronnie_coleman', heightM: 0.5 });
  assert.strictEqual(lo.beyondHeight, 'low');
  const hidden = M.compute({ buildId: 'ronnie_coleman', heightM: 0.5, showBeyond: false });
  for (const s of SITES) assert.strictEqual(hidden.girths[s].status, 'unknown', s);
  // At its own size no build is newly flagged by height alone, and Rex and Ollie are not human.
  for (const b of data.builds) {
    const r = M.compute({ buildId: b.id });
    if (r.beyondHeight) assert.ok(r.beyondBmi, b.id + ' flagged by height only');
  }
  assert.strictEqual(M.compute({ buildId: 'rex' }).beyondHeight, null);
});

test('FFMI: plain value at this height; Kouri normalisation only for men at 1.55-2.05 m', () => {
  const w = M.compute({ buildId: 'ansur2_f_p5' });
  assert.strictEqual(w.ffmi.norm, null); assert.strictEqual(w.ffmi.normReason, 'women');
  assert.deepStrictEqual(w.ffmi.refLines.map(l => [l.id, l.v]), [['schutz_f', 15.4], ['blue_max', 25.5]]);
  const tall = M.compute({ buildId: 'ansur2_m_p50', heightM: 10, weightKg: 2500 });
  assert.strictEqual(tall.ffmi.norm, null); assert.strictEqual(tall.ffmi.ref.applies, false);
  assert.deepStrictEqual(tall.ffmi.refLines.map(l => l.id), ['schutz_m']);
  const m = M.compute({ buildId: 'ansur2_m_p50' });
  const kouri = m.ffmi.refLines.find(l => l.id === 'kouri');
  near(kouri.v, 25 - 6.1 * (1.8 - 1.755), 1e-9, 'Kouri line at this height');
  near(m.ffmi.refLines.find(l => l.id === 'trexler_max').v, 31.7 - 2.943 * (1.8 - 1.755), 1e-9, 'Trexler max at this height');
  // Comparing the plain value with the moved line is the same as comparing normalised with 25.0.
  assert.strictEqual(m.ffmi.value > kouri.v, m.ffmi.norm > 25);
});

test('Kouri verdict: none with an assumed body fat, only the break-even body fat', () => {
  const p95 = M.compute({ buildId: 'ansur2_m_p95' });
  assert.strictEqual(p95.bodyFat.status, 'estimate');
  assert.strictEqual(p95.ffmi.ref.verdict, 'unknown'); assert.strictEqual(p95.ffmi.ref.above, null);
  // Captain America at 240 lb: exceeds 25.0 only below about 17% (research correction).
  const cap = M.compute({ buildId: 'captain_america' });
  near(cap.ffmi.ref.breakEvenBf, 17.3, 0.05, 'Cap break-even');
  // At the break-even body fat the normalised FFMI is exactly 25.0.
  const at = M.compute({ buildId: 'captain_america', bodyFatPct: cap.ffmi.ref.breakEvenBf });
  near(at.ffmi.norm, 25, 1e-9, 'break-even');
  // With a sourced or typed body fat the verdict is given.
  assert.strictEqual(M.compute({ buildId: 'kraemer2020_strongmen' }).ffmi.ref.verdict, 'above');
  assert.strictEqual(M.compute({ buildId: 'ansur2_m_p95', bodyFatPct: 25 }).ffmi.ref.verdict, 'below');
});

test('data: midpoints are derived, editions print what the books print, Ollie is measured at his own scale', () => {
  for (const b of data.builds) {
    const entries = [['height', b.height_m]].concat(Object.entries(b.girths));
    for (const [k, e] of entries) {
      if (/midpoint/i.test(e.value_basis || '')) assert.strictEqual(e.status, 'derived', b.id + ' ' + k);
    }
  }
  const cap = data.builds.find(b => b.id === 'captain_america');
  for (const e of cap.editions) assert.strictEqual(BC.fmt.height(e.height_m, 'imperial'), '6 ft 2 in', e.label);
  const ol = M.byId.ollie;
  assert.strictEqual(ol.height_m.value, 3.063);
  // Mass by ruling: 3,000 kg each in all (13 Oct 2026); volume follows at the build density, and the picture's own volume is kept beside it.
  for (const b of [M.byId.rex, ol]) {
    assert.strictEqual(b.weight_kg.value, 3000, b.id + ' weight');
    near(b.derived.bmi, b.weight_kg.value / (b.height_m.value * b.height_m.value), 0.05, b.id + ' stored BMI = weight / height^2 (to one decimal)');
    near(b.volume_m3.value, b.weight_kg.value / b.density_kg_m3.value, 0.005, b.id + ' volume = weight / density');
  }
  near(F.rex_ollie_picture_mass.values.volume_central_m3.ollie, ol.volume_m3.picture_m3, 0.005, 'Ollie picture volume');
});

test('geometric-law scatter matches the ANSUR II recomputation (' + (rows.M ? 'on the CSV' : 'stored values') + ')', () => {
  const stored = F.ansur_geometric_law_test.values.resid_sd_pct;
  const want = { chest: 3.0, waist: 5.7, upper_arm_flexed: 5.2, forearm_flexed: 4.5, thigh: 3.7, calf: 4.2, neck: 4.3 };
  for (const k of Object.keys(want)) near(stored[k], want[k], 1e-9, k);
  if (!rows.M) return;
  const col = { chest: 'chestcircumference', waist: 'waistcircumference', upper_arm_flexed: 'bicepscircumferenceflexed', forearm_flexed: 'forearmcircumferenceflexed', thigh: 'thighcircumference', calf: 'calfcircumference', neck: 'neckcircumference' };
  for (const k of Object.keys(col)) {
    const ln = rows.M.map(r => Math.log(r[col[k]]) - 0.5 * Math.log((r.weightkg / 10) / r.stature));
    const m = ln.reduce((a, b) => a + b, 0) / ln.length;
    const sd = 100 * Math.sqrt(ln.reduce((a, b) => a + (b - m) * (b - m), 0) / ln.length);
    near(sd, stored[k], 0.06, k + ' recomputed');
  }
});

test('reader-facing build text has no process jargon, raw site keys or unit-less SDs', () => {
  const bad = [];
  (function walk(o, p) {
    if (Array.isArray(o)) { o.forEach((x, i) => walk(x, p + '[' + i + ']')); return; }
    if (o && typeof o === 'object') {
      for (const k of Object.keys(o)) {
        if (['cite', 'sources', 'derivation', 'source_keys', 'url', 'file'].includes(k)) continue;
        const v = o[k];
        if (typeof v === 'string') { if (/verifier|compiler|researcher|checker|orig text|in the fact|arm_flexed|\(SD [0-9]/i.test(v)) bad.push(p + '.' + k); }
        else walk(v, p + '.' + k);
      }
    }
  })(data.builds, 'builds');
  assert.deepStrictEqual(bad, []);
});

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
