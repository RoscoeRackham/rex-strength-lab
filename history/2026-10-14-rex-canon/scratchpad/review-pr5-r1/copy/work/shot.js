const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'); const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[390, 'dark'], [1280, 'light']]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    await page.goto(pathToFileURL(path.join(__dirname, 'preview.html')).href);
    const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
    const gb = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { saveV: 3, duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: gb, action: 'stomp', logKg: 9 });
    await page.reload(); await settled('bay'); await settled('duo-bay');
    await page.selectOption('#effort', 'allout'); await page.waitForTimeout(800); await settled('bay');
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(800); await settled('duo-bay');
    const t = await page.$('#bay .tile.shimmer'); if (t) { await t.scrollIntoViewIfNeeded(); await (await page.$('#bay .tiles:has(.shimmer)')).screenshot({ path: 'solo-' + w + '-' + scheme + '.png' }); }
    const d = await page.$('#duo-bay .tiles:has(.shimmer)'); if (d) await d.screenshot({ path: 'duo-' + w + '-' + scheme + '.png' });
    const hero = await page.$('.hero'); await hero.screenshot({ path: 'hero-' + w + '-' + scheme + '.png' });
    const fig = await page.$('#duo-bay .art-figure'); if (fig) await fig.screenshot({ path: 'fig-' + w + '-' + scheme + '.png' });
    console.log(w, scheme, await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]));
    await page.close();
  }
  await browser.close();
})();
