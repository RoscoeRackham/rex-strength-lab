const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/code/repo/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const html = process.argv[2];
  const prev = path.join(path.dirname(html), 'preview-arm-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const [rex, ol, extra] of [[Math.log10(90718.474), 4.5, {}], [9, 4, {}], [12, 4, {}], [26, 4, {}], [6, 3, { anchor: 'bolted', oAnchor: 'bolted' }], [Math.log10(90718.474), 4.5, { ownRecoil: false }]]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ duoOpen: true, duoAction: 'arm', logKg: rex }, extra)); await page.reload(); await page.waitForTimeout(800); await settle(page, 'duo-bay');
    await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
    await page.click('#o-own'); await page.waitForTimeout(300);
    await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, ol);
    await page.waitForTimeout(800); await settle(page, 'duo-bay'); await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    const li = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .happens li')).map((n) => n.textContent.replace(/\s+/g, ' ').slice(0, 70)));
    console.log('Rex 10^' + rex.toFixed(2) + ' Ollie 10^' + ol + ' ' + JSON.stringify(extra) + ': ' + li.length + ' items');
    li.forEach((t, i) => console.log('   ' + (i + 1) + '. ' + t));
  }
  await browser.close(); fs.unlinkSync(prev);
})();
