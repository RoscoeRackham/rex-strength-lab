const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const file = path.join(__dirname, 'page.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const lg of process.argv.slice(2).map(Number)) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((st) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); } catch (e) {} },
      { action: 'stomp', logKg: lg, inf: false, surface: 'concrete', anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true });
    await page.goto('file://' + file);
    await page.waitForTimeout(500);
    const sel = await page.$('#effort');
    if (sel) await page.selectOption('#effort', 'allout');
    await page.waitForFunction(() => !/working it out/i.test(document.body.innerText), null, { timeout: 120000 });
    await page.waitForTimeout(300);
    const t = await page.evaluate(() => document.body.innerText);
    const i = t.indexOf('Of that push');
    const j = t.indexOf('The foot’s push still goes in');
    console.log('--- logKg', lg);
    console.log(j >= 0 ? t.slice(j, j + 420).replace(/\n/g, ' | ') : 'NO stomp push text');
    const e = t.match(/Energy taken back[^\n]*\n[^\n]*\n[^\n]*/);
    console.log(e ? e[0].replace(/\n/g, ' | ') : 'no energy tile');
    await page.close();
  }
  await browser.close();
})();
