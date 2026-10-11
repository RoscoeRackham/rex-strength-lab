// Code F2 (front+back), F3 (skull rows), F9 (messages) in Node.
const R = process.argv[2], S = process.argv[3];
const png = require(R + '/build-comparison/tools/png.js');
const M = require(R + '/build-comparison/src/measure.js');
const s700 = png.read(S + '/s700.png'), fb = png.read(S + '/frontback.png');
const base = { heightM: 1.8, density: 1060, bodyFatPct: 7.5, order: ['front', 'side', 'back'] };
const show = (lab, r) => console.log(lab, '| ok', r.ok, '| score', r.score ? r.score.value.toFixed(1) : '-', '| errors', JSON.stringify(r.errors.slice(0, 3)).slice(0, 300), '| side check', JSON.stringify((r.checks || []).filter((c) => /side view is/.test(c.name)).map((c) => c.detail)));
show('normal 3-view', M.measureSheet(s700, Object.assign({ heightRef: 'top' }, base)));
show('front, mirrored front as side, back', M.measureSheet(fb, Object.assign({ heightRef: 'top' }, base)));
// 2-view crop: front + back only (crop out the middle view)
function crop2(img) {
  const r = M.measureSheet(img, Object.assign({ heightRef: 'top' }, base)); const V = r.views;
  // keep front and back columns, blank the side
  const out = { width: img.width, height: img.height, data: new Uint8ClampedArray(img.data) };
  for (let y = 0; y < img.height; y++) for (let x = V.side.x0 - 2; x <= V.side.x1 + 2; x++) { const i = (y * img.width + x) * 4; out.data[i] = out.data[i + 1] = out.data[i + 2] = 255; }
  return out;
}
const two = crop2(s700);
show('front + back only (2 views, back in side slot)', M.measureSheet(two, Object.assign({ heightRef: 'top' }, base)));
show('front + back only, order front,back,side', M.measureSheet(two, Object.assign({ heightRef: 'top' }, base, { order: ['front', 'back', 'side'] })));
// skull rows: true row 56; head spans to the chin ~ 0.13 of 700 px = ~91 px below
const top = M.measureSheet(s700, Object.assign({ heightRef: 'top' }, base));
const v = top.views.front; console.log('front view y0', v.y0, 'y1', v.y1, 'neck row', top.landmarks.front.neck, 'shoulder row', top.landmarks.front.shoulder || top.landmarks.front.acromion, 'chest', top.landmarks.front.chest);
for (const row of [56, 100, 120, 140, 196, 640]) {
  const r = M.measureSheet(s700, Object.assign({ heightRef: 'skull', skullRows: { front: row, side: row, back: row } }, base));
  show('skull rows ' + row + ' (' + ((row - v.y0) / (v.y1 - v.y0) * 100).toFixed(0) + '% down)', r);
}
