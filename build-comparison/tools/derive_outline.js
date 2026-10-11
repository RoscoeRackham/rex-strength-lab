// Derives the human outline template from the ANSUR II public CSV (men).
// Writes data/outline.json: landmark heights as fractions of stature, breadths and depths as
// fractions of the girth at the same site, and the fits the page uses to draw any build.
// Run from build-comparison/: node tools/derive_outline.js
// test/test.js re-runs it and checks the committed file matches.
'use strict';
const fs = require('fs');
const path = require('path');

const CSV = path.join(__dirname, '..', '..', 'build-calculator', 'data', 'ansur2', 'ANSUR_II_MALE_Public.csv');

function readCsv(file) {
  const lines = fs.readFileSync(file, 'latin1').trim().split(/\r?\n/);
  const head = lines[0].split(',').map((s) => s.trim().toLowerCase());
  return lines.slice(1).map((l) => { const c = l.split(','); const o = {}; head.forEach((h, i) => { o[h] = Number(c[i]); }); return o; });
}

function stats(xs) {
  const a = xs.slice().sort((p, q) => p - q), n = a.length;
  const mean = a.reduce((s, x) => s + x, 0) / n;
  const sd = Math.sqrt(a.reduce((s, x) => s + (x - mean) * (x - mean), 0) / (n - 1));
  const q = (p) => { const i = (n - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return a[lo] + (a[hi] - a[lo]) * (i - lo); };
  return { mean, sd, p5: q(0.05), p50: q(0.5), p95: q(0.95), n };
}
const r6 = (x) => Math.round(x * 1e6) / 1e6;
function rounded(s) { const o = {}; for (const k of Object.keys(s)) o[k] = k === 'n' ? s[k] : r6(s[k]); return o; }

// Ramanujan's second approximation to the perimeter of an ellipse with full axes a and b.
function ellipsePerimeter(a, b) {
  const A = a / 2, B = b / 2, h = ((A - B) * (A - B)) / ((A + B) * (A + B));
  return Math.PI * (A + B) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

// Ordinary least squares, y = X b (X includes a column of ones).
function ols(X, y) {
  const k = X[0].length;
  const XtX = Array.from({ length: k }, () => new Array(k).fill(0));
  const Xty = new Array(k).fill(0);
  for (let i = 0; i < X.length; i++) for (let p = 0; p < k; p++) { Xty[p] += X[i][p] * y[i]; for (let q = 0; q < k; q++) XtX[p][q] += X[i][p] * X[i][q]; }
  // Gauss-Jordan
  const M = XtX.map((row, i) => row.concat([Xty[i]]));
  for (let c = 0; c < k; c++) {
    let piv = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < k; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let q = c; q <= k; q++) M[r][q] -= f * M[c][q]; }
  }
  const b = M.map((row, i) => row[k] / row[i]);
  const res = y.map((yi, i) => yi - X[i].reduce((s, x, p) => s + x * b[p], 0));
  const rmse = Math.sqrt(res.reduce((s, e) => s + e * e, 0) / (y.length - k));
  const ym = y.reduce((s, v) => s + v, 0) / y.length;
  const r2 = 1 - res.reduce((s, e) => s + e * e, 0) / y.reduce((s, v) => s + (v - ym) * (v - ym), 0);
  return { b, rmse, r2 };
}

