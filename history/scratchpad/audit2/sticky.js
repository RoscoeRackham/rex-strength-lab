const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h] of [[1280, 900], [1280, 720], [1024, 768]]) for (const action of ['throw', 'stomp', 'pull']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript((a) => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: a })), action);
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(700);
    const r = await page.evaluate(async (h) => {
      const aside = document.querySelector('.panel-controls'), bay = document.querySelector('main.panel'), anchor = document.querySelector('#anchor');
      const res = { asideH: Math.round(aside.offsetHeight), bayH: Math.round(bay.offsetHeight), viewport: h };
      // scan scroll positions: is #anchor ever fully in viewport?
      let visibleAt = null; const maxY = document.documentElement.scrollHeight;
      for (let y = 0; y < maxY; y += 20) { window.scrollTo(0, y); const b = anchor.getBoundingClientRect(); if (b.top >= 0 && b.bottom <= h) { visibleAt = y; break; } }
      res.anchorFirstVisibleAtScroll = visibleAt;
      window.scrollTo(0, 0);
      return res;
    }, h);
    console.log(w + 'x' + h, action, JSON.stringify(r));
    await ctx.close();
  }
  await browser.close();
})();
