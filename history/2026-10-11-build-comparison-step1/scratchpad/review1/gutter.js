const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1280, 900]]) {
    const { ctx, p } = await open(browser, { w, h, dpr: 2, extraHead: '<style>body{margin:0}[hidden]{display:none!important}</style>' });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const r = await p.evaluate(() => {
      const sp = Array.from(document.querySelectorAll('#gutter span')).map((s) => { const r = s.getBoundingClientRect(); return { t: s.textContent, top: r.top, bottom: r.bottom }; }).sort((a, b) => a.top - b.top);
      const ov = []; for (let i = 1; i < sp.length; i++) if (sp[i].top < sp[i - 1].bottom - 0.5) ov.push(sp[i - 1].t + '/' + sp[i].t + ' overlap ' + (sp[i - 1].bottom - sp[i].top).toFixed(1) + 'px');
      const cv = document.getElementById('sheetCanvas').getBoundingClientRect();
      return { canvasH: Math.round(cv.height), ov, caps: Array.from(document.querySelectorAll('#viewCaps span')).map((s) => s.textContent) };
    });
    console.log(w, JSON.stringify(r));
    if (w === 360) { await p.evaluate(() => document.querySelector('.viewer').scrollIntoView({ block: 'center' })); await p.waitForTimeout(100); await p.locator('.viewer').screenshot({ path: path.join(DIR, 'q-viewer-360.png') }); }
    await ctx.close();
  }
  await browser.close();
})();
