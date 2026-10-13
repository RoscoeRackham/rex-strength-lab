const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  await page.goto(pathToFileURL(path.join(__dirname, 'page.html')).href);
  const cases = [
    ['collide-bolted', { duoOpen: true, duoAction: 'collide', anchor: 'bolted' }, null],
    ['catch-rel', { duoOpen: true, duoAction: 'catch', logKg: 20, cObj: 'baseball', cStyle: 'hard', cLogD: 1, airAbsorb: 0.5 }, 'allout'],
  ];
  for (const [id, st, pick] of cases) {
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload(); await page.waitForTimeout(1500);
    for (let i = 0; i < 60; i++) { const b = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)); if (!b) break; await page.waitForTimeout(250); }
    if (pick) { await page.selectOption('#duo-effort', pick); await page.waitForTimeout(1500); }
    const over = await page.evaluate(() => { const out = []; for (const n of document.querySelectorAll('#duo-bay *')) { const r = n.getBoundingClientRect(); if (r.right > document.documentElement.clientWidth + 0.5 && r.width > 0) out.push(n.tagName + '.' + n.className + ':' + Math.round(r.right)); } return out.slice(0, 10); });
    console.log(id, 'overflow', over, await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    const el = await page.$('#duo-bay');
    await el.screenshot({ path: path.join(__dirname, 'duo-' + id + '.png') });
  }
  await browser.close();
})();
