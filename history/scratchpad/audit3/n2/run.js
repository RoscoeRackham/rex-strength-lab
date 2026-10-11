const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const dir = __dirname;
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(dir, 'preview.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'default', st: null },
    { name: 'comic-jump', st: { logKg: 6, mode: 'comic', action: 'jump', groundHolds: true } },
    { name: 'real-jump', st: { logKg: 6, mode: 'real', action: 'jump', groundHolds: true } },
    { name: 'comic-punch', st: { logKg: 6, mode: 'comic', action: 'punch', groundHolds: true, anchor: 'bolted' } },
    { name: 'comic-throw', st: { logKg: 6, mode: 'comic', action: 'throw', groundHolds: true, anchor: 'bolted' } },
  ];
  for (const cs of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((st) => { try { localStorage.clear(); if (st) localStorage.setItem('rex-lab-v1', JSON.stringify(st)); } catch (e) {} }, cs.st);
    await page.goto('file://' + prev);
    await page.waitForTimeout(5000);
    // open all details
    await page.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = true; });
    await page.waitForTimeout(300);
    const txt = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(dir, cs.name + '.txt'), txt);
    const ls = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
    console.log('==', cs.name, ls);
    await ctx.close();
  }
  await browser.close();
})();
