const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const builds = require(B + '/build-calculator/data/builds.json');
const Fig = require(B + '/build-comparison/src/figure.js');
const T = require(B + '/build-comparison/data/outline.json');
const settings = require(B + '/build-comparison/data/settings.json');
const { measureViews } = require(B + '/build-comparison/tools/export_targets.js');
const calc = BC.create(builds); const H = 1.8;
const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: H }); const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
const opts = (x) => Object.assign({ buttockFit: BC.FRUSTUM.M.buttock }, x);
const base = Fig.human(T, H, g, {}, opts({ armDeg: 35 }));
const make = (f, deg) => Fig.human(T, H, g, {}, opts({ widthScale: f, legAxis: base.dims.legAxis, armDeg: deg }));
const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
for (const f of [1, 1.25, 1.5, 1.6, 1.7, 1.786, 1.9, 2.0, 2.2, 2.5, 2.837, 3.5, 4.5]) {
  const rest = Fig.armRestAngle((d) => make(f, d)), deg = Math.max(35, rest + 2), fig = make(f, deg);
  const m = measureViews({ front: fig.front, side: fig.side }, H, lv, 600).res;
  console.log('f', f, 'rest', rest.toFixed(1), 'drawn', deg.toFixed(1), 'score', m.score.value.toFixed(1), 'arms vol found', m.volume_m3.parts.arms.toFixed(4), 'ok', m.ok, m.warnings.filter((w) => /arm-to-torso/.test(w)).length ? 'WARN arm gap' : '');
}
console.log('pessimistic factor', settings.limits.face.pessimistic_girth_factor);
