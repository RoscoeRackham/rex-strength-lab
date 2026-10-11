// Generates mock figure geometry + mock scores for the design mockup. Scratch only.
const fs = require('fs');
const R = '/home/user/rex-strength-lab/';
const B = require(R + 'build-calculator/data/builds.json');
const C = require(R + 'build-calculator/src/calc.js');
const F = require(R + 'build-comparison/src/figure.js');
const T = require(R + 'build-comparison/data/outline.json');
const D = require(R + 'build-comparison/data/duo-outlines.json');
const api = C.create(B);

// quick OLS for buttock fit: ln b = c0 + c1 ln waist + c2 ln thigh + c3 ln H (metres)
const csv = fs.readFileSync(R + 'build-calculator/data/ansur2/ANSUR_II_MALE_Public.csv', 'latin1').split(/\r?\n/).filter(Boolean);
const hdr = csv[0].split(',').map(s => s.trim().toLowerCase());
const ix = k => hdr.indexOf(k);
const X = [], Y = [];
for (const line of csv.slice(1)) { const c = line.split(','); const b = +c[ix('buttockcircumference')], w = +c[ix('waistcircumference')], t = +c[ix('thighcircumference')], h = +c[ix('stature')]; if (b && w && t && h) { X.push([1, Math.log(w / 1000), Math.log(t / 1000), Math.log(h / 1000)]); Y.push(Math.log(b / 1000)); } }
function ols(X, Y) { const n = X[0].length; const A = Array.from({ length: n }, () => Array(n + 1).fill(0)); X.forEach((x, r) => { for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) A[i][j] += x[i] * x[j]; A[i][n] += x[i] * Y[r]; } }); for (let i = 0; i < n; i++) { let p = i; for (let k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k;[A[i], A[p]] = [A[p], A[i]]; for (let k = 0; k < n; k++) if (k !== i) { const f = A[k][i] / A[i][i]; for (let j = i; j <= n; j++) A[k][j] -= f * A[i][j]; } } return A.map((r, i) => r[n] / r[i]); }
const bt = ols(X, Y);

// mock fat ranges (percent) by id or group
const fat = {
  ansur2_m_p5: [12, 22], ansur2_m_p50: [15, 25], ansur2_m_p95: [20, 30], ansur2_m_leanheavy: [12, 20], ansur2_m_largest_arm: [18, 28], nhanes_m_median: [20, 30],
  kouri1995_nonusers: [11, 15], chappell2019_natural_pro: [8, 14], mr_america_1938_1954_mean: [8, 14], steve_reeves_1947: [8, 12],
  sukwong2022_thai_elite: [16, 19], mcinnis1999_bodybuilders: [7, 9], withers1997_elite: [4, 6], fry1991_nonelite: [8, 11], demoraes2019_br_national: [6, 12],
  brian_shaw: [15, 20], hafthor_bjornsson: [15, 25], eddie_hall: [18, 28], lasha_talakhadze: [22, 32], kraemer2020_strongmen: [17, 21],
  kingpin: [25, 40], bruce_banner: [10, 18], thing: [8, 15], colossus_armored: [8, 15]
};
const grpFat = { 'Bodybuilders': [4, 10], 'Comic characters': [8, 15] };
const groupKey = { 'Everyday': 'everyday', 'Natural athletes': 'natural', 'Bodybuilders': 'enhanced', 'Strongmen and lifters': 'strong', 'Comic characters': 'comic', 'Rex and Ollie': 'duo' };
const flags = {
  thing: 'Rock, not muscle. Overstated.', colossus_armored: 'Steel skin. Not comparable.', thor: 'Asgardian tissue is said to be denser. May be overstated.',
  wolverine: 'Adamantium (about 45 kg) taken out.', kingpin: 'Much of his weight is fat.'
};

const k = 1000; // keep metres; we'll output in metres with 4 dp
const fmt = poly => poly.map(p => (+p[0].toFixed(3)) + ',' + (+p[1].toFixed(3))).join(' ');
function packParts(parts) {
  const out = [];
  for (const p of parts) {
    const o = { n: p.name, m: p.mark, poly: fmt(p.poly) };
    if (p.edges) o.edges = p.edges.map(e => ({ m: e.mark, pts: fmt(e.pts) }));
    out.push(o);
  }
  return out;
}

