const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const dark of [false, true]) {
    const p = await open(b, { width: 1280, height: 900, skel: 'host', dark });
    const el = await p.$('#limitCards'); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: `${DIR}/l10-limits-${dark ? 'dark' : 'light'}.png` });
    await p.evaluate(() => document.querySelector('.fp-row[data-row="kraemer2020_strongman"], .fp-row[data-row]').scrollIntoView({ block: 'start' }));
    const rows = await p.evaluate(() => Array.from(document.querySelectorAll('.fp-row[data-row]')).map(r => r.dataset.row));
    const fpEl = await p.$('#fp'); const bb = await fpEl.boundingBox();
    await p.evaluate(() => { const r = Array.from(document.querySelectorAll('.fp-row[data-row]')).find(r => /hall|shaw|strong|lifter/i.test(r.dataset.row)); (r || document.querySelector('.fp-row[data-row]')).scrollIntoView({ block: 'center' }); });
    await p.waitForTimeout(100);
    await p.screenshot({ path: `${DIR}/l10-forest-${dark ? 'dark' : 'light'}.png`, clip: { x: 0, y: 250, width: 1280, height: 400 } });
    // figure cell for a natural athlete
    const nat = await p.evaluate(() => { const e = window.__bc.LIST.find(e => e.group === 'Natural athletes'); return e && e.id; });
    const c = await p.$('.fig[data-id="' + nat + '"]'); await c.scrollIntoViewIfNeeded(); await c.screenshot({ path: `${DIR}/l10-fig-natural-${dark ? 'dark' : 'light'}.png` });
    const st = await p.evaluate(() => { const e = window.__bc.LIST.find(e => e.group === 'Strongmen and lifters'); return e && e.id; });
    const c2 = await p.$('.fig[data-id="' + st + '"]'); await c2.scrollIntoViewIfNeeded(); await c2.screenshot({ path: `${DIR}/l10-fig-strong-${dark ? 'dark' : 'light'}.png` });
    console.log(dark, nat, st);
    await p._ctx.close();
  }
  await b.close();
})();
