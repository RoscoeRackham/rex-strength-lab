'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const scheme of ['light', 'dark']) {
    const { ctx, p } = await open(browser, { w: 390, h: 844, scheme, dpr: 2 });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(DIR, 'f-bottom-' + scheme + '.png') });
    const info = await p.evaluate(() => { const d = document.getElementById('drawer'); const r = d.getBoundingClientRect(); return { hidden: d.hidden, display: getComputedStyle(d).display, rect: [r.left, r.top, r.width, r.height].map(Math.round), foot: Math.round(document.getElementById('foot').getBoundingClientRect().bottom) }; });
    console.log(scheme, JSON.stringify(info));
    // locator mid-page
    await p.evaluate(() => { const el = document.getElementById('top'); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 60); });
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(DIR, 'f-locator-' + scheme + '.png'), clip: { x: 0, y: 0, width: 390, height: 260 } });
    await p.evaluate(() => { const el = document.getElementById('rex-and-ollie'); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 60); });
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(DIR, 'f-locator-rex-' + scheme + '.png'), clip: { x: 0, y: 0, width: 390, height: 260 } });
    await ctx.close();
  }
  await browser.close();
})();
