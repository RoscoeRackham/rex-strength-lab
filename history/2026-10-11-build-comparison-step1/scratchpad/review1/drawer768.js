'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [skel, extra] of [['task', ''], ['host', '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>']]) {
    for (const w of [720, 768, 820, 900, 1024]) {
      const { ctx, p } = await open(browser, { w, h: 1000, dpr: 1, extraHead: extra });
      await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
      const ids = await p.evaluate(() => Array.from(document.querySelectorAll('.fig[data-id]')).map((c) => c.dataset.id));
      let worst = { sw: 0 }, n = 0, maxOver = 0;
      for (const id of ids) {
        await p.evaluate((id) => document.querySelector('.fig[data-id="' + id + '"]').click(), id);
        const r = await p.evaluate(() => { const d = document.getElementById('drawer').getBoundingClientRect(); const t = document.querySelector('#drawer .gt').getBoundingClientRect(); return { sw: document.documentElement.scrollWidth, over: t.right - d.right }; });
        if (r.sw > w) n++;
        if (r.over > maxOver) maxOver = r.over;
        if (r.sw > worst.sw) worst = Object.assign({ id }, r);
      }
      console.log(skel, w, 'drawers causing sideways page scroll:', n + '/' + ids.length, 'max table overflow past drawer:', maxOver.toFixed(0) + 'px', 'worst:', JSON.stringify(worst));
      if (w === 768) {
        await p.evaluate(() => document.querySelector('.fig[data-id="ansur2_m_p50"]').click());
        await p.waitForTimeout(150);
        await p.evaluate(() => { const t = document.querySelector('#drawer .gt'); window.scrollTo(0, t.getBoundingClientRect().top + scrollY - 200); });
        await p.waitForTimeout(150);
        await p.screenshot({ path: path.join(DIR, 'l-drawer-768-' + skel + '.png') });
      }
      await ctx.close();
    }
  }
  await browser.close();
})();
