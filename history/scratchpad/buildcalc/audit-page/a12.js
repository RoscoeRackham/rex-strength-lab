const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, 390, 844, 'light', { dpr: 2 });
  await p.selectOption('#buildSelect', 'ronnie_coleman');
  for (const u of ['metric', 'imperial']) {
    await p.click(u === 'metric' ? '#uMet' : '#uImp');
    for (const w of ['100000', '1000000', '10000000', '100000000', '1000000000']) {
      await p.fill('#wIn', w);
      const r = await p.evaluate(() => {
        const o = [];
        document.querySelectorAll('body *').forEach(el => { const rc = el.getBoundingClientRect(); if (rc.width && rc.right > innerWidth + 0.5) { let a = el.parentElement, c = false; while (a && a !== document.body) { if (getComputedStyle(a).overflowX !== 'visible') { c = true; break; } a = a.parentElement; } if (!c) o.push(el.tagName + '.' + (el.className.baseVal !== undefined ? el.className.baseVal : el.className) + ' ' + Math.round(rc.right) + ' "' + el.textContent.slice(0, 25) + '"'); } });
        return { sw: document.documentElement.scrollWidth, o: o.slice(0, 6) };
      });
      console.log(u, w, r.sw, r.o);
    }
  }
  await p.click('#uMet'); await p.fill('#wIn', '100000000');
  await p.screenshot({ path: '/home/user/build-calc/shots/audit-390-w1e8kg.png', clip: { x: 0, y: 900, width: 390, height: 900 } });
  await ctx.close(); await browser.close();
})();
