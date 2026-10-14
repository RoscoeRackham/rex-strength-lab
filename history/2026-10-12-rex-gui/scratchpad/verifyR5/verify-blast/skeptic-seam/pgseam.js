const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dist = process.argv[2], states = JSON.parse(process.argv[3]);
(async () => {
  const html = fs.readFileSync(dist, 'utf8');
  const f = path.join(__dirname, 'seam-page.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + f);
  const settle = async () => { for (let i = 0; i < 400; i++) { const w = await page.evaluate(() => /working it out/i.test(document.body.textContent)); if (!w) return; await page.waitForTimeout(250); } };
  for (const st of states) {
    const { effort, ...s } = st;
    await page.evaluate(x => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), s);
    await page.reload(); await page.waitForTimeout(800); await settle();
    if (effort) { await page.selectOption('#effort', effort); await page.waitForTimeout(400); await settle(); }
    const t = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
    console.log('==== ' + JSON.stringify(st));
    console.log(t);
  }
  console.log('ERRS', JSON.stringify(errs));
  await browser.close();
})();
