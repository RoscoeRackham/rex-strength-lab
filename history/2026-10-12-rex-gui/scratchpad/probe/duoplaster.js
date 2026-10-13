const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const { settle } = require('../wt/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const body = fs.readFileSync('../wt/rex-strength-lab/dist/index.html', 'utf8');
  fs.writeFileSync('p.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + path.resolve('p.html'));
  for (const [tab, extra] of [['arm', { logKg: 8, oH: 2.4, oM: 1500 }], ['arm', { logKg: 12, oH: 2.4, oM: 1500 }]]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ duoOpen: true, duoAction: tab }, extra));
    await page.reload(); await page.waitForTimeout(800); await settle(page, 'duo-bay');
    await page.selectOption('#duo-effort', 'plaster'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    const t = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
    console.log(tab, JSON.stringify(extra), '=>', t.slice(0, 200));
  }
  await b.close();
})();
