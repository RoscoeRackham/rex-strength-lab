/*
 * Measuring tool: measures a character from an A-pose model sheet (front, side and back views at
 * one scale), or from a single front view with assumed depth ratios.
 *
 * Plain JS. In node: const Measure = require('./measure.js'). In a page: window.Measure.
 * Images are { width, height, data } with RGBA bytes (canvas ImageData, or tools/png.js in node).
 * Masks are Uint8Array(width * height), 1 = figure. Lengths are pixels unless a name says _m.
 *
 * What it does, in order:
 *   segment()     figure mask: a pixel is figure when it is warmer, darker or far in colour from
 *                 the background, which is estimated row by row from the sheet's left and right edges.
 *   splitViews()  the sheet's views: column bands separated by empty columns.
 *   landmarks()   rows of the top, the ground, the neck, armpits, chest, waist, crotch, knees and
 *                 ankles, found from the run structure of each row of a front or back view.
 *   measureSheet() front width x side depth per row: volume, girths, lengths, frontal area, checks.
 *   frontOnly()   one front view with a depth ratio k per part (the old picture method).
 *   contour()     the outline of a mask as a polygon, for drawing.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.Measure = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- small helpers ----------
  function median(a) {
    if (!a.length) return NaN;
    var s = a.slice().sort(function (p, q) { return p - q; });
    var m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }
  function clamp(x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; }
  /** Ramanujan's second approximation: perimeter of an ellipse with full axes a and b. */
  function ellipsePerimeter(a, b) {
    var A = a / 2, B = b / 2;
    if (A + B === 0) return 0;
    var h = (A - B) * (A - B) / ((A + B) * (A + B));
    return Math.PI * (A + B) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
  }

  // ---------- segmentation ----------
  var SEG_DEFAULTS = {
    margin: 0.012,     // fraction of the width sampled at each side for the background
    warm: 14,          // (R - B) above the background's (R - B): skin, fur, scales, horn
    dark: 0.55,        // luminance below this fraction of the background's: hair, claws, dark clothing
                       // (a soft grey floor shadow stays above it)
    dist: 95,          // any colour this far from the background
    minPart: 0.02,     // keep components at least this fraction of the largest one
    maxHole: 0.004,    // fill holes smaller than this fraction of the largest component
    // Refinement passes against a local background painted in from the pixels around the figure
    // (push-pull inpainting). They catch dark clothing with a grey sheen and soft edges.
    refine: 2,
    refineDist: 24,    // colour distance from the local background
    refineWarm: 8,     // (R - B) above the local background's
    refineDark: 18,    // luminance below the local background's
    holeDist: 45       // an enclosed hole this far (mean colour distance) from the painted
                       // background is a sheen on the figure, not a window, and is filled
  };

  /**
   * Smooth background estimate everywhere from the pixels where weight is 1 (push-pull:
   * average down a pyramid, then fill each level's gaps from the coarser one).
   * Returns Float32Array(w * h * 3).
   */
  function pushPull(img, weight) {
    var w = img.width, h = img.height, d = img.data;
    var levels = [];
    var I = new Float32Array(w * h * 3), W = new Float32Array(w * h);
    for (var i = 0; i < w * h; i++) { var wt = weight[i]; W[i] = wt; I[i * 3] = d[i * 4] * wt; I[i * 3 + 1] = d[i * 4 + 1] * wt; I[i * 3 + 2] = d[i * 4 + 2] * wt; }
    var lw = w, lh = h;
    while (lw > 2 && lh > 2) {
      levels.push({ I: I, W: W, w: lw, h: lh });
      var nw = (lw + 1) >> 1, nh = (lh + 1) >> 1;
      var I2 = new Float32Array(nw * nh * 3), W2 = new Float32Array(nw * nh);
      for (var y = 0; y < lh; y++) for (var x = 0; x < lw; x++) {
        var a = y * lw + x, b = (y >> 1) * nw + (x >> 1);
        W2[b] += W[a]; I2[b * 3] += I[a * 3]; I2[b * 3 + 1] += I[a * 3 + 1]; I2[b * 3 + 2] += I[a * 3 + 2];
      }
      I = I2; W = W2; lw = nw; lh = nh;
    }
    var est = new Float32Array(lw * lh * 3);
    for (i = 0; i < lw * lh; i++) for (var c = 0; c < 3; c++) est[i * 3 + c] = W[i] > 0 ? I[i * 3 + c] / W[i] : 128;
    for (var L = levels.length - 1; L >= 0; L--) {
      var lv = levels[L], cw = lw, ch = lh;
      lw = lv.w; lh = lv.h;
      var up = new Float32Array(lw * lh * 3);
      for (y = 0; y < lh; y++) for (x = 0; x < lw; x++) {
        // 3 x 3 box over the coarse estimate around the parent cell
        var px = x >> 1, py = y >> 1, acc0 = 0, acc1 = 0, acc2 = 0, n = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var qx = px + dx, qy = py + dy;
          if (qx < 0 || qy < 0 || qx >= cw || qy >= ch) continue;
          var q = (qy * cw + qx) * 3; acc0 += est[q]; acc1 += est[q + 1]; acc2 += est[q + 2]; n++;
        }
        var o = (y * lw + x) * 3, wa = Math.min(1, lv.W[y * lw + x]);
        for (c = 0; c < 3; c++) {
          var own = lv.W[y * lw + x] > 0 ? lv.I[o + c] / lv.W[y * lw + x] : 0;
          up[o + c] = wa * own + (1 - wa) * [acc0, acc1, acc2][c] / n;
        }
      }
      est = up;
    }
    return est;
  }

  /** Background colour per row: median of the left and right margins, blended across the row. */
  function backgroundRows(img, opts) {
    var w = img.width, h = img.height, d = img.data;
    var m = Math.max(3, Math.round(w * (opts.margin || SEG_DEFAULTS.margin)));
    var left = [], right = [];
    for (var y = 0; y < h; y++) {
      var L = [[], [], []], R = [[], [], []];
      for (var x = 0; x < m; x++) {
        var o = (y * w + x) * 4, o2 = (y * w + (w - 1 - x)) * 4;
        for (var c = 0; c < 3; c++) { L[c].push(d[o + c]); R[c].push(d[o2 + c]); }
      }
      left.push([median(L[0]), median(L[1]), median(L[2])]);
      right.push([median(R[0]), median(R[1]), median(R[2])]);
    }
    // Smooth down the rows (the edges can hold a stray dark pixel).
    function smooth(a) {
      var out = [];
      for (var y = 0; y < a.length; y++) {
        var acc = [[], [], []];
        for (var k = -4; k <= 4; k++) { var yy = clamp(y + k, 0, a.length - 1); for (var c = 0; c < 3; c++) acc[c].push(a[yy][c]); }
        out.push([median(acc[0]), median(acc[1]), median(acc[2])]);
      }
      return out;
    }
    return { left: smooth(left), right: smooth(right) };
  }

  /** Label 4-connected components of value v in a mask. Returns { labels, sizes, boxes }. */
  function components(mask, w, h, v) {
    var labels = new Int32Array(w * h), sizes = [0], boxes = [null];
    var stack = new Int32Array(w * h);
    var n = 0;
    for (var i = 0; i < w * h; i++) {
      if (mask[i] !== v || labels[i]) continue;
      n++;
      var sp = 0, size = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
      stack[sp++] = i; labels[i] = n;
      while (sp) {
        var p = stack[--sp], px = p % w, py = (p - px) / w;
        size++;
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
        if (px > 0 && mask[p - 1] === v && !labels[p - 1]) { labels[p - 1] = n; stack[sp++] = p - 1; }
        if (px < w - 1 && mask[p + 1] === v && !labels[p + 1]) { labels[p + 1] = n; stack[sp++] = p + 1; }
        if (py > 0 && mask[p - w] === v && !labels[p - w]) { labels[p - w] = n; stack[sp++] = p - w; }
        if (py < h - 1 && mask[p + w] === v && !labels[p + w]) { labels[p + w] = n; stack[sp++] = p + w; }
      }
      sizes.push(size); boxes.push([x0, y0, x1, y1]);
    }
    return { labels: labels, sizes: sizes, boxes: boxes, n: n };
  }

  /** Erode or dilate a mask by one pixel (4-neighbourhood). */
  function morph(mask, w, h, dilate) {
    var out = new Uint8Array(w * h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var i = y * w + x, v = mask[i];
      var a = x > 0 ? mask[i - 1] : v, b = x < w - 1 ? mask[i + 1] : v, c = y > 0 ? mask[i - w] : v, e = y < h - 1 ? mask[i + w] : v;
      out[i] = dilate ? (v | a | b | c | e) : (v & a & b & c & e);
    }
    return out;
  }

  /**
   * Figure mask of a sheet.
   * opts: SEG_DEFAULTS overrides, plus ignore: [[x0,y0,x1,y1], ...] rectangles to clear (labels, bars).
   * Returns { mask, width, height, bg }.
   */
  function segment(img, opts) {
    opts = Object.assign({}, SEG_DEFAULTS, opts || {});
    var w = img.width, h = img.height, d = img.data;
    var bg = backgroundRows(img, opts);
    var mask = new Uint8Array(w * h);
    for (var y = 0; y < h; y++) {
      var L = bg.left[y], R = bg.right[y];
      for (var x = 0; x < w; x++) {
        var t = w > 1 ? x / (w - 1) : 0;
        var br = L[0] + (R[0] - L[0]) * t, bgc = L[1] + (R[1] - L[1]) * t, bb = L[2] + (R[2] - L[2]) * t;
        var o = (y * w + x) * 4, r = d[o], g = d[o + 1], b = d[o + 2];
        var warm = (r - b) - (br - bb);
        var dark = (r + g + b) < opts.dark * (br + bgc + bb);
        var dist = Math.sqrt((r - br) * (r - br) + (g - bgc) * (g - bgc) + (b - bb) * (b - bb));
        if (warm > opts.warm || dark || dist > opts.dist) mask[y * w + x] = 1;
      }
    }
    (opts.ignore || []).forEach(function (r) {
      for (var y = Math.max(0, r[1]); y <= Math.min(h - 1, r[3]); y++) for (var x = Math.max(0, r[0]); x <= Math.min(w - 1, r[2]); x++) mask[y * w + x] = 0;
    });
    // Open (remove specks), close (bridge hairline gaps), then keep the large parts and fill small holes.
    mask = morph(morph(mask, w, h, false), w, h, true);
    mask = morph(morph(mask, w, h, true), w, h, false);
    var cc = components(mask, w, h, 1);
    var big = 0;
    for (var k = 1; k <= cc.n; k++) if (cc.sizes[k] > big) big = cc.sizes[k];
    var keep = new Uint8Array(cc.n + 1);
    for (k = 1; k <= cc.n; k++) keep[k] = cc.sizes[k] >= opts.minPart * big ? 1 : 0;
    for (var i = 0; i < w * h; i++) mask[i] = cc.labels[i] && keep[cc.labels[i]] ? 1 : 0;
    var holes = components(mask, w, h, 0);
    var maxHole = opts.maxHole * big;
    for (k = 1; k <= holes.n; k++) {
      var bx = holes.boxes[k];
      var touches = bx[0] === 0 || bx[1] === 0 || bx[2] === w - 1 || bx[3] === h - 1;
      holes.sizes[k] = !touches && holes.sizes[k] <= maxHole ? -1 : holes.sizes[k];
    }
    for (i = 0; i < w * h; i++) if (!mask[i] && holes.sizes[holes.labels[i]] === -1) mask[i] = 1;
    for (var pass = 0; pass < (opts.refine || 0); pass++) mask = refineMask(img, mask, opts);
    return { mask: mask, width: w, height: h, bg: bg };
  }

  /**
   * One refinement pass against the background painted in from outside the figure.
   * - An enclosed hole whose pixels match that background (a window between an arm and the
   *   body) stays background; one that does not (a grey sheen on dark clothing) is filled.
   * - Pixels within 4 px of the outer edge are classified again with lower thresholds, which
   *   recovers soft edges and drops halo.
   */
  function refineMask(img, mask, opts) {
    var w = img.width, h = img.height, d = img.data, i, k;
    var bgc = components(mask, w, h, 0);
    var enclosed = new Uint8Array(bgc.n + 1);
    for (k = 1; k <= bgc.n; k++) { var b = bgc.boxes[k]; enclosed[k] = b[0] > 0 && b[1] > 0 && b[2] < w - 1 && b[3] < h - 1 ? 1 : 0; }
    var near = mask;
    for (k = 0; k < 4; k++) near = morph(near, w, h, true);
    var weight = new Float32Array(w * h);
    for (i = 0; i < w * h; i++) weight[i] = !near[i] && !enclosed[bgc.labels[i]] ? 1 : 0;
    var bg = pushPull(img, weight);
    function test(i) {
      var r = d[i * 4], g = d[i * 4 + 1], bb = d[i * 4 + 2];
      var R = bg[i * 3], G = bg[i * 3 + 1], B = bg[i * 3 + 2];
      var dist = Math.sqrt((r - R) * (r - R) + (g - G) * (g - G) + (bb - B) * (bb - B));
      return { dist: dist, fg: dist > opts.refineDist || (r - bb) - (R - B) > opts.refineWarm || (R + G + B) / 3 - (r + g + bb) / 3 > opts.refineDark };
    }
    // Holes: mean distance from the painted background.
    var sum = new Float64Array(bgc.n + 1);
    for (i = 0; i < w * h; i++) if (!mask[i] && enclosed[bgc.labels[i]]) sum[bgc.labels[i]] += test(i).dist;
    var fillHole = new Uint8Array(bgc.n + 1);
    for (k = 1; k <= bgc.n; k++) if (enclosed[k] && sum[k] / bgc.sizes[k] > opts.holeDist) fillHole[k] = 1;
    var out = new Uint8Array(w * h);
    for (i = 0; i < w * h; i++) {
      if (mask[i]) out[i] = 1;
      else if (enclosed[bgc.labels[i]]) out[i] = fillHole[bgc.labels[i]];
    }
    // Outer edge band: pixels near the figure that are not inside a kept window.
    var inner = mask;
    for (k = 0; k < 4; k++) inner = morph(inner, w, h, false);
    for (i = 0; i < w * h; i++) {
      if (!near[i] || inner[i]) continue;
      if (!mask[i] && enclosed[bgc.labels[i]]) continue;
      out[i] = test(i).fg ? 1 : 0;
    }
    out = morph(morph(out, w, h, false), w, h, true);
    out = morph(morph(out, w, h, true), w, h, false);
    var cc = components(out, w, h, 1), big = 0;
    for (k = 1; k <= cc.n; k++) if (cc.sizes[k] > big) big = cc.sizes[k];
    for (i = 0; i < w * h; i++) out[i] = cc.labels[i] && cc.sizes[cc.labels[i]] >= opts.minPart * big ? 1 : 0;
    var holes = components(out, w, h, 0);
    for (i = 0; i < w * h; i++) {
      if (out[i]) continue;
      var bx = holes.boxes[holes.labels[i]];
      if (bx[0] > 0 && bx[1] > 0 && bx[2] < w - 1 && bx[3] < h - 1 && holes.sizes[holes.labels[i]] <= opts.maxHole * big) out[i] = 1;
    }
    return out;
  }

  /** Column bands of figure pixels separated by at least minGap empty columns: the sheet's views. */
  function splitViews(mask, w, h, minGap) {
    minGap = minGap || Math.max(4, Math.round(w * 0.01));
    var colHas = new Uint8Array(w);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) if (mask[y * w + x]) colHas[x] = 1;
    var bands = [], start = -1, gap = 0;
    for (x = 0; x < w; x++) {
      if (colHas[x]) { if (start < 0) start = x; gap = 0; }
      else if (start >= 0) { gap++; if (gap >= minGap) { bands.push([start, x - gap]); start = -1; gap = 0; } }
    }
    if (start >= 0) bands.push([start, w - 1 - gap]);
    return bands.map(function (b) {
      var y0 = h, y1 = -1, area = 0;
      for (var y = 0; y < h; y++) for (var x = b[0]; x <= b[1]; x++) if (mask[y * w + x]) { area++; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      return { x0: b[0], x1: b[1], y0: y0, y1: y1, area: area, heightPx: y1 - y0 + 1 };
    }).filter(function (v) { return v.area > 0; });
  }

  /** Runs [x0, x1] (inclusive) of figure pixels in row y between columns a and b. */
  function runs(mask, w, y, a, b) {
    var out = [], s = -1;
    for (var x = a; x <= b; x++) {
      var v = mask[y * w + x];
      if (v && s < 0) s = x;
      if (!v && s >= 0) { out.push([s, x - 1]); s = -1; }
    }
    if (s >= 0) out.push([s, b]);
    return out;
  }

  // ---------- contours ----------
  /**
   * Outer boundary of the component containing the first figure pixel found inside box
   * (or of the whole mask), traced along pixel edges. Returns [[x, y], ...] in pixel-corner units.
   */
  function contour(mask, w, h, box) {
    box = box || [0, 0, w - 1, h - 1];
    var get = function (x, y) { return x >= box[0] && x <= box[2] && y >= box[1] && y <= box[3] && mask[y * w + x] ? 1 : 0; };
    var sx = -1, sy = -1;
    outer: for (var y = box[1]; y <= box[3]; y++) for (var x = box[0]; x <= box[2]; x++) if (get(x, y)) { sx = x; sy = y; break outer; }
    if (sx < 0) return [];
    // Walk with the figure on the right-hand side, starting along the top edge of (sx, sy).
    var pts = [], cx = sx, cy = sy, dir = 0; // dir 0 = +x, 1 = +y, 2 = -x, 3 = -y; (cx, cy) is a pixel corner
    var DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];
    var guard = 0, limit = 8 * (box[2] - box[0] + 2) * (box[3] - box[1] + 2);
    do {
      pts.push([cx, cy]);
      cx += DX[dir]; cy += DY[dir];
      // Pixels ahead-left and ahead-right of the corner, relative to the direction of travel.
      // For direction d, the pixel to the right of the edge we walk is figure, to the left is not.
      for (var turn = 0; turn < 4; turn++) {
        var nd = (dir + 3 + turn) % 4; // try left turn first, then straight, then right, then back
        // edge from (cx, cy) along nd has figure on its right if:
        var rx, ry, lx, ly;
        if (nd === 0) { rx = cx; ry = cy; lx = cx; ly = cy - 1; }
        else if (nd === 1) { rx = cx - 1; ry = cy; lx = cx; ly = cy; }
        else if (nd === 2) { rx = cx - 1; ry = cy - 1; lx = cx - 1; ly = cy; }
        else { rx = cx; ry = cy - 1; lx = cx - 1; ly = cy - 1; }
        if (get(rx, ry) && !get(lx, ly)) { dir = nd; break; }
      }
      if (++guard > limit) break;
    } while (!(cx === sx && cy === sy));
    return pts;
  }

  /** Ramer-Douglas-Peucker simplification of a closed polygon. */
  function simplify(pts, eps) {
    if (pts.length < 4) return pts.slice();
    function rdp(a, b, out) {
      var x0 = pts[a][0], y0 = pts[a][1], x1 = pts[b][0], y1 = pts[b][1];
      var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy) || 1, best = -1, bi = -1;
      for (var i = a + 1; i < b; i++) {
        var dd = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x1 * y0 - y1 * x0) / L;
        if (dd > best) { best = dd; bi = i; }
      }
      if (best > eps) { rdp(a, bi, out); rdp(bi, b, out); } else out.push(pts[a]);
    }
    // Split the loop at the point farthest from the start.
    var far = 0, fd = -1;
    for (var i = 1; i < pts.length; i++) { var d = Math.pow(pts[i][0] - pts[0][0], 2) + Math.pow(pts[i][1] - pts[0][1], 2); if (d > fd) { fd = d; far = i; } }
    var ring = pts.concat([pts[0]]);
    var out = [];
    var save = pts; pts = ring;
    rdp(0, far, out); rdp(far, ring.length - 1, out);
    pts = save;
    return out;
  }

  /** Signed area of a polygon (shoelace). */
  function polyArea(p) {
    var a = 0;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j][0] + p[i][0]) * (p[j][1] - p[i][1]);
    return a / 2;
  }

  /** Rasterise polygons (even-odd, pixel centres) into a mask of size w x h. */
  function polygonMask(polys, w, h) {
    var m = new Uint8Array(w * h);
    (Array.isArray(polys[0][0]) ? polys : [polys]).forEach(function (p) {
      var y0 = h, y1 = 0;
      p.forEach(function (q) { if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; });
      for (var y = Math.max(0, Math.floor(y0)); y <= Math.min(h - 1, Math.ceil(y1)); y++) {
        var yc = y + 0.5, xs = [];
        for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
          var a = p[j], b = p[i];
          if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) xs.push(a[0] + (yc - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
        }
        xs.sort(function (p1, p2) { return p1 - p2; });
        for (var k = 0; k + 1 < xs.length; k += 2) {
          for (var x = Math.max(0, Math.ceil(xs[k] - 0.5)); x <= Math.min(w - 1, Math.floor(xs[k + 1] - 0.5)); x++) m[y * w + x] ^= 1;
        }
      }
    });
    return m;
  }

  // ---------- slicing ----------
  /**
   * Volume of a mask region, in px^3, sliced into rows: each run is an ellipse of width w and
   * depth k(y) * w. k is a number or a function of the row. Exact for any shape whose slices are
   * ellipses of that ratio, including a limb tilted in the picture plane when k is measured
   * perpendicular to the limb: see sliceRotated for that case.
   */
  function sliceRows(mask, w, h, k) {
    var kf = typeof k === 'function' ? k : function () { return k; };
    var v = 0;
    for (var y = 0; y < h; y++) {
      var s = 0, run = 0;
      for (var x = 0; x < w; x++) {
        if (mask[y * w + x]) run++;
        else if (run) { s += run * run; run = 0; }
      }
      if (run) s += run * run;
      if (s) v += Math.PI / 4 * kf(y) * s;
    }
    return v;
  }

  /**
   * Volume of a limb tilted by angleDeg from vertical (positive: lower end to the right), sliced
   * across its own axis. Each pixel is split into 2 x 2 samples and resampled on a half-pixel grid
   * aligned with the limb. Returns px^3.
   */
  function sliceRotated(mask, w, h, k, angleDeg) {
    if (!angleDeg) return sliceRows(mask, w, h, k);
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
    var gw = vmax - vmin + 1, gh = umax - umin + 1;
    var g = new Uint8Array(gw * gh);
    for (var i = 0; i < U.length; i++) g[(U[i] - umin) * gw + (V[i] - vmin)] = 1;
    // Close single-sample gaps along each row.
    for (var r = 0; r < gh; r++) for (var c = 1; c < gw - 1; c++) if (!g[r * gw + c] && g[r * gw + c - 1] && g[r * gw + c + 1]) g[r * gw + c] = 1;
    var kf = typeof k === 'function' ? k : function () { return k; };
    var vol = 0;
    for (r = 0; r < gh; r++) {
      var s = 0, run = 0;
      for (c = 0; c < gw; c++) {
        if (g[r * gw + c]) run++;
        else if (run) { s += (run / 2) * (run / 2); run = 0; }
      }
      if (run) s += (run / 2) * (run / 2);
      vol += Math.PI / 4 * kf(r) * s * 0.5;
    }
    return vol;
  }


  // ---------- front view only ----------
  /** A depth ratio that varies down the figure: points [[row, k], ...], linear between, flat outside. */
  function kProfile(points) {
    var pts = points.slice().sort(function (a, b) { return a[0] - b[0]; });
    return function (y) {
      if (y <= pts[0][0]) return pts[0][1];
      for (var i = 1; i < pts.length; i++) if (y <= pts[i][0]) {
        var a = pts[i - 1], b = pts[i];
        return a[1] + (b[1] - a[1]) * (y - a[0]) / (b[0] - a[0]);
      }
      return pts[pts.length - 1][1];
    };
  }

  /**
   * Volume from one front view, with an assumed depth ratio k (depth / visible width) for each part.
   * figure: mask of the figure; config: {
   *   mPerPx, scale (multiplies every polygon coordinate and profile row; default 1),
   *   parts: [{ name, polygon | polygons, exclude: [polygon, ...], k (number) | kPoints [[row, k]...], angle (deg from vertical),
   *            count (default 1; 2 for an arm counted for both sides), group }],
   *   extras: [{ name, volume_m3, note }]  parts the picture cannot show, carried in as volumes }
   * Returns { parts: [{ name, group, px, volume_m3 }], extras, measured_m3, extras_m3, total_m3 }.
   */
  function frontOnly(figure, w, h, config) {
    var sc = config.scale || 1, m3 = Math.pow(config.mPerPx, 3);
    var scalePoly = function (p) { return p.map(function (q) { return [q[0] * sc, q[1] * sc]; }); };
    var out = { parts: [], extras: [], measured_m3: 0, extras_m3: 0 };
    config.parts.forEach(function (part) {
      var polys = (part.polygons || [part.polygon]).map(scalePoly);
      var region = andMask(figure, polygonMask(polys, w, h));
      (part.exclude || []).forEach(function (ex) {
        var em = polygonMask(scalePoly(ex), w, h);
        for (var i = 0; i < region.length; i++) if (em[i]) region[i] = 0;
      });
      var k = part.kPoints ? kProfile(part.kPoints.map(function (q) { return [q[0] * sc, q[1]]; })) : part.k;
      var v = (part.angle ? sliceRotated(region, w, h, k, part.angle) : sliceRows(region, w, h, k)) * m3 * (part.count || 1);
      out.parts.push({ name: part.name, group: part.group || part.name, px: countMask(region), volume_m3: v });
      out.measured_m3 += v;
    });
    (config.extras || []).forEach(function (e) { out.extras.push(e); out.extras_m3 += e.volume_m3; });
    out.total_m3 = out.measured_m3 + out.extras_m3;
    return out;
  }

  function andMask(a, b) { var o = new Uint8Array(a.length); for (var i = 0; i < a.length; i++) o[i] = a[i] & b[i]; return o; }
  function countMask(a) { var n = 0; for (var i = 0; i < a.length; i++) n += a[i]; return n; }

  return {
    SEG_DEFAULTS: SEG_DEFAULTS, ellipsePerimeter: ellipsePerimeter, median: median,
    backgroundRows: backgroundRows, pushPull: pushPull, components: components, morph: morph, segment: segment,
    splitViews: splitViews, runs: runs, contour: contour, simplify: simplify, polyArea: polyArea,
    polygonMask: polygonMask, sliceRows: sliceRows, kProfile: kProfile, frontOnly: frontOnly, sliceRotated: sliceRotated, andMask: andMask, countMask: countMask
  };
});
