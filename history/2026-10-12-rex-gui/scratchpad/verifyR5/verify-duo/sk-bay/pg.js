const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const [,, labDir, stateJson, effort] = process.argv;
(async () => {
  const html = fs.readFileSync(labDir + '/dist/index.html', 'utf8');
  const file = S + '/page-' + Date.now() + '.html';
  fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('file://' + file);
  await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', s); }, stateJson);
  await page.reload();
  await page.waitForTimeout(500);
  if (effort) {
    const sel = await page.$('#duo-effort');
    if (sel) await page.selectOption('#duo-effort', effort);
  }
  for (let i = 0; i < 240; i++) {
    const t = await page.evaluate(() => document.body.innerText);
    if (!/working it out/i.test(t)) break;
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(500);
  // open all details
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => d.open = true));
  const txt = await page.evaluate(() => {
    const bay = document.querySelector('#duo-bay') || document.body;
    return bay.innerText;
  });
  console.log(txt);
  console.log('ERRORS:', errs);
  await browser.close();
  fs.unlinkSync(file);
})();
