const fs = require('fs'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const prev = process.argv[2] + '/dist/preview.html';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const [action, logKg, mode] of [['punch', 3, 'comic'], ['punch', 6, 'comic'], ['clap', 3, 'comic'], ['punch', 12, 'comic']]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action, logKg, mode }); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay');
    await page.selectOption('#effort', 'allout'); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => [(t.querySelector('.k') || {}).textContent, (t.querySelector('.v') || {}).textContent]));
    const E = await page.evaluate(() => { const x = Array.from(document.querySelectorAll('#bay .tile')); return x.map((t) => t.querySelector('.v') && t.querySelector('.v').textContent).filter(Boolean); });
    console.log(action, logKg, JSON.stringify(t.filter((x) => /Energy|Compared/.test(x[0]))));
    const lt = await page.evaluate((J) => [0.995, 1, 1.005].map((f) => window.EnergyLadder.compare(J * f, window.DINO_DATA.energyRefs).text), action === 'punch' && logKg === 3 ? 1510 : action === 'clap' ? 2330 : logKg === 6 ? 637e3 : 637e9);
    console.log('   ladder:', JSON.stringify(lt));
    console.log('   rifle short:', await page.evaluate(() => window.DINO_DATA.energyRefs.filter((r) => /rifle/.test(r.short)).map((r) => r.short + ' ' + r.J).join(' | ')));
  }
  await browser.close();
})();
