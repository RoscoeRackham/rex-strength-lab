'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const w of [360, 390]) {
    const { ctx, p } = await open(browser, { w, h: 800, scheme: 'light', dpr: 3 });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const r = await p.evaluate(() => { const ax = document.getElementById('fpAxis'); window.scrollTo(0, ax.getBoundingClientRect().top + scrollY - 100); const f = document.querySelector('.forest').getBoundingClientRect(); const lab = Array.from(ax.querySelectorAll('.tp b')).pop(); const lr = lab.getBoundingClientRect(); const a = ax.getBoundingClientRect(); return { forestRight: f.right, axisRight: a.right, label: lab.textContent, labL: lr.left, labR: lr.right, vw: innerWidth, top: a.top }; });
    console.log(w, JSON.stringify(r));
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(DIR, 'g-axis-edge-' + w + '.png'), clip: { x: w - 140, y: 60, width: 140, height: 120 } });
    await ctx.close();
  }
  await browser.close();
})();
