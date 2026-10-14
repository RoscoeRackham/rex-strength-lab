const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const file = path.join(__dirname, 'page.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [[7, false], [7.25, false], [8, false], [9, false]];
  for (const [logKg, own] of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errs = []; page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('file://' + file);
    await page.evaluate(([logKg, own]) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'rex', wAngle: 45, near: 12, ownRecoil: own, unbreakable: true, airAbsorb: 1, keepForm: true, surface: 'concrete' })); }, [logKg, own]);
    await page.reload();
    await page.waitForSelector('#duo-effort', { timeout: 60000 });
    await page.selectOption('#duo-effort', 'allout');
    await page.waitForFunction(() => !/working it out/i.test(document.body.innerText), null, { timeout: 120000 });
    await page.waitForTimeout(500);
    const txt = await page.evaluate(() => document.body.innerText);
    const lines = txt.split('\n').filter((l) => /^Where he lands|^At this effort|^Within the courtesy|nothing nearby/i.test(l));
    console.log('=== logKg', logKg, 'ownRecoil', own, 'errors', errs.length);
    for (const l of lines) console.log('  ', l.length > 300 ? '...' + l.slice(-420) : l);
    await ctx.close();
  }
  await browser.close();
})();
