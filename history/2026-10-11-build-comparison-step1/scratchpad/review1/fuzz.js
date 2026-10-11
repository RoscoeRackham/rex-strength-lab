// Simple shapes as sheet views: does measureSheet ever return NaN/Infinity/negative numbers?
const BCD = '/home/user/rex-strength-lab/build-comparison';
const M = require(BCD + '/src/measure.js'), Fig = require(BCD + '/src/figure.js');
const rect = (x0, y0, x1, y1) => ({ poly: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], mark: 'own' });
const ell = (cx, cy, rx, ry) => ({ poly: Fig.ellipse(cx, cy, rx, ry, 64), mark: 'own' });
const cases = {
  'two rectangles': { front: [rect(-0.25, 0, 0.25, 1.8)], side: [rect(-0.15, 0, 0.15, 1.8)] },
  'two ellipses': { front: [ell(0, 0.9, 0.3, 0.9)], side: [ell(0, 0.9, 0.2, 0.9)] },
  'thin side (3 cm)': { front: [rect(-0.25, 0, 0.25, 1.8)], side: [rect(-0.015, 0, 0.015, 1.8)] },
  'T shape': { front: [rect(-0.8, 1.4, 0.8, 1.5), rect(-0.2, 0, 0.2, 1.8)], side: [rect(-0.15, 0, 0.15, 1.8)] },
  'floating head': { front: [ell(0, 1.7, 0.1, 0.1), rect(-0.2, 0, 0.2, 1.5)], side: [ell(0, 1.7, 0.1, 0.1), rect(-0.15, 0, 0.15, 1.5)] },
  'upside-down triangle': { front: [{ poly: [[-0.6, 1.8], [0.6, 1.8], [0, 0]], mark: 'own' }], side: [{ poly: [[-0.3, 1.8], [0.3, 1.8], [0, 0]], mark: 'own' }] },
};
const bad = [];
function walk(o, path) {
  if (typeof o === 'number') { if (!Number.isFinite(o)) bad.push(path + '=' + o); return; }
  if (o && typeof o === 'object' && !(o instanceof Uint8Array)) for (const [k, v] of Object.entries(o)) if (!['mask', 'frontLandmarks', 'views'].includes(k)) walk(v, path + '.' + k);
}
for (const [name, v] of Object.entries(cases)) {
  const img = Fig.renderSheet(v, 1.8, null, { figurePx: 500 });
  let r; try { r = M.measureSheet(img, { heightM: 1.8, heightRef: 'top' }); } catch (e) { console.log(name, 'THREW', e.message); continue; }
  bad.length = 0; walk(r, 'r');
  const neg = Object.entries(r.lengths || {}).filter(([k, x]) => x != null && x < 0).map(([k, x]) => k + '=' + x.toFixed(3));
  console.log(name.padEnd(22), 'ok', r.ok, '| vol', r.volume_m3 && r.volume_m3.value.toFixed(3), '| score', r.score && r.score.value.toFixed(1), '| non-finite:', bad.slice(0, 6).join(', ') || 'none', '| negative lengths:', neg.join(', ') || 'none', '| errors:', r.errors.join(' / ').slice(0, 120));
}
