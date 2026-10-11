// Compare the old whole-sheet refinement (3cd65f5) with the new per-view crops (HEAD) on duo.jpg, the turnarounds and the page's example sheet.
const T = process.argv[2], S = process.argv[3];
const fs = require('fs'), path = require('path');
const Mnew = require(T + '/build-comparison/src/measure.js');
const Mold = require(S + '/measure-old.js');
const png = require(T + '/build-comparison/tools/png.js');
const duoT = require(T + '/build-comparison/test/duo.js');
const cfg = require(T + '/build-comparison/data/duo-validation.json');
const Fig = require(T + '/build-comparison/src/figure.js');
const BC = require(T + '/build-calculator/src/calc.js');
const builds = require(T + '/build-calculator/data/builds.json');
const outline = require(T + '/build-comparison/data/outline.json');
function diff(a, b, w) { let n = 0, xs = []; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) { n++; if (xs.length < 5) xs.push([i % w, (i / w) | 0, a[i], b[i]]); } return { n, xs }; }
function count(a) { let n = 0; for (const v of a) n += v; return n; }
(async () => {
  const duo = await duoT.decode(path.join(T, cfg.image));
  let t0 = Date.now(); const so = Mold.segment(duo, {}); const to = Date.now() - t0;
  t0 = Date.now(); const sn = Mnew.segment(duo, {}); const tn = Date.now() - t0;
  const d = diff(so.mask, sn.mask, duo.width);
  console.log('duo.jpg mask px old', count(so.mask), 'new', count(sn.mask), 'differ', d.n, JSON.stringify(d.xs), 'time old', to, 'new', tn);
  console.log('duo views new', JSON.stringify(Mnew.splitViews(sn.mask, duo.width, duo.height)));
  // Volume with the NEW frontOnly on each mask, isolating the refinement change.
  const vo = Mnew.frontOnly(so.mask, duo.width, duo.height, cfg).total_m3, vn = Mnew.frontOnly(sn.mask, duo.width, duo.height, cfg).total_m3;
  const vOldAll = Mold.frontOnly(so.mask, duo.width, duo.height, cfg).total_m3;
  console.log('duo Rex volume: old code', vOldAll.toFixed(4), '| new frontOnly on old mask', vo.toFixed(4), '| new frontOnly on new mask', vn.toFixed(4));
  // Turnarounds
  const R = require(T + '/build-comparison/tools/trace_turnarounds.js').READINGS;
  for (const name of ['rex', 'ollie']) {
    const r = R[name], img = png.read(path.join(T, 'build-comparison', r.file));
    const ex = {}, skull = {};
    for (const v of r.order) { ex[v] = r.views[v].tail ? [r.views[v].tail] : []; skull[v] = r.views[v].skull; }
    const opts = { heightM: 3, skullRows: skull, order: r.order, exclude: ex, seg: { ignore: r.ignore } };
    t0 = Date.now(); const a = Mold.measureSheet(img, opts); const ta = Date.now() - t0;
    t0 = Date.now(); const b = Mnew.measureSheet(img, opts); const tb = Date.now() - t0;
    const dm = diff(a.mask, b.mask, img.width);
    console.log(name, 'mask differ', dm.n, 'of', count(a.mask), JSON.stringify(dm.xs), 'vol old', a.volume_m3.value.toFixed(4), 'new', b.volume_m3.value.toFixed(4), 'ratio', (b.volume_m3.value / a.volume_m3.value).toFixed(5), 'time', ta, tb);
    for (const g of ['chest', 'waist', 'thigh', 'arm_flexed', 'neck']) console.log('   ', g, a.girths[g].value_m && a.girths[g].value_m.toFixed(4), b.girths[g].value_m && b.girths[g].value_m.toFixed(4));
  }
  // The page's example sheet
  const calc = BC.create(builds); const e = calc.compute({ buildId: 'ansur2_m_p50' });
  const g = {}; BC.SITES.forEach((s) => { g[s] = e.girths[s].value; });
  // the page uses model's girths for ansur2_m_p50 (same build) at its own height
  const f = Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  const y = f.dims.levels;
  const img = Fig.renderSheet({ front: f.front, side: f.side }, 1.8, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: 700 });
  const opts = { heightM: 1.8, heightRef: 'top', order: ['front', 'side', 'back'], density: 1060, bodyFatPct: 7.5, armK: 1 };
  const a = Mold.measureSheet(img, opts), b = Mnew.measureSheet(img, opts);
  console.log('example: mask differ', diff(a.mask, b.mask, img.width).n, 'vol', a.volume_m3.value.toFixed(5), b.volume_m3.value.toFixed(5), 'score', a.score.value.toFixed(3), b.score.value.toFixed(3), 'ok', a.ok, b.ok);
})().catch((e) => { console.error(e); process.exit(1); });
