'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, extra, tag] of [[390, '', 'task'], [390, '<style>body{margin:0}[hidden]{display:none!important}</style>', 'host'], [414, '<style>body{margin:0}[hidden]{display:none!important}</style>', 'host'], [375, '<style>body{margin:0}[hidden]{display:none!important}</style>', 'host']]) {
    const { ctx, p } = await open(browser, { w, h: 844, scheme: 'light', dpr: 2, extraHead: extra, fonts: true });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('.fig').forEach((f) => {
        const fr = f.getBoundingClientRect(); let over = 0;
        f.querySelectorAll('.plate *').forEach((c) => { const r = c.getBoundingClientRect(); if (r.width) over = Math.max(over, r.right - fr.right); });
        const nb = f.nextElementSibling; const hasRight = nb && Math.abs(nb.getBoundingClientRect().top - fr.top) < 1;
        if (over > 0.5) out.push(f.dataset.id + ' +' + over.toFixed(1) + 'px' + (hasRight ? ' (covered by ' + nb.dataset.id + ')' : ' (no right neighbour)'));
      });
      return { cell: Math.round(document.querySelector('.fig').getBoundingClientRect().width * 10) / 10, out };
    });
    console.log(w, tag, JSON.stringify(r));
    if (tag === 'task' || w === 390) {
      await p.evaluate(() => window.scrollTo(0, document.querySelector('.fig[data-id="superman"]').getBoundingClientRect().top + scrollY - 200));
      await p.waitForTimeout(200);
      const b = await p.evaluate(() => { const r = document.querySelector('.fig[data-id="superman"]').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
      await p.screenshot({ path: path.join(DIR, 'h-superman-' + tag + '.png'), clip: { x: b[0] - 4, y: b[1] + 150, width: b[2] * 2 + 8, height: b[3] - 150 } });
      await p.evaluate(() => window.scrollTo(0, document.querySelector('.fig[data-id="thing"]').getBoundingClientRect().top + scrollY - 200));
      await p.waitForTimeout(200);
      const b2 = await p.evaluate(() => { const r = document.querySelector('.fig[data-id="thing"]').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
      await p.screenshot({ path: path.join(DIR, 'h-thing-' + tag + '.png'), clip: { x: b2[0] - 4, y: b2[1] + 150, width: b2[2] * 2 + 8, height: b2[3] - 150 } });
    }
    await ctx.close();
  }
  await browser.close();
})();
