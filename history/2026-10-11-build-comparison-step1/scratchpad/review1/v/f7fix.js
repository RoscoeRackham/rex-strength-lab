const M = require(__dirname + '/head/build-comparison/src/measure.js');
function sliceRotatedFixed(mask, w, h, k, angleDeg) {
  if (!angleDeg) return M.sliceRows(mask, w, h, k);
  var a = angleDeg * Math.PI / 180, sa = Math.sin(a), ca = Math.cos(a);
  var U = [], V = [], umin = Infinity, vmin = Infinity, umax = -Infinity, vmax = -Infinity;
  for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
    if (!mask[y * w + x]) continue;
    for (var dx = -0.25; dx <= 0.25; dx += 0.5) for (var dy = -0.25; dy <= 0.25; dy += 0.5) {
      var u = (x + dx) * sa + (y + dy) * ca, v = (x + dx) * ca - (y + dy) * sa;
      var ui = Math.floor(u * 2), vi = Math.floor(v * 2);
      U.push(ui); V.push(vi);
      if (ui < umin) umin = ui; if (ui > umax) umax = ui; if (vi < vmin) vmin = vi; if (vi > vmax) vmax = vi;
    }
  }
  if (!U.length) return 0;
  var gw = vmax - vmin + 1, gh = umax - umin + 1, g = new Uint8Array(gw * gh);
  for (var i = 0; i < U.length; i++) g[(U[i] - umin) * gw + (V[i] - vmin)] = 1;
  for (var r = 0; r < gh; r++) for (var c = 1; c < gw - 1; c++) if (!g[r * gw + c] && g[r * gw + c - 1] && g[r * gw + c + 1]) g[r * gw + c] = 1;
  var kf = typeof k === 'function' ? k : function () { return k; };
  var vol = 0;
  for (r = 0; r < gh; r++) {
    var uc = (r + umin + 0.5) / 2, run = 0;
    for (c = 0; c <= gw; c++) {
      if (c < gw && g[r * gw + c]) run++;
      else if (run) { var vc = (vmin + c - run / 2) / 2, yImg = uc * ca - vc * sa; vol += Math.PI / 4 * kf(yImg) * (run / 2) * (run / 2) * 0.5; run = 0; }
    }
  }
  return vol;
}
const w = 300, h = 300, mask = new Uint8Array(w * h);
for (let y = 100; y < 200; y++) for (let x = 50; x < 90; x++) mask[y * w + x] = 1;
const k = M.kProfile([[100, 1], [200, 0.5]]);
console.log('sliceRows', M.sliceRows(mask, w, h, k).toFixed(0));
for (const a of [0.001, 1, 10]) console.log('fixed', a, sliceRotatedFixed(mask, w, h, k, a).toFixed(0), 'orig', M.sliceRotated(mask, w, h, k, a).toFixed(0));
console.log('const k fixed', sliceRotatedFixed(mask, w, h, 0.75, 10).toFixed(0), 'orig', M.sliceRotated(mask, w, h, 0.75, 10).toFixed(0));
