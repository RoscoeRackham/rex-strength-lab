const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const name of ['repo', 'mut']) {
    const ROOT = path.join(__dirname, '..', name, 'rex-strength-lab'); const { settle } = require(ROOT + '/test/make-page-fixture.js');
    const out = path.join(__dirname, '..', 'wrap-u3-' + name + '.html');
    fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8') + '</body></html>');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(out).href);
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'wrestle' }))); await page.reload(); await page.waitForTimeout(800); await settle(page, 'duo-bay');
    await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
    await page.evaluate(() => { const s = document.getElementById('o-strength'); s.value = '3'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }); await page.waitForTimeout(800); await settle(page, 'duo-bay');
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    const r = await page.evaluate(() => ({ labels: Array.from(document.querySelectorAll('#duo-bay [aria-label]')).map((n) => n.getAttribute('aria-label')).filter((x) => /Strength, footing/.test(x)), tile: Array.from(document.querySelectorAll('#duo-bay .tiles')).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / ') }));
    console.log(name + ' CHART: ' + r.labels.join(' | ')); console.log(name + ' TILES: ' + r.tile);
    await page.close();
  }
  await browser.close();
})();
