const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[390, 844], [360, 740]]) {
    const { ctx, p } = await open(browser, { w, h, dpr: 2, extraHead: '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>' });
    const r = await p.evaluate(() => {
      const y = (sel) => { const e = document.querySelector(sel); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
      const hgt = (sel) => { const e = document.querySelector(sel); return e ? Math.round(e.getBoundingClientRect().height) : null; };
      return { vh: innerHeight, lede: [y('#lede'), hgt('#lede')], spec: [y('#spec'), hgt('#spec')], glance: y('.glance'), jumps: y('.jumps'), controls: [y('.controls'), hgt('.controls')], lineupH: y('#lineupH'), locator: y('#locator'), firstTag: y('#under25 .tag'), firstFig: y('.fig'), rexStop: y('#rex-and-ollie'), rexFig: y('.fig[data-id="rex"]'), total: document.documentElement.scrollHeight };
    });
    r.screensToFirstFig = (r.firstFig / r.vh).toFixed(1); r.screensToRex = (r.rexFig / r.vh).toFixed(1);
    console.log(w + 'x' + h, JSON.stringify(r));
    await p.screenshot({ path: path.join(DIR, 'p-first-screen-' + w + '.png') });
    await ctx.close();
  }
  await browser.close();
})();
