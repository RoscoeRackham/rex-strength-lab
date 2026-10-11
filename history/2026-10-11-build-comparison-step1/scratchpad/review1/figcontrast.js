'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [scheme, ids] of [['light', ['kouri1995_nonusers', 'steve_reeves_1947', 'ansur2_m_p50']], ['dark', ['brian_shaw', 'hafthor_bjornsson', 'eddie_hall']]]) {
    const { ctx, p } = await open(browser, { w: 1280, h: 900, scheme, dpr: 2, fonts: false });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    for (const id of ids) {
      await p.evaluate((id) => document.querySelector('.fig[data-id="' + id + '"]').scrollIntoView({ block: 'center' }), id);
      await p.waitForTimeout(100);
      await p.locator('.fig[data-id="' + id + '"] svg').screenshot({ path: path.join(DIR, 'o-fig-' + scheme + '-' + id + '.png') });
    }
    // forest rows for the group
    await p.evaluate(() => document.getElementById('fp').scrollIntoView({ block: 'start' }));
    await p.waitForTimeout(100);
    const box = await p.evaluate(() => { const a = document.querySelector('#fp [data-row="brian_shaw"]').getBoundingClientRect(); const b = document.querySelector('#fp [data-row="kouri1995_nonusers"]').getBoundingClientRect(); return { a: [a.left, a.top + scrollY, a.width], b: [b.left, b.top + scrollY, b.width] }; });
    await p.evaluate((y) => window.scrollTo(0, y - 300), scheme === 'dark' ? box.a[1] : box.b[1]);
    await p.waitForTimeout(100);
    await p.screenshot({ path: path.join(DIR, 'o-forest-' + scheme + '.png'), clip: { x: 0, y: 150, width: 1280, height: 350 } });
    await ctx.close();
  }
  await browser.close();
})();
