const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const DIR = process.argv[2];
(async () => {
  const prev = path.join(DIR, 'probe.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'duo-bay'); await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(800); await settle(page, 'duo-bay'); };
  const states = [
    { duoOpen: true, duoAction: 'collide', m: 1e21, oM: 1e21, colSrc: 'set', colGB: 4 },
    { duoOpen: true, duoAction: 'collide', m: 1e24, oM: 1e24, colSrc: 'set', colGB: 4 },
    { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 25, cLogD: 2 },
    { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 30, cLogD: 2, airAbsorb: 0.5 },
    { duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', logKg: 34, cLogD: 3, airAbsorb: 0 },
    { duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg: 34, cLogD: 1, airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false },
  ];
  for (const st of states) {
    try { await load(st); } catch (e) { console.log('load fail', JSON.stringify(st), e.message.slice(0, 100)); continue; }
    const t = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/ /g, ' ').replace(/\s+/g, ' '));
    console.log('\n=== ', JSON.stringify(st), 'ovf', await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    const hits = t.match(/[^.]{0,200}(?:the same as|\d× |\d% of |beyond the ladder|no energy to compare|more than any finite)[^.]{0,250}/g) || [];
    for (const h of hits) console.log('  >', h);
  }
  console.log('errs', errs);
  await browser.close();
})();
