const { open, close } = require('./h.js');
(async () => {
  for (const w of [390, 1280]) for (const [name, st] of [['titanic-20.7-30', { action: 'throw', obj: 'titanic', logKg: 20.7, angle: 30 }], ['loco-18.7-70', { action: 'throw', obj: 'loco', logKg: 18.7, angle: 70 }], ['tank-15.2-89', { action: 'throw', obj: 'tank', logKg: 15.2, angle: 89 }]]) {
    const { page, ctx } = await open({ w, h: 900, state: st });
    const r = await page.evaluate(() => { const svg = document.querySelector('#bay svg[aria-label^="Flight"]'); if (!svg) return null; const sr = svg.getBoundingClientRect(); return [...svg.querySelectorAll('text')].map(t => { const q = t.getBoundingClientRect(); return [t.textContent, Math.round(q.left - sr.left)]; }).filter(x => x[1] < 0); });
    const s = await page.evaluate(() => window.__snap());
    console.log(w, name, 'verdict:', s.verdict, '| clipped y labels (text, px past left edge):', JSON.stringify(r));
    const v = await page.$('#bay .viz svg[aria-label^="Flight"]');
    if (v) await (await v.$('xpath=..')).screenshot({ path: `ylab-${w}-${name}.png` });
    await ctx.close();
  }
  await close();
})();
