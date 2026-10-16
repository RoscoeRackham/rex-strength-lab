// node timing2.js <dist> : wall time of the Catch tab: load to settled, and picking presets, defaults and real muscle
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dist = process.argv[2];
(async () => {
  const body = fs.readFileSync(dist, 'utf8');
  const prev = path.join(path.dirname(dist), 'tm-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const busy = () => page.evaluate(() => { const b = document.getElementById('duo-bay'); return !b.querySelector('.verdict') || /working it out|Working out/i.test(b.textContent); });
  const waitSettled = async () => { for (let i = 0; i < 600; i++) { if (!(await busy())) return; await page.waitForTimeout(50); } };
  const cases = [['defaults', { duoOpen: true, duoAction: 'catch' }, null], ['real', { duoOpen: true, duoAction: 'catch', mode: 'real' }, null],
    ['real car hard', { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'car', cStyle: 'hard' }, null],
    ['defaults: ground', { duoOpen: true, duoAction: 'catch' }, 'ground'], ['real car hard: ground', { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'car', cStyle: 'hard' }, 'ground'],
    ['real: allout', { duoOpen: true, duoAction: 'catch', mode: 'real' }, 'allout']];
  const out = {};
  for (const [name, st, pre] of cases) {
    const ts = [];
    for (let i = 0; i < 3; i++) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({}, st, pre ? { duoEffort: pre } : {}));
      const t0 = Date.now(); await page.reload(); await page.waitForTimeout(100); await waitSettled(); const tLoad = Date.now() - t0;
      let tPick = null;
      if (pre) { await page.selectOption('#duo-effort', 'least'); await waitSettled(); const t1 = Date.now(); await page.selectOption('#duo-effort', pre); await page.waitForTimeout(30); await waitSettled(); tPick = Date.now() - t1; }
      ts.push(pre ? [tLoad, tPick] : tLoad);
    }
    out[name] = ts;
  }
  console.log(JSON.stringify(out));
  await browser.close();
})();