function derive(csvFile) {
  const rows = readCsv(csvFile);
  const H = (r) => r.stature;
  const out = {
    source: 'ANSUR II public data, men (US Army 2012 survey; Gordon et al. 2014, Natick TR-15/007). Lengths in the CSV are mm.',
    file: 'build-calculator/data/ansur2/ANSUR_II_MALE_Public.csv',
    n: rows.length,
    script: 'build-comparison/tools/derive_outline.js',
    status: 'derived',
    stature_m: rounded(stats(rows.map((r) => r.stature / 1000))),
  };

  // Landmark heights as fractions of stature.
  const LEVELS = ['cervicaleheight', 'suprasternaleheight', 'acromialheight', 'axillaheight', 'chestheight', 'tenthribheight',
    'waistheightomphalion', 'iliocristaleheight', 'buttockheight', 'trochanterionheight', 'crotchheight',
    'lateralfemoralepicondyleheight', 'kneeheightmidpatella', 'tibialheight', 'lateralmalleolusheight', 'wristheight'];
  out.levels = {};
  for (const k of LEVELS) out.levels[k] = rounded(stats(rows.map((r) => r[k] / H(r))));

  // Lengths as fractions of stature.
  const LENGTHS = ['tragiontopofhead', 'mentonsellionlength', 'headlength', 'headbreadth', 'biacromialbreadth', 'bideltoidbreadth',
    'chestbreadth', 'chestdepth', 'waistbreadth', 'waistdepth', 'hipbreadth', 'buttockdepth', 'bicristalbreadth',
    'shoulderelbowlength', 'acromionradialelength', 'radialestylionlength', 'handlength', 'handbreadth', 'palmlength',
    'footlength', 'footbreadthhorizontal', 'bimalleolarbreadth', 'heelbreadth', 'forearmforearmbreadth', 'span'];
  out.lengths = {};
  for (const k of LENGTHS) out.lengths[k] = rounded(stats(rows.map((r) => r[k] / H(r))));

  // Girths as fractions of stature (for the template at its own build).
  const GIRTHS = ['neckcircumference', 'neckcircumferencebase', 'shouldercircumference', 'chestcircumference', 'waistcircumference',
    'buttockcircumference', 'thighcircumference', 'lowerthighcircumference', 'calfcircumference', 'anklecircumference',
    'bicepscircumferenceflexed', 'forearmcircumferenceflexed', 'wristcircumference', 'headcircumference', 'handcircumference'];
  out.girths = {};
  for (const k of GIRTHS) out.girths[k] = rounded(stats(rows.map((r) => r[k] / H(r))));

  // Breadth and depth over girth at the same site, and how well an ellipse of breadth x depth gives the girth.
  const SITES = {
    chest: ['chestbreadth', 'chestdepth', 'chestcircumference'],
    waist: ['waistbreadth', 'waistdepth', 'waistcircumference'],
    hip: ['hipbreadth', 'buttockdepth', 'buttockcircumference'],
  };
  out.sections = {};
  for (const [site, [b, d, g]] of Object.entries(SITES)) {
    out.sections[site] = {
      breadth: b, depth: d, girth: g,
      breadth_over_girth: rounded(stats(rows.map((r) => r[b] / r[g]))),
      depth_over_girth: rounded(stats(rows.map((r) => r[d] / r[g]))),
      depth_over_breadth: rounded(stats(rows.map((r) => r[d] / r[b]))),
      girth_over_ellipse: rounded(stats(rows.map((r) => r[g] / ellipsePerimeter(r[b], r[d])))),
    };
  }
  out.sections.shoulder = {
    breadth: 'bideltoidbreadth', girth: 'shouldercircumference',
    breadth_over_girth: rounded(stats(rows.map((r) => r.bideltoidbreadth / r.shouldercircumference))),
  };

  // Shoulder girth from chest and flexed arm (log-linear): builds have no shoulder girth of their own.
  const fitShoulder = ols(rows.map((r) => [1, Math.log(r.chestcircumference), Math.log(r.bicepscircumferenceflexed)]),
    rows.map((r) => Math.log(r.shouldercircumference)));
  out.fits = {
    shoulder_girth: { form: 'ln(shouldercircumference) = b0 + b1 ln(chestcircumference) + b2 ln(bicepscircumferenceflexed); all in mm', b: fitShoulder.b.map(r6), rmse_ln: r6(fitShoulder.rmse), r2: r6(fitShoulder.r2) },
  };
  // Neck base over neck: the trapezius line starts at the neck base.
  out.ratios = {
    neckbase_over_neck: rounded(stats(rows.map((r) => r.neckcircumferencebase / r.neckcircumference))),
    lowerthigh_over_thigh: rounded(stats(rows.map((r) => r.lowerthighcircumference / r.thighcircumference))),
    ankle_over_calf: rounded(stats(rows.map((r) => r.anklecircumference / r.calfcircumference))),
    wrist_over_forearm: rounded(stats(rows.map((r) => r.wristcircumference / r.forearmcircumferenceflexed))),
    bideltoid_over_biacromial: rounded(stats(rows.map((r) => r.bideltoidbreadth / r.biacromialbreadth))),
    bicristal_over_hip: rounded(stats(rows.map((r) => r.bicristalbreadth / r.hipbreadth))),
  };
  return out;
}

if (require.main === module) {
  const out = derive(CSV);
  const file = path.join(__dirname, '..', 'data', 'outline.json');
  fs.writeFileSync(file, JSON.stringify(out, null, 1) + '\n');
  console.log('wrote ' + path.relative(process.cwd(), file) + ' (' + out.n + ' men)');
}
module.exports = { derive, CSV, ellipsePerimeter };
