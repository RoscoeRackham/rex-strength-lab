const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const file = __dirname + '/page.html';
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [[15, 3, 0.5]];
  for (const [logKg, cLogD, airAbsorb] of cases) {
    const page = await browser.newPage();
    await page.goto('file://' + file);
    await page.evaluate((st) => localStorage.setItem('rex-lab-v1', JSON.stringify(st)), { logKg, duoAction: 'catch', duoOpen: true, cObj: 'baseball', cLogD, cStyle: 'hard', airAbsorb, keepForm: true, unbreakable: true, ownRecoil: true });
    await page.reload();
    await page.waitForTimeout(500);
    await page.selectOption('#duo-effort', 'allout');
    for (let i = 0; i < 120; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out/i.test(t)) break; await page.waitForTimeout(500); }
    const t = await page.evaluate(() => document.body.innerText);
    const lines = (t.match(/(It reaches Ollie|One round trip takes)[^\n]{0,60}/g) || []);
    console.log('CASE', logKg.toFixed(3), cLogD.toFixed(3), airAbsorb); for (const l of lines.slice(0, 6)) console.log('  ', l.slice(0, 400));
    await page.close();
  }
  await browser.close();
})();
