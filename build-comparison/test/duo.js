// Validation of the measuring tool on rex-strength-lab/assets/duo.jpg: Rex from the front view
// only, with the old picture measurement's depth ratios, regions and hidden parts
// (data/duo-validation.json). Passes when the volume lands within the old methods' spread
// (2.52-2.60 m^3; the checker's reconciled value is 2.553).
// Headless Chromium decodes the JPEG (Node has no JPEG decoder); the tool itself runs in Node.
// Run from build-comparison/: node test/duo.js   (needs Playwright and its Chromium, like test/shots.js)
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const M = require('../src/measure.js');
const cfg = require('../data/duo-validation.json');

function loadPlaywright() {
  for (const p of [process.env.PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright']) {
    if (p) try { return require(p); } catch (e) { /* next */ }
  }
  return require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}
const CHROME = [process.env.CHROME, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => p && fs.existsSync(p));

/** Decode a JPEG to RGBA with Chromium's own decoder. */
async function decode(file) {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
  try {
    const page = await browser.newPage();
    const src = 'data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64');
    const out = await page.evaluate(async (src) => {
      const img = new Image(); img.src = src; await img.decode();
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let s = ''; for (let i = 0; i < d.length; i += 8192) s += String.fromCharCode.apply(null, d.subarray(i, i + 8192));
      return { width: c.width, height: c.height, b64: btoa(s) };
    }, src);
    return { width: out.width, height: out.height, data: new Uint8ClampedArray(Buffer.from(out.b64, 'base64')) };
  } finally { await browser.close(); }
}

/** The validation itself, on an RGBA image; also used by the page. */
function run(img, segOpts) {
  const seg = M.segment(img, segOpts || {});
  const r = M.frontOnly(seg.mask, img.width, img.height, cfg);
  const groups = {};
  r.parts.forEach((p) => { groups[p.group] = (groups[p.group] || 0) + p.volume_m3; });
  return { result: r, groups };
}

if (require.main === module) {
  (async () => {
    const img = await decode(path.join(__dirname, '..', '..', cfg.image));
    let failed = 0;
    const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) failed++; };
    check(img.width === 720 && img.height === 480, 'duo.jpg decodes at 720 x 480 (' + img.width + ' x ' + img.height + ')');
    const { result, groups } = run(img);
    const [lo, hi] = cfg.expected.spread_m3;
    check(result.total_m3 >= lo && result.total_m3 <= hi, 'Rex from the front view: ' + result.total_m3.toFixed(3) + ' m^3, within the old methods\' spread ' + lo + '-' + hi + ' (checker ' + cfg.expected.total_m3 + ')');
    for (const [g, v] of Object.entries(cfg.expected.parts_m3)) {
      const got = groups[g];
      check(Math.abs(got / v - 1) <= 0.05, '  ' + g + ': ' + got.toFixed(4) + ' m^3 vs the old ' + v + ' (within 5%)');
    }
    // The answer should not hinge on the mask thresholds.
    for (const o of [{ warm: 10 }, { warm: 18 }, { dark: 0.5 }, { refineDist: 20 }, { refineDist: 30 }]) {
      const t = run(img, o).result.total_m3;
      check(Math.abs(t / result.total_m3 - 1) <= 0.02, '  mask thresholds ' + JSON.stringify(o) + ': ' + t.toFixed(3) + ' m^3 (within 2%)');
    }
    console.log(failed ? '\n' + failed + ' failed' : '\nall passed');
    process.exit(failed ? 1 : 0);
  })().catch((e) => { console.error(e); process.exit(1); });
}
module.exports = { decode, run };
