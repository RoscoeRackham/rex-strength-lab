'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[360, 740], [768, 1024]]) {
    const { ctx, p } = await open(browser, { w, h, dpr: 2 });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const ids = await p.evaluate(() => Array.from(document.querySelectorAll('.fig[data-id]')).map((c) => c.dataset.id));
    const probs = {};
    for (const id of ids) {
      await p.evaluate((id) => document.querySelector('.fig[data-id="' + id + '"]').click(), id);
      const r = await p.evaluate(() => {
        const d = document.getElementById('drawer'); const dr = d.getBoundingClientRect(); const out = [];
        d.querySelectorAll('*').forEach((el) => { const r = el.getBoundingClientRect(); if (!r.width) return; if (r.right > dr.right + 0.5 || r.left < dr.left - 0.5) out.push(el.tagName + '.' + String(el.className.baseVal != null ? el.className.baseVal : el.className).split(' ')[0] + ' "' + (el.textContent || '').trim().slice(0, 30) + '" +' + Math.round(r.right - dr.right)); });
        // close button overlapping the heading?
        const c = document.getElementById('drawerClose').getBoundingClientRect(), hh = document.getElementById('drawerH').getBoundingClientRect();
        const ov = c.left < hh.right && hh.left < c.right && c.top < hh.bottom && hh.top < c.bottom;
        // eyebrow overlap with close button
        const eb = d.querySelector('.dhead .eyebrow').getBoundingClientRect();
        const ov2 = c.left < eb.right && eb.left < c.right && c.top < eb.bottom && eb.top < c.bottom;
        return { out: out.slice(0, 4), closeOverHeading: ov, closeOverEyebrow: ov2, sw: document.documentElement.scrollWidth };
      });
      if (r.out.length || r.closeOverHeading || r.closeOverEyebrow || r.sw > w) probs[id] = r;
    }
    console.log(w, Object.keys(probs).length + ' drawers with issues', JSON.stringify(probs).slice(0, 3000));
    await p.evaluate(() => document.querySelector('.fig[data-id="ronnie_coleman"]').click());
    await p.waitForTimeout(150);
    await p.locator('#drawer').screenshot({ path: path.join(DIR, 'j-drawer-coleman-' + w + '.png') });
    // tool results table
    const t = await p.evaluate(() => Array.from(document.querySelectorAll('.tbl-wrap')).map((x) => x.querySelector('table').id + ':' + x.scrollWidth + '/' + x.clientWidth));
    console.log(w, 'tbl-wrap scroll', t);
    await ctx.close();
  }
  await browser.close();
})();
