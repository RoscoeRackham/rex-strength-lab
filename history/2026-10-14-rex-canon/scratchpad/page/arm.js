const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const html = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html';
(async () => {
  const prev = path.join(__dirname, 'prev-arm.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const st of [{ ownRecoil: true }, { ownRecoil: false }]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true, duoAction: 'arm', logKg: 6 }, x))), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'duo-bay');
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    await page.evaluate(() => { document.querySelector('#duo-bay details.effort-adjust').open = true; });
    await page.click('#o-effort-own'); await page.waitForTimeout(400); await settle(page, 'duo-bay');
    await page.evaluate(() => { const s = document.getElementById('o-effort-use'); s.value = '4'; s.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForTimeout(1200); await settle(page, 'duo-bay');
    console.log('====', JSON.stringify(st), '\n', await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .verdict, #duo-bay .status-row, #duo-bay .happens')).map((x) => x.innerText).join('\n---\n')));
  }
  console.log('ERRORS', errs);
  await browser.close();
})();
