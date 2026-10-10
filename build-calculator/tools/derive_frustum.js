// Derives the constants of the "calculator inputs only" frustum volume model
// from the ANSUR II public CSVs. It mirrors the verifier's recheck4.py:
// keep stature + the 7 calculator girths; set every other length to the ANSUR
// mean ratio to stature; impute buttock girth by a log-linear fit on waist,
// thigh and stature; impute lower thigh, ankle, wrist and neck-base girths by
// their mean ratio to the nearest calculator girth.
// Usage: node tools/derive_frustum.js <dir with ANSUR_II_MALE_Public.csv and ANSUR_II_FEMALE_Public.csv>
'use strict';
const fs = require('fs');
const path = require('path');

function readCsv(file) {
  const lines = fs.readFileSync(file, 'latin1').trim().split(/\r?\n/);
  const head = lines[0].split(',').map(s => s.trim().toLowerCase());
  return lines.slice(1).map(l => {
    const c = l.split(',');
    const o = {};
    head.forEach((h, i) => { const v = Number(c[i]); o[h] = Number.isFinite(v) ? v : c[i]; });
    return o;
  });
}

const LENGTHS = ['suprasternaleheight', 'chestheight', 'waistheightomphalion', 'buttockheight', 'crotchheight',
  'kneeheightmidpatella', 'tibialheight', 'lateralmalleolusheight', 'headlength', 'headbreadth',
  'shoulderelbowlength', 'radialestylionlength', 'handlength', 'handbreadth', 'handcircumference',
  'footlength', 'footbreadthhorizontal'];
const RATIOS = [['lowerthighcircumference', 'thighcircumference'], ['anklecircumference', 'calfcircumference'],
  ['wristcircumference', 'forearmcircumferenceflexed'], ['neckcircumferencebase', 'neckcircumference']];

// Least squares via normal equations (4 x 4), enough for this fit.
function lstsq(X, y) {
  const n = X[0].length;
  const A = Array.from({ length: n }, () => new Array(n).fill(0));
  const b = new Array(n).fill(0);
  for (let r = 0; r < X.length; r++) {
    for (let i = 0; i < n; i++) {
      b[i] += X[r][i] * y[r];
      for (let j = 0; j < n; j++) A[i][j] += X[r][i] * X[r][j];
    }
  }
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k;
    [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]];
    for (let k = i + 1; k < n; k++) {
      const f = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) A[k][j] -= f * A[i][j];
      b[k] -= f * b[i];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j];
    x[i] = s / A[i][i];
  }
  return x;
}

const mean = a => a.reduce((s, v) => s + v, 0) / a.length;

function derive(rows) {
  const out = { length_over_stature: {}, girth_ratio: {}, buttock_fit: null, n: rows.length };
  for (const L of LENGTHS) out.length_over_stature[L] = +mean(rows.map(r => r[L] / r.stature)).toFixed(6);
  for (const [t, s] of RATIOS) out.girth_ratio[t] = { of: s, ratio: +mean(rows.map(r => r[t] / r[s])).toFixed(6) };
  // ln(buttock_m) = c0 + c1 ln(waist_m) + c2 ln(thigh_m) + c3 ln(stature_m)
  const X = rows.map(r => [1, Math.log(r.waistcircumference / 1000), Math.log(r.thighcircumference / 1000), Math.log(r.stature / 1000)]);
  const y = rows.map(r => Math.log(r.buttockcircumference / 1000));
  out.buttock_fit = lstsq(X, y).map(v => +v.toFixed(6));
  return out;
}

const dir = process.argv[2];
if (!dir) { console.error('usage: node tools/derive_frustum.js <ansur dir>'); process.exit(1); }
const res = {};
for (const [sex, f] of [['M', 'ANSUR_II_MALE_Public.csv'], ['F', 'ANSUR_II_FEMALE_Public.csv']]) {
  res[sex] = derive(readCsv(path.join(dir, f)));
}
console.log(JSON.stringify(res, null, 1));
