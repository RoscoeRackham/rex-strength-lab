const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(900);
    await page.locator('#ladder-viz').scrollIntoViewIfNeeded();
    const r = await page.evaluate(() => {
      const out = [];
      for (const g of document.querySelectorAll('#ladder-viz .mk')) {
        const c = g.querySelector('circle').getBoundingClientRect();
        const cx = c.left + c.width / 2, cy = c.top + c.height / 2;
        const hit = document.elementFromPoint(cx, cy);
        const hg = hit && hit.closest('.mk');
        const mine = g.getAttribute('aria-label').split(',')[0];
        const got = hg ? hg.getAttribute('aria-label').split(',')[0] : (hit ? hit.tagName : 'none');
        // also label text center
        const t = g.querySelector('text').getBoundingClientRect();
        const h2 = document.elementFromPoint(t.left + t.width / 2, t.top + t.height / 2);
        const hg2 = h2 && h2.closest('.mk');
        const got2 = hg2 ? hg2.getAttribute('aria-label').split(',')[0] : (h2 ? h2.tagName : 'none');
        if (got !== mine || got2 !== mine) out.push(`tap dot of "${mine}" -> "${got}"; tap its label -> "${got2}"`);
      }
      return out;
    });
    console.log('== ' + w + '\n' + (r.join('\n') || 'all ok'));
    await page.close();
  }
  await browser.close();
})();
