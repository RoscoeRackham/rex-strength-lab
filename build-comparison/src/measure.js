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
  else if (root) root.Measure = api; // window.Measure in a page, self.Measure in a worker
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
    // Guide lines (spec: thin horizontal lines at the shoulder, chest, waist, crotch and knee,
    // and the ground line) cross every view. Find them, record their rows and paint them out,
    // bridging the figure where a line crosses it.
    var lineRows = [];
    for (y = 0; y < h; y++) {
      // a guide line runs unbroken across the gaps between views
      var longest = 0, run = 0;
      for (x = 0; x < w; x++) { if (mask[y * w + x]) { run++; if (run > longest) longest = run; } else run = 0; }
      if (longest > 0.6 * w) lineRows.push(y);
    }
    var lines = [];
    lineRows.forEach(function (y) { var last = lines[lines.length - 1]; if (last && y === last.y1 + 1) last.y1 = y; else lines.push({ y0: y, y1: y }); });
    lines = lines.filter(function (l) { return l.y1 - l.y0 + 1 <= Math.max(3, 0.006 * h); });
    if (lines.length) {
      // Paint the lines out of a copy of the picture (blend of the rows just above and below), so
      // the refinement passes see the figure and background without them.
      var copy = new Uint8ClampedArray(d);
      lines.forEach(function (l) {
        var ya = Math.max(0, l.y0 - 1), yb = Math.min(h - 1, l.y1 + 1);
        for (var x = 0; x < w; x++) {
          var above = mask[ya * w + x], below = mask[yb * w + x];
          for (var yy = l.y0; yy <= l.y1; yy++) {
            var t = (yy - ya) / Math.max(1, yb - ya), o = (yy * w + x) * 4;
            for (var c = 0; c < 3; c++) copy[o + c] = d[(ya * w + x) * 4 + c] * (1 - t) + d[(yb * w + x) * 4 + c] * t;
            mask[yy * w + x] = above && below ? 1 : 0;
          }
        }
      });
      img = { width: w, height: h, data: copy };
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
    if (opts.refine) mask = refineViews(img, mask, opts);
    return { mask: mask, width: w, height: h, bg: bg, lines: lines.map(function (l) { return (l.y0 + l.y1) / 2; }) };
  }

  /**
   * The refinement passes, run on each view's own crop (its column band, with a margin that stops
   * halfway to the next view) instead of the whole sheet: the same result for the figure, at a
   * fraction of the time and memory on a large sheet.
   */
  function refineViews(img, mask, opts) {
    var w = img.width, h = img.height, out = new Uint8Array(mask);
    var vs = splitViews(mask, w, h), m = Math.max(16, Math.round(0.02 * Math.max(w, h)));
    vs.forEach(function (v, i) {
      var left = i > 0 ? Math.ceil((vs[i - 1].x1 + v.x0) / 2) : 0, right = i < vs.length - 1 ? Math.floor((v.x1 + vs[i + 1].x0) / 2) : w - 1;
      var x0 = Math.max(left, v.x0 - m), x1 = Math.min(right, v.x1 + m), y0 = Math.max(0, v.y0 - m), y1 = Math.min(h - 1, v.y1 + m);
      var cw = x1 - x0 + 1, ch = y1 - y0 + 1, cd = new Uint8ClampedArray(cw * ch * 4), cm = new Uint8Array(cw * ch);
      for (var y = 0; y < ch; y++) {
        cd.set(img.data.subarray(((y + y0) * w + x0) * 4, ((y + y0) * w + x1 + 1) * 4), y * cw * 4);
        cm.set(mask.subarray((y + y0) * w + x0, (y + y0) * w + x1 + 1), y * cw);
      }
      var crop = { width: cw, height: ch, data: cd };
      for (var pass = 0; pass < opts.refine; pass++) cm = refineMask(crop, cm, opts);
      for (y = 0; y < ch; y++) out.set(cm.subarray(y * cw, (y + 1) * cw), (y + y0) * w + x0);
    });
    return out;
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
   * aligned with the limb. A depth profile k(row) is read at each slice's mean image row. Returns px^3.
   */
  function sliceRotated(mask, w, h, k, angleDeg) {
    if (!angleDeg) return sliceRows(mask, w, h, k);
    var a = angleDeg * Math.PI / 180, sa = Math.sin(a), ca = Math.cos(a);
    var U = [], V = [], Y = [], umin = Infinity, vmin = Infinity, umax = -Infinity, vmax = -Infinity;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (var dx = -0.25; dx <= 0.25; dx += 0.5) for (var dy = -0.25; dy <= 0.25; dy += 0.5) {
        var u = (x + dx) * sa + (y + dy) * ca, v = (x + dx) * ca - (y + dy) * sa;
        var ui = Math.floor(u * 2), vi = Math.floor(v * 2);
        U.push(ui); V.push(vi); Y.push(y);
        if (ui < umin) umin = ui; if (ui > umax) umax = ui; if (vi < vmin) vmin = vi; if (vi > vmax) vmax = vi;
      }
    }
    if (!U.length) return 0;
    var gw = vmax - vmin + 1, gh = umax - umin + 1;
    var g = new Uint8Array(gw * gh), ySum = new Float64Array(gh), yN = new Uint32Array(gh);
    for (var i = 0; i < U.length; i++) { g[(U[i] - umin) * gw + (V[i] - vmin)] = 1; ySum[U[i] - umin] += Y[i]; yN[U[i] - umin]++; }
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
      if (s) vol += Math.PI / 4 * kf(ySum[r] / yN[r]) * s * 0.5;
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


  // ---------- model sheets ----------
  var SIDE_ORDER = ['front', 'side', 'back'];
  // ANSUR II men (data/outline.json): the chest is 0.0216 of stature below the armpit.
  var CHEST_BELOW_ARMPIT = 0.0216;
  var CHEST_HEIGHT = 0.7351; // chest height / stature, ANSUR II men (data/outline.json)
  var TRUNK_SHAPE = { chest: 1.238, waist: 1.054 }; // tape / ellipse(breadth, depth), ANSUR II men (data/outline.json)

  /** Remove polygons (image px) from a mask, in place. */
  function clearPolys(mask, w, h, polys) {
    (polys || []).forEach(function (p) { var m = polygonMask(p, w, h); for (var i = 0; i < m.length; i++) if (m[i]) mask[i] = 0; });
  }

  /** Least-squares line x = a + b y through points [[x, y], ...]. */
  function fitLine(pts) {
    var n = pts.length, sy = 0, sx = 0, syy = 0, sxy = 0;
    pts.forEach(function (p) { sx += p[0]; sy += p[1]; syy += p[1] * p[1]; sxy += p[0] * p[1]; });
    var den = n * syy - sy * sy;
    var b = den ? (n * sxy - sx * sy) / den : 0;
    return { a: (sx - b * sy) / n, b: b };
  }

  /**
   * Landmarks of a front or back view in an A-pose: the rows of the neck, armpits, chest, waist,
   * hips, crotch, thigh, knee, calf and ankle, the arms' axes and widths, and the leg axes.
   * Returns { rows: {...}, arms: [left, right], legs: [left, right], mid, problems: [...] }.
   */
  function frontLandmarks(mask, w, v, skullRow, given) {
    given = given || {};
    var top = v.y0, ground = v.y1, Hp = ground - top + 1, problems = [];
    var skull = skullRow != null ? skullRow : top;
    var R = function (y) { return runs(mask, w, y, v.x0, v.x1); };
    // Midline: centre of the widest run 30-45% down the figure.
    var cs = [];
    for (var y = Math.round(top + 0.30 * Hp); y <= Math.round(top + 0.45 * Hp); y++) {
      var rr = R(y); if (!rr.length) continue;
      rr.sort(function (a, b) { return (b[1] - b[0]) - (a[1] - a[0]); });
      cs.push((rr[0][0] + rr[0][1]) / 2);
    }
    var mid = Math.round(median(cs));
    var torsoRun = function (y) {
      var rr = R(y), best = null, bd = Infinity;
      rr.forEach(function (r) { var dd = r[0] > mid ? r[0] - mid : r[1] < mid ? mid - r[1] : 0; if (dd < bd) { bd = dd; best = r; } });
      return bd === 0 ? best : null;
    };
    // Crotch: the top of the gap between the legs, found upwards from the ground on the midline.
    var crotch = null;
    for (y = ground; y > top + 0.3 * Hp; y--) if (mask[y * w + mid]) { crotch = y; break; }
    if (given.crotch != null) crotch = given.crotch;
    if (crotch === null || (ground - crotch) / Hp < 0.25 || (ground - crotch) / Hp > 0.6) {
      problems.push('crotch not found where expected (is something between the legs, such as a tail?)');
      crotch = Math.round(ground - 0.4815 * Hp);
    }
    // Neck: the narrowest torso run from below the face to a fifth of the way down.
    var neck = null, nw = Infinity;
    for (var yn = Math.round(skull + 0.09 * Hp); yn < Math.round(skull + 0.22 * Hp); yn++) {
      var tn = torsoRun(yn); if (!tn) continue;
      if (tn[1] - tn[0] < nw) { nw = tn[1] - tn[0]; neck = yn; }
    }
    // Armpits: follow the gap between each arm and the torso upwards from the hands. A short
    // contact (an elbow against the lats) is crossed; a long one is the shoulder, and the top of
    // the last stretch of gap below it is the armpit.
    var armpit = [null, null];
    [0, 1].forEach(function (side) {
      var seen = false, topRow = null, merged = 0;
      for (var yy = Math.round(crotch - 0.02 * Hp); yy > (neck || skull + 0.1 * Hp); yy--) {
        var tr = torsoRun(yy); if (!tr) continue;
        var has = R(yy).some(function (r) { return (side === 0 ? r[1] < tr[0] - 1 : r[0] > tr[1] + 1) && r[1] - r[0] > 0.03 * Hp; });
        if (has) { seen = true; topRow = yy; merged = 0; }
        else if (seen && ++merged > 0.06 * Hp) break;
      }
      armpit[side] = topRow;
    });
    if (armpit[0] === null || armpit[1] === null) {
      problems.push('arm-to-torso gap not found on ' + (armpit[0] === null && armpit[1] === null ? 'either side' : armpit[0] === null ? 'the left of the picture' : 'the right of the picture') + ' (arms must clear the torso)');
    }
    var pit = Math.round(median(armpit.filter(function (a) { return a !== null; }).concat(armpit[0] === null && armpit[1] === null ? [skull + 0.243 * Hp] : [])));
    // Chest: at the ANSUR II proportion of the skull-top height (0.735 above the ground), since a
    // heavily muscled arm can hide the armpit; a guide line or a typed row overrides it.
    var Hs = ground + 1 - skull;
    var chest = given.chest != null ? given.chest : Math.round(ground + 1 - CHEST_HEIGHT * Hs);
    var widthAt = function (y) { var t = torsoRun(y); return t ? t[1] - t[0] + 1 : 0; };
    var waist = null, ww = Infinity;
    for (y = Math.round(chest + 0.05 * Hp); y < crotch - 0.05 * Hp; y++) { var wv = widthAt(y); if (wv && wv < ww) { ww = wv; waist = y; } }
    if (given.waist != null) waist = given.waist;
    var hip = null, hw = 0;
    for (y = waist || chest; y < crotch; y++) { var hv = widthAt(y); if (hv > hw) { hw = hv; hip = y; } }
    // Legs: the two runs either side of the midline below the crotch.
    var legRuns = function (y) {
      var rr = R(y), left = null, right = null;
      rr.forEach(function (r) {
        var c = (r[0] + r[1]) / 2;
        if (c < mid && (!left || (r[1] - r[0]) > (left[1] - left[0]))) left = r;
        if (c >= mid && (!right || (r[1] - r[0]) > (right[1] - right[0]))) right = r;
      });
      return [left, right];
    };
    var legW = function (y) { var lr = legRuns(y); var a = lr[0] ? lr[0][1] - lr[0][0] + 1 : 0, b = lr[1] ? lr[1][1] - lr[1][0] + 1 : 0; return a && b ? (a + b) / 2 : Math.max(a, b); };
    var argBand = function (y0, y1, wantMax) {
      var best = null, bv = wantMax ? -Infinity : Infinity;
      for (var yy = Math.round(y0); yy <= Math.round(y1); yy++) { var lw = legW(yy); if (!lw) continue; if (wantMax ? lw > bv : lw < bv) { bv = lw; best = yy; } }
      return best;
    };
    var thigh = Math.round(crotch + 0.02 * Hp);
    var knee = given.knee != null ? given.knee : argBand(ground - 0.33 * Hp, ground - 0.22 * Hp, false);
    var calf = argBand((knee || ground - 0.28 * Hp) + 0.02 * Hp, ground - 0.10 * Hp, true);
    var ankle = argBand(ground - 0.10 * Hp, ground - 0.03 * Hp, false);
    // Arms: the run outside the torso run, from the armpit down to the fingertips.
    var arms = [0, 1].map(function (side) {
      var start = armpit[side];
      if (start === null) return null;
      var pts = [], widths = [];
      for (var yy = start + 1; yy < ground; yy++) {
        var tr = torsoRun(yy), rr = R(yy), arm = null;
        rr.forEach(function (r) {
          var outside = tr ? (side === 0 ? r[1] < tr[0] - 1 : r[0] > tr[1] + 1) : (side === 0 ? r[1] < mid : r[0] > mid);
          if (!outside) return;
          // below the crotch, ignore the legs: the arm is the run farthest out
          if (!arm || (side === 0 ? r[0] < arm[0] : r[1] > arm[1])) arm = r;
        });
        if (yy > crotch) {
          var lr = legRuns(yy), leg = lr[side];
          if (arm && leg && arm[0] === leg[0]) arm = null;
        }
        if (!arm) { if (pts.length > 0.1 * Hp) break; else continue; }
        pts.push([(arm[0] + arm[1]) / 2, yy]); widths.push([yy, arm[1] - arm[0] + 1]);
      }
      if (pts.length < 0.1 * Hp) return null;
      var line = fitLine(pts), ang = Math.atan(line.b), c = Math.cos(ang);
      var span = pts[pts.length - 1][1] - start;
      var perp = function (f0, f1, wantMax) {
        var best = null;
        widths.forEach(function (q) {
          var f = (q[0] - start) / span; if (f < f0 || f > f1) return;
          var wp = q[1] * c;
          if (!best || (wantMax ? wp > best.w : wp < best.w)) best = { row: q[0], w: wp, runW: q[1] };
        });
        return best;
      };
      return { side: side === 0 ? 'picture-left' : 'picture-right', armpit: start, end: pts[pts.length - 1][1], angleDeg: ang * 180 / Math.PI,
        upper: perp(0, 0.3, true), elbow: perp(0.25, 0.45, false), fore: perp(0.4, 0.6, true), wrist: perp(0.62, 0.8, false), line: line };
    });
    return { mid: mid, top: top, ground: ground, Hp: Hp, rows: { neck: neck, armpit: pit, armpitL: armpit[0], armpitR: armpit[1], chest: chest, waist: waist, hip: hip, crotch: crotch, thigh: thigh, knee: knee, calf: calf, ankle: ankle },
      arms: arms, legRuns: legRuns, torsoRun: torsoRun, problems: problems };
  }

  /** Widest run of a side view at a row (the body's depth there). */
  function sideDepth(mask, w, v, y) {
    if (y < v.y0 || y > v.y1) return 0;
    var rr = runs(mask, w, Math.round(y), v.x0, v.x1), best = 0;
    rr.forEach(function (r) { if (r[1] - r[0] + 1 > best) best = r[1] - r[0] + 1; });
    return best;
  }

  /**
   * Measure a model sheet: front, side and back views of one figure at one scale.
   * opts: { heightM, heightRef: 'skull' | 'top', skullRows: { front, side, back } (image rows; needed
   *   for 'skull'), order: view order left to right (default front, side, back), density (kg/m^3),
   *   bodyFatPct, armK (arm depth / width, default 1), fullness (torso sections vs ellipses,
   *   default 1), exclude: { front: [poly], side: [poly], back: [poly] } (tails), seg: segment opts,
   *   name }
   */
  function measureSheet(img, opts) {
    opts = opts || {};
    var w = img.width, h = img.height;
    var seg = segment(img, opts.seg);
    var mask = seg.mask;
    var views = splitViews(mask, w, h);
    var out = { ok: true, errors: [], warnings: [], checks: [], guideLines: seg.lines };
    // A height bar is a view much narrower than it is tall: set it aside.
    var bars = views.filter(function (v) { return (v.x1 - v.x0 + 1) < 0.05 * v.heightPx; });
    views = views.filter(function (v) { return bars.indexOf(v) < 0; });
    if (bars.length) out.heightBar = bars[0];
    var order = opts.order || SIDE_ORDER;
    if (views.length < 2) {
      out.ok = false;
      out.errors.push(views.length === 0 ? 'No figure stood out from the background. The tool needs the figure darker, warmer or a different colour than the sheet, and a clear margin at the left and right edges, where it samples the background.'
        : 'Found 1 view; a sheet needs a front and a side view (and ideally a back view), side by side with a gap between them. Views that touch each other or the sheet edge read as one.');
      return out;
    }
    if (views.length !== order.length) out.warnings.push('Found ' + views.length + ' views; expected ' + order.length + ' (' + order.join(', ') + ').');
    var V = {};
    order.forEach(function (name, i) { if (views[i]) V[name] = views[i]; });
    if (!V.front || !V.side) { out.ok = false; out.errors.push('No front or side view in the expected order (' + order.join(', ') + ').'); return out; }
    Object.keys(V).forEach(function (name) { clearPolys(mask, w, h, (opts.exclude || {})[name]); });
    // Re-measure the boxes after exclusions.
    Object.keys(V).forEach(function (name) {
      var v = V[name], y0 = h, y1 = -1, area = 0;
      for (var y = v.y0; y <= v.y1; y++) for (var x = v.x0; x <= v.x1; x++) if (mask[y * w + x]) { area++; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      v.y0 = y0; v.y1 = y1; v.area = area; v.heightPx = y1 - y0 + 1;
    });
    // Typed skull-top rows must lie in the head of their view: at or below the figure's top pixel
    // (horns and crests rise above the skull) and within the top fifth of the figure.
    if (opts.heightRef !== 'top' && opts.skullRows) {
      Object.keys(V).forEach(function (name) {
        var r = opts.skullRows[name], v = V[name];
        if (r == null) return;
        var lim = Math.round(v.y0 + 0.2 * (v.y1 - v.y0));
        if (!(r >= v.y0 && r <= lim)) out.errors.push('The skull-top row for the ' + name + ' view, ' + r + ', is outside its head (rows ' + v.y0 + ' to ' + lim + ').');
      });
      if (out.errors.length) { out.ok = false; out.views = V; return out; }
    }
    // Heights and scale
    var ref = opts.heightRef === 'top' ? 'top' : 'skull';
    var topOf = function (name) {
      var sr = (opts.skullRows || {})[name];
      return ref === 'skull' && sr != null ? sr : V[name].y0;
    };
    if (ref === 'skull' && !(opts.skullRows && opts.skullRows.front != null)) { out.warnings.push('No skull-top row given: the height is taken to the top of the figure.'); ref = 'top'; }
    var hpx = {};
    Object.keys(V).forEach(function (name) { hpx[name] = V[name].y1 + 1 - topOf(name); });
    var hs = Object.keys(hpx).map(function (k) { return hpx[k]; });
    var spread = Math.max.apply(null, hs) / Math.min.apply(null, hs) - 1;
    out.checks.push({ name: 'view heights agree within 2%', ok: spread <= 0.02, detail: Object.keys(hpx).map(function (k) { return k + ' ' + hpx[k] + ' px'; }).join(', ') + ' (spread ' + (100 * spread).toFixed(1) + '%)' });
    var grounds = Object.keys(V).map(function (k) { return V[k].y1; });
    var gSpread = Math.max.apply(null, grounds) - Math.min.apply(null, grounds);
    out.checks.push({ name: 'one shared ground line (within 1% of the height)', ok: gSpread <= 0.01 * hpx.front, detail: 'lowest rows ' + Object.keys(V).map(function (k) { return k + ' ' + V[k].y1; }).join(', ') });
    var mPerPx = opts.heightM / hpx.front;
    if (hpx.front < 2000) out.warnings.push('The figure is ' + hpx.front + ' px tall; the sheet spec asks for at least 2,000 px. Edges count for more at low resolution.');
    out.scale = { mPerPx: mPerPx, heightPx: hpx.front, heightM: opts.heightM, heightRef: ref };
    // Landmarks
    // Landmark rows: typed rows win, then the sheet's guide lines (shoulder, chest, waist, crotch,
    // knee, top to bottom, above the ground line), then detection.
    var given = Object.assign({}, opts.rows || {});
    var inside = (seg.lines || []).filter(function (y) { return y > V.front.y0 + 0.05 * hpx.front && y < V.front.y1 - 0.02 * hpx.front; }).sort(function (a, b) { return a - b; });
    if (inside.length === 5) {
      ['shoulder', 'chest', 'waist', 'crotch', 'knee'].forEach(function (k, i) { if (given[k] == null) given[k] = Math.round(inside[i]); });
      out.landmarkSource = 'guide lines on the sheet';
    } else {
      out.landmarkSource = Object.keys(given).length ? 'typed rows, then detection' : 'detected from the outline';
      if (inside.length) out.warnings.push('Found ' + inside.length + ' guide line(s); expected 5 (shoulder, chest, waist, crotch, knee), so they were not used.');
    }
    var F = frontLandmarks(mask, w, V.front, (opts.skullRows || {}).front, given);
    F.problems.forEach(function (p) { out.warnings.push('Front view: ' + p); });
    var Fdet = Object.keys(given).length ? frontLandmarks(mask, w, V.front, (opts.skullRows || {}).front) : F;
    var B = V.back ? frontLandmarks(mask, w, V.back, (opts.skullRows || {}).back) : null;
    if (B) B.problems.forEach(function (p) { out.warnings.push('Back view: ' + p); });
    var shiftSide = V.side.y1 - V.front.y1;
    if (B) {
      var tol = 0.02 * F.Hp, bad = [];
      ['neck', 'armpit', 'waist', 'crotch', 'knee'].forEach(function (k) {
        var a = Fdet.rows[k] - V.front.y1, b = B.rows[k] - V.back.y1;
        if (a == null || b == null || isNaN(a) || isNaN(b) || Math.abs(a - b) > tol) bad.push(k + ' (front ' + Fdet.rows[k] + ', back ' + B.rows[k] + ')');
      });
      out.checks.push({ name: 'front and back landmarks line up (within 2% of the height)', ok: bad.length === 0, detail: bad.length ? 'off: ' + bad.join(', ') : 'neck, armpits, waist, crotch and knees agree' });
    }
    // Side neck: the narrowest depth between the head and the chest
    var sn = null, snw = Infinity;
    var sideSkull = (opts.skullRows || {}).side != null ? opts.skullRows.side : V.side.y0;
    for (var y = Math.round(sideSkull + 0.09 * F.Hp); y < Math.round(sideSkull + 0.22 * F.Hp); y++) { var dw = sideDepth(mask, w, V.side, y); if (dw && dw < snw) { snw = dw; sn = y; } }
    if (sn !== null && F.rows.neck !== null) {
      var off = Math.abs((sn - shiftSide) - F.rows.neck);
      out.checks.push({ name: 'side-view neck lines up with the front view (within 3% of the height)', ok: off <= 0.03 * F.Hp, detail: 'front ' + F.rows.neck + ', side ' + sn + ' (' + (100 * off / F.Hp).toFixed(1) + '%)' });
    }
    // The view in the side position must look like a side view. A back view taken as the side (a
    // sheet with front and back views only) is as wide as the front, so its depth / width is near 1;
    // a real side view gives about 0.7 at the waist and 0.6 at the hips.
    var cx = (V.front.x0 + V.front.x1) / 2;
    var ratioAt = function (y) {
      if (y == null || isNaN(y)) return null;
      y = Math.round(y);
      var tw = 0; runs(mask, w, y, V.front.x0, V.front.x1).forEach(function (q) { if (q[0] <= cx && q[1] >= cx) tw = q[1] - q[0] + 1; });
      var sd = sideDepth(mask, w, V.side, y + shiftSide);
      return tw && sd ? sd / tw : null;
    };
    var rW = ratioAt(F.rows.waist), rH = F.rows.waist != null && F.rows.crotch != null ? ratioAt((F.rows.waist + 2 * F.rows.crotch) / 3) : null;
    if (rW != null && rH != null) out.checks.push({ name: 'the side view is a side view (narrower than the front at the waist and hips)', ok: !(rW > 0.92 && rH > 0.92), detail: 'depth ÷ front width ' + rW.toFixed(2) + ' at the waist, ' + rH.toFixed(2) + ' at the hips; a front or back view in the side position gives about 1' });
    out.checks.forEach(function (c) { if (!c.ok) { out.ok = false; out.errors.push('Rejected: ' + c.name + ' failed. ' + c.detail); } });
    out.landmarks = { front: F.rows, back: B ? B.rows : null, sideNeck: sn, arms: F.arms, skull: ref === 'skull' ? topOf('front') : null };
    if (F.rows.armpit != null && F.rows.chest < F.rows.armpit - 0.02 * F.Hp) out.warnings.push('The arms touch the torso at the chest row, so the chest width there includes the arms: the chest girth reads high.');
    out.warnings.push('Side view: the depth at each row is the widest run. If the near arm overlaps the torso, chest and waist depths include it (the sheet spec asks for a side view without the near arm).');

    // Volume: torso, head and legs from front width x side depth; arms from their own width.
    var armK = opts.armK || 1, fullness = opts.fullness || 1;
    function volume(m) {
      var vol = { head: 0, torso: 0, legs: 0, arms: 0 };
      for (var y = V.front.y0; y <= V.front.y1; y++) {
        var rr = runs(m, w, y, V.front.x0, V.front.x1); if (!rr.length) continue;
        var depth = sideDepth(m, w, V.side, y + shiftSide);
        var tr = F.torsoRun(y);
        rr.forEach(function (r) {
          var wd = r[1] - r[0] + 1;
          var isArm = false;
          F.arms.forEach(function (a) { if (!a || y <= a.armpit || y > a.end) return; var ax = a.line.a + a.line.b * y; if (ax >= r[0] - 2 && ax <= r[1] + 2 && !(tr && r[0] === tr[0])) isArm = true; });
          if (y > F.rows.crotch) { var lr = F.legRuns(y); if ((lr[0] && r[0] === lr[0][0]) || (lr[1] && r[0] === lr[1][0])) isArm = false; }
          if (isArm) {
            var a0 = F.arms.filter(Boolean)[0], c = Math.cos(((a0 && a0.angleDeg) || 0) * Math.PI / 180);
            F.arms.forEach(function (a) { if (a) { var ax = a.line.a + a.line.b * y; if (ax >= r[0] - 2 && ax <= r[1] + 2) c = Math.cos(a.angleDeg * Math.PI / 180); } });
            vol.arms += Math.PI / 4 * wd * wd * armK * c;
          } else {
            var part = y < (F.rows.neck || F.top) ? 'head' : y <= F.rows.crotch ? 'torso' : 'legs';
            vol[part] += Math.PI / 4 * wd * Math.min(depth, 4 * wd) * (part === 'torso' ? fullness : 1);
          }
        });
      }
      var m3 = Math.pow(mPerPx, 3);
      Object.keys(vol).forEach(function (k) { vol[k] *= m3; });
      vol.total = vol.head + vol.torso + vol.legs + vol.arms;
      return vol;
    }
    var vc = volume(mask);
    var vLo = volume(morph(mask, w, h, false)).total, vHi = volume(morph(mask, w, h, true)).total;
    // Relative uncertainty, combined in quadrature: mask edge (+/- 1 px), ellipse vs real sections
    // (up to +7% on the torso), arm depth ratio (+/- 15% on the arms).
    var eEdge = (vHi - vLo) / 2 / vc.total, eShape = 0.07 * vc.torso / vc.total, eArm = 0.15 * vc.arms / vc.total;
    var eTot = Math.sqrt(eEdge * eEdge + eShape * eShape + eArm * eArm);
    out.volume_m3 = { value: vc.total, low: vc.total * (1 - eTot), high: vc.total * (1 + eTot), parts: vc, note: 'mask edge +/-1 px, section shape (ellipse vs real, up to 7% on the torso) and arm depth (+/-15%), combined' };
    var rho = opts.density || 1060, bf = opts.bodyFatPct != null ? opts.bodyFatPct : 7.5, Hm = opts.heightM;
    var mass = function (v) { return v * rho; };
    out.mass_kg = { value: mass(vc.total), low: mass(out.volume_m3.low), high: mass(out.volume_m3.high), density: rho };
    var ffm = function (v) { return mass(v) * (1 - bf / 100); };
    out.ffm_kg = ffm(vc.total);
    out.score = { value: 1.8 * ffm(vc.total) / Math.pow(Hm, 3), low: 1.8 * ffm(out.volume_m3.low) / Math.pow(Hm, 3), high: 1.8 * ffm(out.volume_m3.high) / Math.pow(Hm, 3), bodyFatPct: bf };
    out.ffmi = ffm(vc.total) / (Hm * Hm);
    if (ref === 'top') out.warnings.push('The height is to the top of the figure, not the skull: the chart scores use the top of the skull.');

    // Girths
    var gir = {}, pm = mPerPx;
    var ell = function (wd, dp) { return ellipsePerimeter(wd * pm, dp * pm); };
    // A tape follows a trunk section that is boxier than an ellipse: in ANSUR II men the chest tape
    // is 1.238 times the perimeter of the ellipse with the chest breadth and depth, the waist 1.054
    // (data/outline.json, sections.*.girth_over_ellipse). opts.shape: false turns this off.
    var shape = opts.shape === false ? {} : (opts.shapeFactors || TRUNK_SHAPE);
    var site = function (name, wd, dp, row, note) {
      if (!wd || !dp) { gir[name] = { value_m: null, note: 'not found' }; return; }
      var e = ell(wd, dp), k = shape[name] || 1, g = e * k;
      gir[name] = { value_m: g, low_m: g * 0.9, high_m: g * 1.1, width_m: wd * pm, depth_m: dp * pm, ellipse_m: e, shape_factor: k, row: row,
        note: note + (k !== 1 ? '; times ' + k + ', the ANSUR II ratio of the tape to that ellipse' : '') };
    };
    var tw = function (y) { var t = y != null ? F.torsoRun(y) : null; return t ? t[1] - t[0] + 1 : 0; };
    site('chest', tw(F.rows.chest), sideDepth(mask, w, V.side, F.rows.chest + shiftSide), F.rows.chest, 'front width at the chest row x side depth; the side depth may include the near arm');
    // ANSUR's chest breadth is a caliper pressed to the rib cage, so its 1.238 factor is validated
    // only for that width; a drawn outline that shows the lats is wider and reads high.
    if (gir.chest.value_m) { gir.chest.low_m = gir.chest.value_m * 0.8; gir.chest.note += '. Unvalidated for outlines that include the lats: those read high, so the likely range runs 20% down'; }
    site('waist', tw(F.rows.waist), sideDepth(mask, w, V.side, F.rows.waist + shiftSide), F.rows.waist, 'narrowest torso width x side depth');
    site('neck', tw(F.rows.neck), snw < Infinity ? snw : 0, F.rows.neck, 'narrowest torso width under the head x narrowest side depth');
    var legW = function (y) { var lr = F.legRuns(y); var a = lr[0] ? lr[0][1] - lr[0][0] + 1 : 0, b = lr[1] ? lr[1][1] - lr[1][0] + 1 : 0; return a && b ? (a + b) / 2 : Math.max(a, b); };
    site('thigh', legW(F.rows.thigh), sideDepth(mask, w, V.side, F.rows.thigh + shiftSide), F.rows.thigh, 'leg width just below the crotch x side depth (a hand beside the thigh in the side view adds to it)');
    site('calf', legW(F.rows.calf), sideDepth(mask, w, V.side, F.rows.calf + shiftSide), F.rows.calf, 'widest lower leg x side depth');
    var armSite = function (key, name, note) {
      var ws = F.arms.filter(function (a) { return a && a[key]; }).map(function (a) { return a[key].w; });
      if (!ws.length) { gir[name] = { value_m: null, note: 'not found' }; return; }
      var wd = ws.reduce(function (s, x) { return s + x; }, 0) / ws.length;
      site(name, wd, wd * armK, null, note);
    };
    armSite('upper', 'arm_flexed', 'widest upper arm across its axis, depth = ' + armK + ' x width; an A-pose arm is relaxed, not flexed');
    armSite('fore', 'forearm', 'widest forearm across its axis, depth = ' + armK + ' x width');
    out.girths = gir;
    // Segment lengths
    var L = {}, rows = F.rows, row2m = function (a, b) { return a != null && b != null ? Math.abs(b - a) * pm : null; };
    L.head = row2m(topOf('front'), rows.neck);
    L.neck_to_crotch = row2m(rows.neck, rows.crotch);
    L.crotch_height = row2m(rows.crotch, V.front.y1 + 1);
    L.thigh = row2m(rows.crotch, rows.knee);
    L.shank = row2m(rows.knee, rows.ankle);
    L.ankle_height = row2m(rows.ankle, V.front.y1 + 1);
    var a1 = F.arms.filter(Boolean)[0];
    if (a1 && a1.elbow && a1.wrist) {
      var c1 = Math.cos(a1.angleDeg * Math.PI / 180);
      L.armpit_to_elbow = (a1.elbow.row - a1.armpit) * pm / c1;
      L.elbow_to_wrist = (a1.wrist.row - a1.elbow.row) * pm / c1;
      L.wrist_to_fingertip = (a1.end - a1.wrist.row) * pm / c1;
      L.arm_angle_deg = Math.abs(a1.angleDeg);
    }
    out.lengths = L;
    var fa = 0;
    for (var yy = V.front.y0; yy <= V.front.y1; yy++) for (var xx = V.front.x0; xx <= V.front.x1; xx++) fa += mask[yy * w + xx];
    out.frontal_area_m2 = fa * pm * pm;
    out.views = V;
    out.mask = mask;
    out.frontLandmarks = F;
    return out;
  }


  // ---------- target outlines ----------
  /**
   * Widen (f > 1) or narrow every run of figure pixels about its own centre, row by row, inside
   * each view box: widths and depths scale by f, heights stay. Returns a new mask.
   */
  function scaleRuns(mask, w, h, views, f) {
    var out = new Uint8Array(w * h);
    views.forEach(function (v) {
      var lo = Math.max(0, Math.floor(v.x0 - (f - 1) * (v.x1 - v.x0))), hi = Math.min(w - 1, Math.ceil(v.x1 + (f - 1) * (v.x1 - v.x0)));
      for (var y = v.y0; y <= v.y1; y++) {
        runs(mask, w, y, v.x0, v.x1).forEach(function (r) {
          var c = (r[0] + r[1] + 1) / 2, half = (r[1] - r[0] + 1) / 2 * f;
          for (var x = Math.max(lo, Math.round(c - half)); x < Math.min(hi + 1, Math.round(c + half)); x++) out[y * w + x] = 1;
        });
      }
    });
    return out;
  }

  function andMask(a, b) { var o = new Uint8Array(a.length); for (var i = 0; i < a.length; i++) o[i] = a[i] & b[i]; return o; }
  function countMask(a) { var n = 0; for (var i = 0; i < a.length; i++) n += a[i]; return n; }

  return {
    SEG_DEFAULTS: SEG_DEFAULTS, ellipsePerimeter: ellipsePerimeter, median: median,
    backgroundRows: backgroundRows, pushPull: pushPull, components: components, morph: morph, segment: segment,
    splitViews: splitViews, runs: runs, contour: contour, simplify: simplify, polyArea: polyArea,
    polygonMask: polygonMask, clearPolys: clearPolys, fitLine: fitLine, frontLandmarks: frontLandmarks, sideDepth: sideDepth, measureSheet: measureSheet, scaleRuns: scaleRuns, TRUNK_SHAPE: TRUNK_SHAPE, sliceRows: sliceRows, kProfile: kProfile, frontOnly: frontOnly, sliceRotated: sliceRotated, andMask: andMask, countMask: countMask
  };
});
