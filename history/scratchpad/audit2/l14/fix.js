const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l14/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const width of [320, 390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l14/preview-fixed.html');
    await page.waitForTimeout(2500);
    const res = await page.evaluate(() => {
      const out = []; const wrap = document.querySelector('#ladder-viz');
      const cs = getComputedStyle(wrap);
      const n = wrap.querySelectorAll('.mk').length;
      let worst = 0, worstLbl = '';
      for (let i = 0; i < n; i++) {
        const mk = wrap.querySelectorAll('.mk')[i];
        mk.dispatchEvent(new PointerEvent('pointerenter'));
        const tip = wrap.querySelector('.tip');
        const tr = tip.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        const o = tr.bottom - wr.bottom; if (o > worst) { worst = o; worstLbl = mk.getAttribute('aria-label'); }
        if (tr.right > document.documentElement.clientWidth || tr.left < 0) out.push('H-OVERFLOW ' + mk.getAttribute('aria-label'));
        mk.dispatchEvent(new PointerEvent('pointerleave'));
      }
      return { ox: cs.overflowX, oy: cs.overflowY, worst, worstLbl, out, docSW: document.documentElement.scrollWidth, docCW: document.documentElement.clientWidth };
    });
    console.log(width, JSON.stringify(res));
    const circle = page.locator('#ladder-viz .mk[aria-label^="Captain America"] circle');
    await circle.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    await circle.hover({ force: true });
    await page.waitForTimeout(200);
    await page.screenshot({ path: OUT + `fixed-cap-${width}.png` });
    await page.close();
  }
  await browser.close();
})();
