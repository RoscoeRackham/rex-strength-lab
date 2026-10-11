// Target outlines for gap-filler figures: a measured shape with its widths and depths scaled so
// that it scores a chosen target, drawn as a model sheet to the spec (front, side, back; ground
// line, height bar, guide lines at shoulder, chest, waist, crotch and knee; black on white).
// The collaborator uses these as control images for new figures, then measures the result.
//
// Run from build-comparison/:
//   node tools/export_targets.js --score 45 [--build ansur2_m_p50] [--height 1.8] [--px 2000] [--out DIR]
//   node tools/export_targets.js --score 120 --sheet my-sheet.png --sheet-height 2.92 [--skull-rows f,s,b]
// Writes target-<score>-sheet.png, target-<score>-front.png and target-<score>-side.png, and prints
// the measured score of the result (density 1,060 kg/m^3, 7.5% body fat, like Rex and Ollie).
'use strict';
const fs = require('fs');
const path = require('path');
const png = require('./png.js');
const M = require('../src/measure.js');
const Fig = require('../src/figure.js');
const BC = require('../../build-calculator/src/calc.js');

const DENSITY = 1060, FAT = 7.5;

function arg(name, def) { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; }

const ARM_MAX = 88;
/** Front and side parts of a Build Calculator build drawn on the ANSUR II template, widths x f. */
function templateViews(buildId, H, f) {
  const data = require('../../build-calculator/data/builds.json');
  const T = require('../data/outline.json');
  const model = BC.create(data);
  const r = model.compute({ buildId, heightM: H });
  const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
  // Arms at 35 degrees, the middle of the model-sheet A-pose (30-40), or just past where the body
  // lets them rest if that is wider (at most 88: level arms).
  const base = Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  const make = (deg) => Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: deg });
  const armDeg = Math.min(ARM_MAX, Math.max(35, Fig.armRestAngle(make) + 2));
  const fig = make(armDeg);
  const y = base.dims.levels;
  const girths = {}; for (const s of BC.SITES) girths[s] = g[s] * f; // every width and depth times f
  return { fig, armDeg, girths, views: { front: fig.front, side: fig.side }, levels: { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee } };
}

/** Render, then measure with the tool itself: what the tool reads on the whole sheet. */
function measureTemplate(buildId, H, f, px) {
  const t = templateViews(buildId, H, f);
  return measureViews(t.views, H, t.levels, px);
}
/** The levels (guide-line heights) of a drawn figure. */
function levelsOf(fig) { const y = fig.dims.levels; return { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }; }
/**
 * Volume of a drawn figure (m^3): head and body read by the measuring tool, the arms added as limbs
 * along their own axis (Figure.armVolume). The tool cannot follow arms that stand far out, and where
 * an arm meets the shoulder it counts it at torso depth, a few percent high; this avoids both.
 * Throws if any check but the arms check (that sheet has no arms) fails.
 */
function drawnVolume(fig, H, armDeg, px) {
  const r = measureViews(Fig.headAndBody(fig), H, levelsOf(fig), px).res;
  const bad = (r.checks || []).filter((c) => !c.ok && !/arms followed/.test(c.name));
  if (!r.volume_m3 || bad.length) throw new Error('the measuring tool could not read a drawn figure: ' + (r.errors || []).concat(bad.map((c) => c.name)).join('; '));
  return r.volume_m3.value + Fig.armVolume(fig, armDeg);
}
/** Score of a volume at 1,060 kg/m^3 and 7.5% fat (like Rex, Ollie and the limits), height h. */
function leanScore(V, h) { return 1.8 * V * DENSITY * (1 - FAT / 100) / Math.pow(h, 3); }
/** A template's drawn score at width factor f, or NaN if the tool cannot read its head and body. */
function templateScore(buildId, H, f, px) {
  const t = templateViews(buildId, H, f);
  try { return leanScore(drawnVolume(t.fig, H, t.armDeg, px), H); } catch (e) { return NaN; }
}
/** Render views as a sheet and measure it, scaled by the known skull row (a widened trapezius can rise above the head). */
function measureViews(views, H, levels, px) {
  const img = Fig.renderSheet(views, H, levels, { figurePx: px });
  const res = M.measureSheet(img, { heightM: H, heightRef: 'skull', skullRows: Fig.sheetSkullRows(img, H), density: DENSITY, bodyFatPct: FAT, order: ['front', 'side', 'back'], seg: { refine: 0 } });
  return { img, res };
}
/** The measured score, or NaN when the sheet fails the tool's own checks. */
function scoreOrNaN(r) { return r.ok && r.score ? r.score.value : NaN; }


function crop(img, x0, x1) {
  const w = x1 - x0, out = { width: w, height: img.height, data: new Uint8ClampedArray(w * img.height * 4) };
  for (let y = 0; y < img.height; y++) out.data.set(img.data.subarray((y * img.width + x0) * 4, (y * img.width + x1) * 4), y * w * 4);
  return out;
}

