const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { url } = require('./lib.js');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const fix of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, isMobile: false });
    const page = await ctx.newPage();
    await page.goto(url('branch')); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(3000);
    if (fix) await page.addStyleTag({ content: '@media (min-width:920px){.panel-controls{overscroll-behavior:auto !important}}' });
    const cdp = await ctx.newCDPSession(page);
    const log = [];
    for (let i = 0; i < 5; i++) {
      await cdp.send('Input.synthesizeScrollGesture', { x: 150, y: 600, yDistance: -500, gestureSourceType: 'touch', speed: 1200 });
      await page.waitForTimeout(400);
      log.push(await page.evaluate(() => Math.round(scrollY) + '/' + Math.round(document.querySelector('aside').scrollTop)));
    }
    console.log('1180x820 touch swipe up on the sidebar, fix=' + fix + ', page/aside:', log.join(' '));
    await ctx.close();
  }
  await b.close();
})();
