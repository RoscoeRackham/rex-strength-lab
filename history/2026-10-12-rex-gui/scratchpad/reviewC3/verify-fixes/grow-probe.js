// Probe the growth what-if box for a rough rung in each absorb mode.
// usage: node grow-probe.js <dist/index.html> <out.html> [grow ids comma] [modes comma]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const [src, outHtml, growArg, modeArg] = process.argv.slice(2);
  const body = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(outHtml, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(outHtml).href);
  for (const grow of (growArg || 'krakatoa,chicxulub').split(',')) {
    for (const mode of (modeArg || 'gradual,instant,runaway').split(',')) {
      await page.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' })); });
      await page.reload(); await page.waitForTimeout(1500);
      await page.evaluate(() => { document.getElementById('powers').open = true; });
      await page.selectOption('#absorb', mode); await page.waitForTimeout(300);
      await page.click('#grow-what-' + grow); await page.waitForTimeout(800);
      const t = await page.evaluate(() => { const b = document.querySelector('#bay .growth-whatif'); return b ? b.innerText.replace(/ /g, ' ') : '(no box)'; });
      console.log('==== grow=' + grow + ' absorb=' + mode + '\n' + t);
    }
  }
  console.log('errors:', JSON.stringify(errs));
  await browser.close();
})();