function main() {
  const target = Number(arg('score'));
  if (!(target > 0)) { console.error('Give a target score: --score 45'); process.exit(2); }
  const outDir = arg('out', '.'); fs.mkdirSync(outDir, { recursive: true });
  const px = Number(arg('px', 2000));
  let sheet, result;
  if (arg('sheet')) {
    // A measured sheet: widen its own outline.
    const src = png.read(arg('sheet'));
    const H = Number(arg('sheet-height'));
    const rows = arg('skull-rows') ? arg('skull-rows').split(',').map(Number) : null;
    const opts = { heightM: H, heightRef: rows ? 'skull' : 'top', skullRows: rows ? { front: rows[0], side: rows[1], back: rows[2] } : null, density: DENSITY, bodyFatPct: FAT };
    const base = M.measureSheet(src, opts);
    if (!base.mask) { console.error(base.errors.join('\n')); process.exit(1); }
    const views = Object.values(base.views);
    const make = (f) => {
      const m = M.scaleRuns(base.mask, src.width, src.height, views, f);
      const img = { width: src.width, height: src.height, data: new Uint8ClampedArray(src.width * src.height * 4) };
      for (let i = 0; i < m.length; i++) { const v = m[i] ? 0 : 255; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
      return img;
    };
    const scoreOf = (f) => scoreOrNaN(M.measureSheet(make(f), Object.assign({}, opts, { seg: { refine: 0 } })));
    const sol = Fig.solveTarget(scoreOf, target);
    if (sol.f == null) { console.error(noSheet(sol, target)); process.exit(1); }
    const f = sol.f;
    sheet = make(f);
    result = M.measureSheet(sheet, Object.assign({}, opts, { seg: { refine: 0 } }));
    console.log('source sheet scores ' + base.score.value.toFixed(1) + '; widths x ' + f.toFixed(3));
  } else {
    // A template: its drawn score (head and body by the tool, arms as limbs) is solved to the target.
    const buildId = arg('build', 'ansur2_m_p50');
    const H = Number(arg('height', 1.8));
    const sol = Fig.solveTarget((f) => templateScore(buildId, H, f, Math.min(px, 600)), target);
    if (sol.f == null) { console.error(noSheet(sol, target)); process.exit(1); }
    const f = sol.f, t = templateViews(buildId, H, f);
    const drawn = leanScore(drawnVolume(t.fig, H, t.armDeg, Math.min(px, 1000)), H);
    const m = measureTemplate(buildId, H, f, px);
    const other = m.res.checks.filter((c) => !c.ok && !/arms followed/.test(c.name));
    if (other.length) { console.error('The full-size sheet fails a check: ' + other.map((c) => c.name).join('; ')); process.exit(1); }
    sheet = m.img; result = m.res;
    console.log(buildId + ' on the ANSUR II template at ' + H + ' m; widths x ' + f.toFixed(3) + ', arms ' + t.armDeg.toFixed(0) + ' degrees out');
    console.log('drawn score ' + drawn.toFixed(1) + ' (target ' + target + '; head and body by the tool, arms as limbs); drawn girths (m): ' + BC.SITES.map((k) => k + ' ' + t.girths[k].toFixed(3)).join(', '));
    if (!m.res.ok) console.log('NOTE: the measuring tool cannot follow this sheet\'s arms (they cannot hang clear of the body this wide), so it cannot check art drawn from it; it would read ' + (m.res.score ? m.res.score.value.toFixed(0) : 'nothing') + '.');
    else console.log('the measuring tool reads the whole sheet as ' + m.res.score.value.toFixed(1) + ' (it counts each arm at torso depth where it meets the shoulder).');
  }
  const name = 'target-' + target;
  png.write(path.join(outDir, name + '-sheet.png'), sheet);
  const V = result.views;
  const pad = Math.round(0.03 * sheet.width);
  if (V.front) png.write(path.join(outDir, name + '-front.png'), crop(sheet, Math.max(0, V.front.x0 - pad), Math.min(sheet.width, V.front.x1 + pad)));
  if (V.side) png.write(path.join(outDir, name + '-side.png'), crop(sheet, Math.max(0, V.side.x0 - pad), Math.min(sheet.width, V.side.x1 + pad)));
  console.log((arg('sheet') ? 'measured score ' + result.score.value.toFixed(1) + ' (target ' + target + '); ' : '') + 'checks: ' + result.checks.map((c) => (c.ok ? 'ok' : 'FAIL') + ' ' + c.name).join('; '));
  if (result.warnings.length) console.log('notes: ' + result.warnings.join(' | '));
  console.log('wrote ' + ['sheet', 'front', 'side'].map((k) => path.join(outDir, name + '-' + k + '.png')).join(', '));
}

function noSheet(sol, target) {
  const dir = sol.bestScore > target ? 'go no lower than' : 'reach only';
  if (sol.reason === 'gap') return 'No width factor on this base scores between ' + sol.bestScore.toFixed(0) + ' and ' + sol.nextScore.toFixed(0) + ': the reading jumps there.';
  return sol.reason === 'fails' ? 'No passing sheet reaches ' + target + ' on this base: beyond widths x ' + sol.bestF.toFixed(2) + ' (score ' + (sol.bestScore === sol.bestScore ? sol.bestScore.toFixed(0) : '?') + ') the drawing fails the tool\'s own checks.'
    : 'Widths x ' + sol.bestF.toFixed(2) + ' ' + dir + ' ' + sol.bestScore.toFixed(0) + ' on this base.';
}

if (require.main === module) main();
module.exports = { templateViews, measureTemplate, measureViews, scoreOrNaN, drawnVolume, leanScore, templateScore, levelsOf, ARM_MAX };
