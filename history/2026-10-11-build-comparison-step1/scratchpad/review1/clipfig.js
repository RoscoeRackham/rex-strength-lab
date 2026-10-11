'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, { w: 1280, h: 900, fonts: false });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  for (const mode of [['#hSame', '#vFront'], ['#hReal', '#vFront'], ['#hSame', '#vSide'], ['#hReal', '#vSide']]) {
    await p.click(mode[0]); await p.click(mode[1]); await p.waitForTimeout(200);
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('.fig svg').forEach((svg) => {
        const vb = svg.viewBox.baseVal; const g = svg.querySelector('g'); const b = g.getBBox();
        if (b.y < -0.5 || b.x < -0.5 || b.x + b.width > vb.width + 0.5 || b.y + b.height > vb.height + 0.5) out.push(svg.closest('.fig').dataset.id + ' bbox ' + [b.x, b.y, b.width, b.height].map((v) => v.toFixed(1)).join(',') + ' vb ' + vb.width + 'x' + vb.height);
      });
      return out;
    });
    console.log(mode.join(' '), r.length ? r : 'no figure clipped');
  }
  await p.click('#hSame'); await p.click('#vSide'); await p.waitForTimeout(200);
  await p.locator('#rex-and-ollie .figs').screenshot({ path: path.join(DIR, 'i-duo-side-same.png') });
  await p.click('#hReal'); await p.click('#vFront'); await p.waitForTimeout(200);
  await p.locator('#rex-and-ollie .figs').screenshot({ path: path.join(DIR, 'i-duo-front-real.png') });
  await p.locator('#empty').screenshot({ path: path.join(DIR, 'i-gap1-real-1280.png') });
  await p.locator('#meatball').screenshot({ path: path.join(DIR, 'i-meat-real-1280.png') });
  await ctx.close(); await browser.close();
})();
