// usage: node harness.js <html> '<json state list>' [effort] [width]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require(path.resolve(__dirname, '../repo/rex-strength-lab/test/make-page-fixture.js'));
(async () => {
  const html = process.argv[2], states = JSON.parse(process.argv[3]), effort = process.argv[4] || 'allout', w = Number(process.argv[5] || 1280);
  const body = fs.readFileSync(html, 'utf8');
  const prev = path.join(__dirname, 'prev-' + path.basename(path.dirname(path.dirname(html))) + '-' + Date.now() + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  for (const st of states) {
    await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(x)); }, st);
    await page.reload(); await page.waitForTimeout(1000); await settle(page, 'duo-bay');
    if (effort !== 'none') { await page.selectOption('#duo-effort', effort); await page.waitForTimeout(400); await settle(page, 'duo-bay'); }
    const r = await readResult(page, 'duo-bay');
    const full = await page.evaluate(() => document.getElementById('duo-bay').innerText);
    console.log('=== STATE ' + JSON.stringify(st) + ' effort ' + effort);
    if (process.env.FULL) console.log(full); else console.log(JSON.stringify(r, null, 1));
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close(); fs.unlinkSync(prev);
})();
