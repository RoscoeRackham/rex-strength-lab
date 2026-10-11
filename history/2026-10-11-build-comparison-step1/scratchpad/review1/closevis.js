'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[390, 844], [1280, 900], [1280, 720]]) {
    const { ctx, p } = await open(browser, { w, h, fonts: true, extraHead: '<style>body{margin:0}[hidden]{display:none!important}</style>' });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const ids = await p.evaluate(() => Array.from(document.querySelectorAll('.fig[data-id]')).map((c) => c.dataset.id));
    const bad = [];
    for (const id of ids) {
      // scroll the figure into the middle, click it like a user
      await p.evaluate((id) => { document.getElementById('drawer').hidden || document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); document.querySelector('.fig[data-id="' + id + '"]').scrollIntoView({ block: 'center' }); }, id);
      await p.waitForTimeout(30);
      await p.click('.fig[data-id="' + id + '"]', { position: { x: 20, y: 30 } });
      await p.waitForTimeout(60);
      const r = await p.evaluate(() => { const c = document.getElementById('drawerClose').getBoundingClientRect(); const l = document.getElementById('locator').getBoundingClientRect(); const top = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2); return { closeTop: Math.round(c.top), closeBottom: Math.round(c.bottom), locBottom: Math.round(l.bottom), hit: top && top.id, vh: innerHeight }; });
      if (r.hit !== 'drawerClose') bad.push(id + ' ' + JSON.stringify(r));
    }
    console.log(w + 'x' + h, bad.length + ' of ' + ids.length + ' opens leave the Close button covered or off screen', bad.slice(0, 6).join('\n  '));
    if (bad.length) { const id = bad[0].split(' ')[0]; await p.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))); await p.evaluate((id) => document.querySelector('.fig[data-id="' + id + '"]').scrollIntoView({ block: 'center' }), id); await p.click('.fig[data-id="' + id + '"]', { position: { x: 20, y: 30 } }); await p.waitForTimeout(100); await p.screenshot({ path: path.join(DIR, 'n-close-covered-' + w + 'x' + h + '.png') }); }
    await ctx.close();
  }
  await browser.close();
})();
