// node timing.js <dist> : time the Catch tab's first render and settle, defaults and real muscle
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
  const cases = [['defaults', { duoOpen: true, duoAction: 'catch' }], ['real', { duoOpen: true, duoAction: 'catch', mode: 'real' }], ['real car hard', { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'car', cStyle: 'hard' }], ['bus hard', { duoOpen: true, duoAction: 'catch', cObj: 'bus', cStyle: 'hard' }]];
  const out = {};
  for (const [name, st] of cases) {
    const ts = [];
    for (let i = 0; i < 4; i++) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
      await page.reload(); await page.waitForTimeout(300);
      // time a forced redraw: toggle the effort select to all-out and back to least, measuring the synchronous render
      const t = await page.evaluate(async () => {
        const busy = () => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent);
        const t0 = performance.now(); while (busy()) await new Promise((r) => setTimeout(r, 20)); const tSettle = performance.now() - t0;
        const s = document.getElementById('duo-effort'); const t1 = performance.now(); s.value = 'allout'; s.dispatchEvent(new Event('change', { bubbles: true })); const tAll = performance.now() - t1;
        const t2 = performance.now(); s.value = 'least'; s.dispatchEvent(new Event('change', { bubbles: true })); const tLeast = performance.now() - t2;
        return { tSettle: Math.round(tSettle), tAll: Math.round(tAll), tLeast: Math.round(tLeast) };
      });
      ts.push(t);
    }
    out[name] = ts;
  }
  console.log(JSON.stringify(out));
  await browser.close();
})();
