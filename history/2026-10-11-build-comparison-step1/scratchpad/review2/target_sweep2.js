// Replicates the page's drawTarget() (src/app.html) in Node for every base shape and many targets.
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const builds = require(B + '/build-calculator/data/builds.json');
const Fig = require(B + '/build-comparison/src/figure.js');
const M = require(B + '/build-comparison/src/measure.js');
const T = require(B + '/build-comparison/data/outline.json');
const LIM = require(B + '/build-comparison/data/limits.json');
const calc = BC.create(builds);
const ids = process.argv[2] ? process.argv[2].split(',') : LIM.templates.map((t) => t.id);
const targets = process.argv[3] ? process.argv[3].split(',').map(Number) : [15, 20, 25, 30, 40, 60, 75, 80, 85, 100, 150, 200, 300, 500, 700, 900];
for (const id of ids) {
  const r0 = calc.compute({ buildId: id, heightM: 1.8 }), gs = {};
  BC.SITES.forEach((s) => { gs[s] = r0.girths[s].value; });
  const H = 1.8, fit = BC.FRUSTUM.M.buttock, base = Fig.human(T, H, gs, {}, { buttockFit: fit, armDeg: 35 });
  const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  const make = (f, deg) => Fig.human(T, H, gs, {}, { buttockFit: fit, armDeg: deg, widthScale: f, legAxis: base.dims.legAxis });
  const sheetAt = (f, px) => {
    const rest = Fig.armRestAngle((d) => make(f, d));
    const fig = make(f, Math.max(35, rest + 2));
    const img = Fig.renderSheet({ front: fig.front, side: fig.side }, H, lv, { figurePx: px });
    const r = M.measureSheet(img, { heightM: H, heightRef: 'skull', skullRows: Fig.sheetSkullRows(img, H), density: 1060, bodyFatPct: 7.5, order: ['front', 'side', 'back'], seg: { refine: 0 } });
    r.armDeg = Math.max(35, rest + 2);
    return { img, r };
  };
  const passing = (r) => (r.ok && r.score ? r.score.value : NaN);
  for (const tv of targets) {
    const t0 = Date.now(); let n = 0;
    const sol = Fig.solveTarget((f) => { n++; return passing(sheetAt(f, 300).r); }, tv);
    let line = id.padEnd(22) + ' target ' + String(tv).padStart(4) + ': ';
    if (sol.f == null) {
      const msg = sol.reason === 'fails' ? 'No outline on this shape reaches ' + tv + ' and passes the tool\'s own checks: beyond widths and depths x ' + (sol.bestF).toFixed(2) + ' (score ' + (sol.bestScore).toFixed(1) + ') the drawing fails them.'
        : 'Every width and depth x ' + sol.bestF.toFixed(2) + ' ' + (sol.bestScore > tv ? 'goes no lower than ' : 'reaches only ') + sol.bestScore.toFixed(1) + ' on this shape.';
      console.log(line + 'REFUSED (' + sol.reason + ') ' + msg + ' [' + n + ' evals, ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s]');
      continue;
    }
    const conv300 = sol.score;
    let f = sol.f, out = sheetAt(f, 1000);
    for (let i = 0; i < 2 && out.r.ok && Math.abs(out.r.score.value / tv - 1) > 0.005; i++) { f *= Math.sqrt(tv / out.r.score.value); out = sheetAt(f, 1000); }
    if (!out.r.ok) { console.log(line + 'FULL-SIZE FAILS: ' + out.r.checks.filter((c) => !c.ok).map((c) => c.name + ' -- ' + c.detail).join('; ') + ' [f ' + f.toFixed(3) + ']'); continue; }
    const s = out.r.score.value;
    console.log(line + 'f ' + f.toFixed(3) + ' armDeg ' + out.r.armDeg.toFixed(1) + ' armsFound ' + (out.r.volume_m3.parts.arms > 0) + ' | 300px ' + conv300.toFixed(2) + ' | 1000px ' + s.toFixed(2) + ' (' + ((s / tv - 1) * 100).toFixed(1) + '%) [' + n + ' evals, ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s]');
  }
}
