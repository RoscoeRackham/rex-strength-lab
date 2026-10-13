// What the stuck sidebar looks like with real scrollbars: classic (Windows/Linux default) and overlay (macOS, touch)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const S = __dirname;
(async () => {
  for (const [name, opts] of [['classic', { ignoreDefaultArgs: ['--hide-scrollbars'] }], ['overlay', { ignoreDefaultArgs: ['--hide-scrollbars'], args: ['--enable-features=OverlayScrollbar'] }]]) {
    const b = await chromium.launch(Object.assign({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }, opts));
    for (const which of ['branch', 'main']) {
      const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      await page.goto('file://' + path.join(S, which + '.html'));
      await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(3000);
      await page.mouse.move(900, 500);
      for (const y of [0, 900]) {
        await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(400);
        await page.screenshot({ path: S + '/shots/sb-' + name + '-' + which + '-' + y + '.png', clip: { x: 40, y: 0, width: 400, height: 900 } });
      }
      const sbw = await page.evaluate(() => { const a = document.querySelector('aside'); return a.offsetWidth - a.clientWidth - 2; });
      console.log(name, which, 'sidebar scrollbar width', sbw);
      await ctx.close();
    }
    await b.close();
  }
})();
