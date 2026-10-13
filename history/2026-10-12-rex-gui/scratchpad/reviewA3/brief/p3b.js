const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { NEW } = require('./lib.js');
(async () => {
  for (const [name, args] of [['classic', []], ['overlay', ['--enable-features=OverlayScrollbar']]]) {
    const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', ignoreDefaultArgs: ['--hide-scrollbars'], args });
    const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
    await p.goto(NEW); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(1500);
    await p.screenshot({ path: `sidebar-${name}-1280x800.png`, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    await b.close();
  }
})();
