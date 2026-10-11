const fs = require('fs');
const { launch, open, R } = require('./lib');
const TARGETS = [
  ['seg-hSame', '#hSame'], ['seg-hReal', '#hReal'], ['seg-vSide', '#vSide'], ['seg-zHum', '#zHum'],
  ['fig-2nd', '#under25 .fig:nth-child(2)'], ['fig-last', '#giants .fig:last-child'],
  ['cluster0', '#clusters button:nth-child(1)'], ['cluster-last', '#clusters button:last-child'],
  ['fp-row', '#fp [data-open="ronnie_coleman"]'], ['fp-row-first', '#fp [data-open="bruce_banner"]'],
  ['tSoldier', '#tSoldier'], ['tChoose', '#tChoose'], ['measureBtn', '#measureBtn'], ['tH', '#tH'], ['tOrder', '#tOrder'],
  ['keysum', '#keyDetails > summary'], ['advsum', 'details.adv > summary'], ['srcsum', 'details.src > summary'], ['jump-link', '.jumps a'], ['lede-link', '#lede a'],
  ['targetBtn', '#targetBtn'], ['tShape', '#tShape'],
];
(async () => {
  const b = await launch();
  const meta = [];
  for (const [w, h] of [[390, 844], [1280, 900]]) for (const sch of ['light', 'dark']) {
    const { ctx, p } = await open(b, w, h, sch);
    await p.evaluate(() => document.getElementById('tool').scrollIntoView());
    await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 });
    await p.waitForFunction(() => /measures|No outline|Every width/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
    await p.keyboard.press('Tab');
    for (const [name, sel] of TARGETS) {
      const el = await p.$(sel); if (!el) { console.log('missing', sel); continue; }
      await el.scrollIntoViewIfNeeded();
      await p.evaluate(() => { const lc = document.getElementById('locator'); });
      // keep the sticky locator / forest axis from covering: scroll element to middle
      await p.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); window.scrollBy(0, r.top - window.innerHeight / 2); }, sel);
      await p.evaluate(() => document.activeElement && document.activeElement.blur());
      await p.waitForTimeout(80);
      const r = await p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, sel);
      const clip = { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: Math.min(w - Math.max(0, r.x - 8), r.w + 16), height: r.h + 16 };
      const f = `${w}-${sch}-${name}`;
      await p.screenshot({ path: `${R}/focus/${f}-a.png`, clip });
      await p.keyboard.press('Shift'); // keyboard modality
      await p.focus(sel);
      await p.waitForTimeout(250);
      const fv = await p.evaluate((s) => document.querySelector(s).matches(':focus-visible'), sel);
      await p.screenshot({ path: `${R}/focus/${f}-b.png`, clip });
      meta.push({ f, sel, fv, rect: { x: r.x - clip.x, y: r.y - clip.y, w: r.w, h: r.h } });
    }
    await ctx.close();
  }
  fs.writeFileSync(R + '/focus/meta.json', JSON.stringify(meta, null, 1));
  await b.close();
})();
