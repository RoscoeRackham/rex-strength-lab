// Traces Rex's and Ollie's outlines from their A-pose turnarounds for the chart.
// Writes data/duo-outlines.json and, with --overlay DIR, check images of the masks and outlines.
// Run from build-comparison/: node tools/trace_turnarounds.js [--overlay DIR]
//
// Step 1 uses these outlines for drawing only (the brief: style key and outlines; no mass or
// girths from the turnarounds). Rows read by eye are listed in READINGS with what they mark.
'use strict';
const fs = require('fs');
const path = require('path');
const png = require('./png.js');
const M = require('../src/measure.js');

const ROOT = path.join(__dirname, '..');

// Rows and polygons read by eye from 2-4x zoomed, gridded crops (pixel rows of the PNG).
// skull: top of the skull (under Rex's crest spikes; under about 1 cm-equivalent of Ollie's hair
// at his scale, read as the top of the hair line minus about 10 px). top: highest figure pixel
// (Rex's crest tip, Ollie's horn tips) comes from the mask. tail: the hand-drawn region whose
// figure pixels are drawn as the tail, excluded from the score.
const READINGS = {
  rex: {
    file: 'assets/rex-turnaround.png',
    order: ['front', 'back', 'side'],
    ignore: [],
    views: {
      front: { skull: 52, skullRange: [46, 58], tail: [[303, 532], [386, 532], [389, 600], [387, 650], [372, 680], [345, 690], [318, 682], [304, 656], [300, 600]] },
      back: { skull: 52, skullRange: [46, 58], tail: null },
      side: { skull: 57, skullRange: [53, 61], facing: 'left', tail: [[1551, 300], [1940, 300], [1940, 770], [1700, 770], [1650, 690], [1612, 610], [1590, 540], [1578, 470], [1566, 400]] },
    },
  },
  ollie: {
    file: 'assets/ollie-turnaround.png',
    order: ['front', 'back', 'side'],
    ignore: [[0, 795, 1859, 844]], // the FRONT / BACK / SIDE labels
    views: {
      front: { skull: 36, skullRange: [32, 40], tail: null },
      back: { skull: 36, skullRange: [32, 40], tail: [[905, 370], [985, 370], [985, 470], [1050, 470], [1050, 700], [935, 700], [935, 470], [905, 470]] },
      side: { skull: 36, skullRange: [32, 40], facing: 'right', tail: [[1285, 345], [1472, 345], [1470, 372], [1446, 388], [1424, 425], [1412, 470], [1416, 520], [1424, 700], [1285, 700]] },
    },
  },
};

function traceView(mask, w, h, view, tailPoly) {
  const box = [view.x0, view.y0, view.x1, view.y1];
  const tailMask = tailPoly ? M.andMask(mask, M.polygonMask(tailPoly, w, h)) : new Uint8Array(w * h);
  const body = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) body[i] = mask[i] && !tailMask[i] ? 1 : 0;
  // Every body or tail component above 0.5% of the view's area, largest first.
  function polys(m) {
    const cc = M.components(m, w, h, 1), out = [];
    const order = [];
    for (let k = 1; k <= cc.n; k++) {
      const b = cc.boxes[k];
      if (b[0] >= box[0] && b[2] <= box[2] && cc.sizes[k] >= 0.005 * view.area) order.push(k);
    }
    order.sort((a, b) => cc.sizes[b] - cc.sizes[a]);
    for (const k of order) {
      const one = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) if (cc.labels[i] === k) one[i] = 1;
      const c = M.simplify(M.contour(one, w, h, cc.boxes[k]), 0.9);
      out.push({ area_px: cc.sizes[k], points: c });
    }
    return out;
  }
  return { body: polys(body), tail: tailPoly ? polys(tailMask) : [], tailAreaPx: M.countMask(tailMask) };
}

