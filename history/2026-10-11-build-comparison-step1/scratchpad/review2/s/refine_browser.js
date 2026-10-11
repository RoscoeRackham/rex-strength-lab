// Time old (whole-sheet) vs new (per-view) refinement in Chromium on the 2,000 px sheet.
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.setContent('<html><body></body></html>');
  const oldSrc = fs.readFileSync(__dirname + '/measure_old.js', 'utf8').replace('if (typeof window !== \'undefined\') window.Measure = api;', 'window.MeasureOld = api;');
  const newSrc = fs.readFileSync(__dirname + '/../tree/build-comparison/src/measure.js', 'utf8');
  await p.addScriptTag({ content: oldSrc }); await p.addScriptTag({ content: newSrc });
  const b64 = fs.readFileSync(__dirname + '/../sheets/big2000.png').toString('base64');
  const r = await p.evaluate(async (b64) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height); const img = { width: c.width, height: c.height, data: d.data };
    const out = {};
    for (const [k, M] of [['old', window.MeasureOld], ['new', window.Measure], ['old2', window.MeasureOld], ['new2', window.Measure]]) { const t = performance.now(); const r = M.measureSheet(img, { heightM: 1.8, heightRef: 'top' }); out[k] = Math.round(performance.now() - t) + ' ms, score ' + r.score.value.toFixed(2); }
    return out;
  }, b64);
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
