// the duo effort read for each preset, for a few catch states: node presets.js <rex-strength-lab dir> '<states>'
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = process.argv[2], states = JSON.parse(process.argv[3]);
(async () => {
  const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'p-' + path.basename(path.dirname(ROOT)) + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const st of states) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); await settle(page, 'duo-bay');
    const opts = await page.$$eval('#duo-effort option', (os) => os.map((o) => o.value));
    console.log('=== ' + JSON.stringify(st));
    for (const v of opts) { if (v === 'custom') continue; await page.selectOption('#duo-effort', v); await page.waitForTimeout(300); await settle(page, 'duo-bay');
      const t = await page.$eval('#duo-bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' ')); console.log(v + ': ' + t.slice(0, 300)); }
  }
  await browser.close();
})();
