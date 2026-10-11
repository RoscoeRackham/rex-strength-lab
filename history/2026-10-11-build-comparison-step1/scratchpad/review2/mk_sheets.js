// A large valid sheet (the 95th percentile soldier, 2,000 px figure) and a small different one.
const T = process.argv[2], out = process.argv[3];
const Fig = require(T + '/build-comparison/src/figure.js');
const png = require(T + '/build-comparison/tools/png.js');
const { templateViews } = require(T + '/build-comparison/tools/export_targets.js');
const a = templateViews('ansur2_m_p95', 1.8, 1);
png.write(out + '/big-p95.png', Fig.renderSheet(a.views, 1.8, a.levels, { figurePx: 2000 }));
const b = templateViews('ansur2_m_p50', 1.8, 2.0);
png.write(out + '/small-wide.png', Fig.renderSheet(b.views, 1.8, b.levels, { figurePx: 500 }));
console.log('ok');
