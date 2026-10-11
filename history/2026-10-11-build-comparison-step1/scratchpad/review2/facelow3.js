const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const Fig = require(B + '/build-comparison/src/figure.js');
const T = require(B + '/build-comparison/data/outline.json');
const { measureViews } = require(B + '/build-comparison/tools/export_targets.js');
const calc = BC.create(require(B + '/build-calculator/data/builds.json'));
const H = 1.8, r0 = calc.compute({ buildId: 'ansur2_m_p50', heightM: H }), g = {}; BC.SITES.forEach((s) => { g[s] = r0.girths[s].value; });
const base = Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
const make = (f, deg) => Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: deg });
const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
for (const f of [1.602, 1.643, 1.786]) { const rest = Fig.armRestAngle((d) => make(f, d)), deg = Math.max(35, rest + 2), fig = make(f, deg); const m = measureViews({ front: fig.front, side: fig.side }, H, lv, 800).res; console.log('f', f, 'arms at', deg.toFixed(1), 'tool score', m.score.value.toFixed(1), 'arms found', m.volume_m3.parts.arms > 0); }
