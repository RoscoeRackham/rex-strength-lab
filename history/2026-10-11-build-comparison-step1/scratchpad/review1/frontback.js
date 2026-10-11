// A sheet with front and back views only (no side view): the default order front, side, back
// takes the back view as the side view.
const BCD = '/home/user/rex-strength-lab/build-comparison';
const M = require(BCD + '/src/measure.js'), Fig = require(BCD + '/src/figure.js'), png = require(BCD + '/tools/png.js');
const BC = require('/home/user/rex-strength-lab/build-calculator/src/calc.js');
const calc = BC.create(require('/home/user/rex-strength-lab/build-calculator/data/builds.json'));
const T = require(BCD + '/data/outline.json');
const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 }), g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
const fig = Fig.human(T, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
const back = fig.front.map((p) => ({ poly: p.poly.map((q) => [-q[0], q[1]]), mark: 'own' }));
const full = Fig.renderSheet({ front: fig.front, side: fig.side }, 1.8, null, { figurePx: 600 });
const fb = Fig.renderSheet({ front: fig.front, side: back, back: [{ poly: [[0, 0], [0.0001, 0], [0.0001, 0.0001]], mark: 'own' }] }, 1.8, null, { figurePx: 600 });
png.write(process.argv[2] + '/odd/front-back-only.png', fb);
const a = M.measureSheet(full, { heightM: 1.8, heightRef: 'top' }), b = M.measureSheet(fb, { heightM: 1.8, heightRef: 'top' });
console.log('front+side+back sheet: ok', a.ok, 'volume', a.volume_m3.value.toFixed(3), 'score', a.score.value.toFixed(1), 'chest', (a.girths.chest.value_m * 100).toFixed(1) + ' cm');
console.log('front+back sheet     : ok', b.ok, 'volume', b.volume_m3.value.toFixed(3), 'score', b.score.value.toFixed(1), 'chest', (b.girths.chest.value_m * 100).toFixed(1) + ' cm', '| errors:', JSON.stringify(b.errors), '| view warning:', b.warnings.filter((w) => /views/.test(w)).join(' '));
