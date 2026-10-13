const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light', 'dark']) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await p.goto('file://' + D + '/fix3.html'); await p.waitForTimeout(1500);
    await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(500);
    await p.screenshot({ path: D + '/fix3-top-' + scheme + '.png', clip: { x: 0, y: 600, width: 640, height: 300 } });
    await p.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; }); await p.waitForTimeout(300);
    await p.screenshot({ path: D + '/fix3-end-' + scheme + '.png', clip: { x: 0, y: 0, width: 640, height: 900 } });
    await p.close();
  }
  await b.close();
})();
