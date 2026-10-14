const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
(async () => {
  const body = fs.readFileSync(ROOT + '/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'p.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const cases = [
    { mode: 'real', logKg: 8, duoAction: 'catch', cLogD: 3 },
    { mode: 'real', logKg: 12, duoAction: 'catch', cLogD: 4 },
    { mode: 'real', inf: true, duoAction: 'catch', cLogD: 5 },
    { mode: 'comic', logKg: 9, duoAction: 'catch', cLogD: 5 },
    { mode: 'real', logKg: 8, duoAction: 'collide' },
    { mode: 'real', logKg: 8, duoAction: 'wrestle', wrestleMove: 'throw' },
    { mode: 'real', logKg: 10, duoAction: 'catch', cObj: 'car', cLogD: 4 },
  ];
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, c));
    const t0 = Date.now();
    await page.reload();
    const seen = [];
    for (let i = 0; i < 40; i++) { const t = await page.evaluate(() => document.getElementById('duo-bay').textContent.slice(0, 2000)); seen.push(/working it out/i.test(t) ? 'W' : '.'); await page.waitForTimeout(100); }
    console.log(JSON.stringify(c), seen.join(''), (Date.now() - t0) + ' ms');
  }
  await browser.close();
})();
