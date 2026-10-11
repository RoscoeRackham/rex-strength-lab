'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const { ctx, p } = await open(browser, { w, h, scheme: 'light', fonts: false, touch: w < 500, mobile: w < 500 });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    for (const host of ['glance', 'locTape']) {
      for (const s of [14, 30, 40, 43, 50, 60, 70, 100, 150, 300, 600, 924, 990]) {
        await p.evaluate(() => window.scrollTo(0, 0));
        if (host === 'locTape') await p.evaluate(() => window.scrollTo(0, document.getElementById('under25').getBoundingClientRect().top + scrollY - 100));
        await p.waitForTimeout(80);
        const pt = await p.evaluate(([host, s]) => { const el = document.getElementById(host); const r = el.getBoundingClientRect(); const x = el._X(s); return { x: r.left + x, y: r.top + 8 }; }, [host, s]);
        if (w < 500) await p.touchscreen.tap(pt.x, pt.y); else await p.mouse.click(pt.x, pt.y);
        await p.waitForTimeout(250);
        const res = await p.evaluate(() => {
          // the stop whose top is closest to the top of the viewport (below the locator)
          let best = null; document.querySelectorAll('.stop').forEach((s) => { const t = s.getBoundingClientRect().top; if (!best || Math.abs(t - 60) < Math.abs(best.t - 60)) best = { id: s.id, t: Math.round(t), tag: (s.querySelector('.tag') || {}).textContent }; });
          return { best, loc: document.getElementById('locNow').textContent };
        });
        console.log(w, host, 'score', s, '->', JSON.stringify(res));
      }
    }
    await ctx.close();
  }
  await browser.close();
})();
