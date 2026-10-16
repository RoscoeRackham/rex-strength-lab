const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.join(__dirname, 'repo/rex-strength-lab/test/make-page-fixture.js'));
(async () => {
  const prev = path.join(__dirname, 'out', 'page-br-narrow-dark.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  await page.goto(pathToFileURL(prev).href);
  for (const [id, st, eff] of [['pullB', { action: 'pull', anchor: 'bolted' }, 'allout'], ['bus10', { duoOpen: true, duoAction: 'catch', cObj: 'bus', cStyle: 'hard', cLogD: 1 }], ['shoveOB', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', oAnchor: 'bolted' }]]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800);
    const bay = st.duoOpen ? 'duo-bay' : 'bay'; await settle(page, bay);
    if (eff) { await page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', eff); await page.waitForTimeout(300); await settle(page, bay); }
    const el = await page.$('#' + bay);
    await el.screenshot({ path: path.join(__dirname, 'out', 'snap-' + id + '.png') });
  }
  await browser.close();
})();