function run(overlayDir) {
  const out = {
    status: 'measured from art (outline only)',
    note: 'Outlines traced from the A-pose turnarounds for drawing. Coordinates are pixels of the source PNG; ground_y is the lowest figure row of the view (it can include 1-3 px of contact shadow). Not used for mass, volume or girths in Step 1.',
    script: 'build-comparison/tools/trace_turnarounds.js',
    characters: {},
  };
  for (const [name, R] of Object.entries(READINGS)) {
    const img = png.read(path.join(ROOT, R.file));
    const seg = M.segment(img, { ignore: R.ignore });
    const views = M.splitViews(seg.mask, img.width, img.height);
    if (views.length !== R.order.length) throw new Error(name + ': found ' + views.length + ' views, expected ' + R.order.length);
    const C = { file: 'build-comparison/' + R.file, width: img.width, height: img.height, views: {} };
    let overlay = null;
    if (overlayDir) overlay = { width: img.width, height: img.height, data: new Uint8ClampedArray(img.data) };
    R.order.forEach((vname, i) => {
      const v = views[i], rd = R.views[vname];
      const t = traceView(seg.mask, img.width, img.height, v, rd.tail);
      // Body midline: median centre of the widest run in rows 30-45% down the figure (the chest).
      const ys = [], cs = [];
      for (let y = Math.round(v.y0 + 0.3 * v.heightPx); y <= Math.round(v.y0 + 0.45 * v.heightPx); y++) {
        const rr = M.runs(seg.mask, img.width, y, v.x0, v.x1);
        if (!rr.length) continue;
        rr.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
        ys.push(y); cs.push((rr[0][0] + rr[0][1] + 1) / 2);
      }
      C.views[vname] = {
        box: [v.x0, v.y0, v.x1, v.y1], top_y: v.y0, ground_y: v.y1 + 1, skull_y: rd.skull, skull_range_y: rd.skullRange,
        mid_x: Math.round(M.median(cs) * 2) / 2, height_px: v.heightPx, area_px: v.area, tail_area_px: t.tailAreaPx,
        facing: rd.facing || null, body: t.body.map((p) => p.points), tail: t.tail.map((p) => p.points), tail_polygon_drawn: rd.tail,
      };
      if (overlay) {
        const tm = rd.tail ? M.polygonMask(rd.tail, img.width, img.height) : null;
        for (let y = v.y0; y <= v.y1; y++) for (let x = v.x0; x <= v.x1; x++) {
          const k = y * img.width + x;
          if (!seg.mask[k]) continue;
          const o = k * 4, isTail = tm && tm[k];
          overlay.data[o] = overlay.data[o] * 0.35 + (isTail ? 40 : 255) * 0.65;
          overlay.data[o + 1] = overlay.data[o + 1] * 0.35 + (isTail ? 200 : 40) * 0.65;
          overlay.data[o + 2] = overlay.data[o + 2] * 0.35 + (isTail ? 255 : 200) * 0.65;
        }
        for (const y of [rd.skull, v.y0, v.y1]) for (let x = v.x0; x <= v.x1; x++) { const o = (y * img.width + x) * 4; overlay.data[o] = 0; overlay.data[o + 1] = 255; overlay.data[o + 2] = 0; }
        for (const poly of t.body.concat(t.tail)) for (const p of poly.points) {
          const x = Math.min(img.width - 1, p[0]), y = Math.min(img.height - 1, p[1]); const o = (y * img.width + x) * 4;
          overlay.data[o] = 255; overlay.data[o + 1] = 255; overlay.data[o + 2] = 0;
        }
      }
    });
    if (overlay) png.write(path.join(overlayDir, name + '-trace.png'), overlay);
    out.characters[name] = C;
  }
  return out;
}

if (require.main === module) {
  const i = process.argv.indexOf('--overlay');
  const dir = i > 0 ? process.argv[i + 1] : null;
  if (dir) fs.mkdirSync(dir, { recursive: true });
  const out = run(dir);
  const file = path.join(ROOT, 'data', 'duo-outlines.json');
  fs.writeFileSync(file, JSON.stringify(out) + '\n');
  for (const [n, c] of Object.entries(out.characters)) {
    for (const [v, d] of Object.entries(c.views)) console.log(n, v, 'height', d.height_px, 'px; skull', d.ground_y - d.skull_y, 'px; points', d.body.reduce((s, p) => s + p.length, 0), '+ tail', d.tail.reduce((s, p) => s + p.length, 0));
  }
  console.log('wrote ' + path.relative(process.cwd(), file) + ' (' + (fs.statSync(file).size / 1024).toFixed(0) + ' KB)');
}
module.exports = { READINGS, run };
