const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const S = __dirname;
const wrap = (src, name) => { const f = path.join(S, name + '.wrapped.html'); fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(src, 'utf8') + '</body></html>'); return pathToFileURL(f).href; };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const name of ['base', 'mutC_noplaceholder']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(wrap(S + '/' + name + '/dist/index.html', name));
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'collide' })));
    await page.reload(); await page.waitForTimeout(800); await page.waitForTimeout(400); await settle(page, 'duo-bay');
    const first = (await readResult(page, 'duo-bay')).verdict;
    const chips = await page.evaluate(() => Array.from(document.querySelectorAll('#tier-chips .chip')).map((b) => b.dataset.id + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')));
    await page.click('#duo > summary'); await page.waitForTimeout(300);
    // pick a different tier chip than the current one
    const pick = chips.find((c) => !c.endsWith('*') && c !== chips[0]) || chips[1];
    await page.click('#tier-chips .chip[data-id="' + pick.replace('*', '') + '"]'); await page.waitForTimeout(500);
    await page.evaluate(() => { window.__rec = []; document.addEventListener('toggle', (e) => { if (e.target.id === 'duo' && e.target.open) { const t = () => { const b = document.getElementById('duo-bay'), v = b.querySelector('.verdict'); return v ? 'verdict ' + v.textContent : b.textContent.trim(); }; window.__rec.push('at toggle: ' + t()); requestAnimationFrame(() => window.__rec.push('next frame: ' + t())); } }, true); });
    await page.click('#duo > summary'); await page.waitForTimeout(100);
    const rec = await page.evaluate(() => window.__rec);
    await page.waitForTimeout(400); await settle(page, 'duo-bay');
    const fin = (await readResult(page, 'duo-bay')).verdict;
    console.log('==', name, '| chip picked:', pick, '\n first verdict:', first, '\n', rec.join('\n '), '\n settled:', fin, errs.length ? '\n errors ' + errs : '');
    await ctx.close();
  }
  await browser.close();
})();
