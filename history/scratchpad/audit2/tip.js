const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const wrap = document.querySelector('#ladder-viz');
      const out = [];
      for (const g of wrap.querySelectorAll('.mk')) {
        g.dispatchEvent(new Event('focus'));
        const tip = wrap.querySelector('.tip'); const tr = tip.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        const clipped = tr.bottom > wr.bottom + 0.5 || tr.top < wr.top - 0.5;
        const sc = wrap.scrollHeight > wrap.clientHeight;
        if (clipped || sc) out.push(g.getAttribute('aria-label').split(',')[0] + ': tip bottom ' + Math.round(tr.bottom - wr.bottom) + 'px past wrap; wrap scrollable=' + sc);
        g.dispatchEvent(new Event('blur'));
      }
      return out;
    });
    console.log('== ' + w + '\n' + (r.join('\n') || 'no clipping'));
    await page.close();
  }
  await browser.close();
})();
