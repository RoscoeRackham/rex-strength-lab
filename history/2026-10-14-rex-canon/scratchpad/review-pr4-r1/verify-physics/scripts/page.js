const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/verify-physics/repo/rex-strength-lab';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(ROOT + '/test/make-page-fixture.js');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const body = fs.readFileSync(ROOT + '/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'page.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const c of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), c.state);
    await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    if (c.ollieKg != null) {
      await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, c.ollieKg); await page.waitForTimeout(800); await settle(page, 'duo-bay');
    }
    if (c.pick) { await page.selectOption('#duo-effort', c.pick); await page.waitForTimeout(300); await settle(page, 'duo-bay'); }
    const r = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const t = (s) => Array.from(b.querySelectorAll(s)).map((n) => n.textContent.replace(/\s+/g, ' ').trim()); return { verdict: t('.verdict'), status: t('.status-row'), tiles: t('.tiles'), effort: t('.effort-read'), happens: t('.happens'), callouts: t('.callout') }; });
    console.log('=== ' + c.label);
    for (const k of (c.keys || Object.keys(r))) console.log('-- ' + k + ': ' + r[k].join(' // '));
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
