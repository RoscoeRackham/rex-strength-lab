const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[390, 844], [1280, 900]]) for (const scheme of ['light', 'dark']) {
    const { ctx, p, errs, reqs } = await open(browser, w, h, scheme, { dpr: 1 });
    const info = await p.evaluate(() => {
      const de = document.documentElement;
      const over = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > window.innerWidth + 0.5 || r.left < -0.5)) {
          // check if inside an overflow container
          let a = el.parentElement, clipped = false;
          while (a && a !== document.body) { const cs = getComputedStyle(a); if (cs.overflowX !== 'visible') { clipped = true; break; } a = a.parentElement; }
          if (!clipped) over.push(el.tagName + '.' + el.className + '#' + el.id + ' ' + Math.round(r.left) + '-' + Math.round(r.right));
        }
      });
      return { sw: de.scrollWidth, iw: innerWidth, bg: getComputedStyle(document.body).backgroundColor, over: over.slice(0, 20),
        fonts: ['800 40px "Big Shoulders Display"', '400 14px "Public Sans"', '400 14px "IBM Plex Mono"'].map(f => document.fonts.check(f)) };
    });
    console.log(w, scheme, JSON.stringify(info), 'errs', errs, 'reqs', [...new Set(reqs.map(u => u.split('?')[0].slice(0, 60)))]);
    await p.screenshot({ path: `/home/user/build-calc/shots/audit-${w}-${scheme}.png`, fullPage: true });
    await ctx.close();
  }
  await browser.close();
})();
