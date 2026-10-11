// Skull-row validation on an anti-aliased sheet (a 4x render box-filtered down, as a drawing program
// would export it). The skull row read off the sheet's own height bar is the true skull top.
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const Fig = require(B + '/build-comparison/src/figure.js');
const M = require(B + '/build-comparison/src/measure.js');
const { templateViews } = require(B + '/build-comparison/tools/export_targets.js');
for (const px of [600, 1000, 2000]) {
  for (const shift of [0, 0.25, 0.5, 0.75]) {
    const t = templateViews('ansur2_m_p50', 1.8, 1);
    // shift the figure up by a fraction of a final pixel so the top lands at different sub-pixel positions
    const sh = (shift / (px / 1.8));
    const mv = (parts) => parts.map((p) => ({ name: p.name, mark: p.mark, poly: p.poly.map((q) => [q[0], q[1] + sh]) }));
    const big = Fig.renderSheet({ front: mv(t.views.front), side: mv(t.views.side) }, 1.8 + sh, null, { figurePx: px * 4 * (1.8 + sh) / 1.8 });
    // box-filter 4x4 down
    const W = Math.floor(big.width / 4), Hh = Math.floor(big.height / 4), data = new Uint8ClampedArray(W * Hh * 4);
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) { for (let c = 0; c < 3; c++) { let s = 0; for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) s += big.data[((4 * y + dy) * big.width + 4 * x + dx) * 4 + c]; data[(y * W + x) * 4 + c] = s / 16; } data[(y * W + x) * 4 + 3] = 255; }
    const img = { width: W, height: Hh, data };
    const ground = big.ground / 4, k = px / 1.8;
    const skullTop = ground - (1.8 + sh) * k; // continuous coordinate of the skull top (true)
    const row = Math.floor(skullTop); // the pixel row that contains the skull top
    const r = M.measureSheet(img, { heightM: 1.8, skullRows: { front: row, side: row, back: row } });
    const v = r.views || {};
    console.log(px + 'px shift ' + shift + ': skull top at y=' + skullTop.toFixed(2) + ', typed row ' + row + ', mask top front ' + (v.front && v.front.y0) + ' side ' + (v.side && v.side.y0) + ' -> ' + (r.errors.filter((e) => /outside its head/.test(e)).length ? 'REFUSED: ' + r.errors[0] : 'accepted, score ' + (r.score && r.score.value.toFixed(2))));
  }
}