const builds = [];
for (const b of B.builds) {
  if (b.sex !== 'M' || b.group === 'Rex and Ollie') continue;
  const r = api.compute({ buildId: b.id });
  const H = b.height_m.value, W = (b.girth_basis_weight_kg || b.weight_kg.value);
  const fr = fat[b.id] || grpFat[b.group] || [12, 20];
  const S = f => 1.8 * W * (1 - f / 100) / Math.pow(H, 3);
  const P = f => W * (1 - f / 100) / Math.pow(H, 2);
  const g = {}, marks = {};
  for (const s of F.SITES) { g[s] = r.girths[s].value; marks[s] = r.girths[s].kind === 'own' ? 'own' : 'template'; }
  let fig;
  try { fig = F.human(T, H, g, marks, { buttockFit: bt, armDeg: 22 }); } catch (e) { console.error(b.id, e.message); continue; }
  builds.push({
    id: b.id, name: b.name, g: groupKey[b.group], H, W: b.weight_kg.value, Hs: b.height_m.status, Ws: b.weight_kg.status,
    fat: fr, score: [S(fr[1]), S(fr[0])], ffmi: [P(fr[1]), P(fr[0])], flag: flags[b.id] || null,
    marks, front: packParts(fig.front), side: packParts(fig.side), top: H
  });
}
// duo
const duo = { rex: { skull: 2.89, name: 'Rex', score: [152, 168], ffmi: [255, 280] }, ollie: { skull: 2.95, name: 'Ollie', score: [170, 188], ffmi: [262, 290] } };
for (const id of ['rex', 'ollie']) {
  const Cc = D.characters[id];
  const fr = F.traced(Cc, 'front', duo[id].skull);
  const sd = F.traced(Cc, 'side', duo[id].skull);
  builds.push({ id, name: duo[id].name, g: 'duo', H: id === 'rex' ? 3.048 : 3.063, W: 2700, Hs: 'estimate', Ws: 'estimate', fat: [5, 10], score: duo[id].score, ffmi: duo[id].ffmi, flag: null,
    skull: duo[id].skull, front: packParts(fr.parts), side: packParts(sd.parts), top: fr.H, topSide: sd.H });
}
// widened template (geometry) for the limits stop
const p50 = B.builds.find(b => b.id === 'ansur2_m_p50'); const r50 = api.compute({ buildId: 'ansur2_m_p50' });
const g50 = {}; for (const s of F.SITES) g50[s] = r50.girths[s].value;
const S50 = 1.8 * 84.6 * 0.8 / Math.pow(1.755, 3);
const widened = [1, 1.5, 2, 2.6].map(f => { const fig = F.human(T, 1.755, g50, {}, { buttockFit: bt, armDeg: 22, widthScale: f }); return { f, score: S50 * f * f, front: packParts(fig.front), side: packParts(fig.side), top: 1.755 }; });
const target = (() => { const f = Math.sqrt(60 / S50); const fig = F.human(T, 1.755, g50, {}, { buttockFit: bt, armDeg: 22, widthScale: f }); return { f, score: 60, front: packParts(fig.front), side: packParts(fig.side), top: 1.755, levels: fig.dims.levels }; })();
const val = require(R + 'build-comparison/data/duo-validation.json');
const img = fs.readFileSync(R + 'rex-strength-lab/assets/duo.jpg').toString('base64');
fs.writeFileSync(__dirname + '/mockdata.js', 'window.MOCK=' + JSON.stringify({ bt, builds, widened, S50, target, val: { parts: val.parts.map(p => ({ name: p.name, group: p.group, polygon: p.polygon })), scale: val.scale } }) + ';\nwindow.DUOJPG="data:image/jpeg;base64,' + img + '";');
for (const b of builds) console.log(b.id.padEnd(26), b.g.padEnd(9), b.score.map(x => x.toFixed(1)).join('-'), ' ffmi', b.ffmi.map(x => x.toFixed(1)).join('-'));
console.log('bt', bt, 'bytes', fs.statSync(__dirname + '/mockdata.js').size);
