const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [[0, 0.99], [0, 0.9], [0, 0.5], [45, 0.99]];
  for (const [angle, s] of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const st = { action: 'throw', obj: 'car', angle, logKg: 8, inf: false, surface: 'concrete', anchor: 'friction', airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true };
    await page.addInitScript((st) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); } catch (e) {} }, st);
    await page.goto('file://' + __dirname + '/page.html');
    await page.waitForTimeout(500);
    await page.selectOption('#effort', 'allout').catch(e => console.log('effort select fail', e.message));
    for (let i = 0; i < 120; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out/i.test(t)) break; await page.waitForTimeout(500); }
    const t = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(`out-${angle}-${s}.txt`, t);
    const lines = t.split('\n').filter(l => /Air resistance absorbed: their power takes back|Air blast loud enough|Lands at|from where it lands|from him/.test(l));
    console.log('=== angle', angle, 'share', s); lines.forEach(l => console.log(l));
    await page.close();
  }
  await browser.close();
})();
