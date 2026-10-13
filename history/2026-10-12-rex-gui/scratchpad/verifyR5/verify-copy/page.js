const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync(path.join(__dirname, 'lab/dist/index.html'), 'utf8');
const file = path.join(__dirname, 'page.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = JSON.parse(process.argv[2]);
  for (const st of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(String(e)));
    await page.goto('file://' + file);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st.state);
    await page.reload();
    await page.waitForTimeout(500);
    if (st.effort) await page.selectOption('#effort', st.effort);
    await page.waitForFunction(() => !/working it out/i.test(document.body.innerText), null, { timeout: 120000 });
    await page.waitForTimeout(500);
    const txt = await page.evaluate(() => document.body.innerText);
    const lines = txt.split('\n').filter(l => /spread the push|can bear|supplies|plaster may crack|NaN|undefined|Infinity/i.test(l));
    console.log('=== ', JSON.stringify(st));
    for (const l of lines) console.log('  >', l);
    if (errs.length) console.log('  errors:', errs);
    await page.close();
  }
  await browser.close();
})();
