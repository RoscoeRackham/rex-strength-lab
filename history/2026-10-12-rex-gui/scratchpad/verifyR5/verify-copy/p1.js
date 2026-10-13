const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const file = __dirname + '/page.html';
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const cases = [
  { obj: 'loco', surface: 'granite', logKg: 14 },
  { obj: 'car', surface: 'granite', logKg: 14 },
  { obj: 'loco', surface: 'granite', logKg: 14, m: 3e9 },
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const c of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file://' + file);
    await page.evaluate((c) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ action: 'pull', anchor: 'friction', ownRecoil: false, airAbsorb: 1, keepForm: true, unbreakable: true, inf: false }, c))), c);
    await page.reload();
    await page.waitForSelector('#effort');
    await page.selectOption('#effort', 'allout');
    for (let i = 0; i < 120; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out/i.test(t)) break; await page.waitForTimeout(500); }
    const t = await page.evaluate(() => document.body.innerText);
    const lines = t.split('\n').filter(l => /rope|footing caps|They take their own recoil on/.test(l));
    console.log('CASE', JSON.stringify(c));
    for (const l of lines) console.log('  > ' + l.slice(0, 500));
    await page.close();
  }
  await browser.close();
})();
