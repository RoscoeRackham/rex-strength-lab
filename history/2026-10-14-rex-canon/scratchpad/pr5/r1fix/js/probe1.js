const { open } = require('./page.js');
const pick = (t, re) => (t.match(re) || ['(none)'])[0];
(async () => {
  const { browser, page, load, tile, text } = await open();
  // throw shares
  for (const [st, eff] of [[{ action: 'throw', obj: 'car', angle: 45, airAbsorb: 0.5 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, airAbsorb: 0.1 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, airAbsorb: 0.9 }, 'allout'], [{ action: 'throw', obj: 'person', angle: 45, airAbsorb: 0.5 }, 'allout'], [{ action: 'throw', obj: 'person', angle: 45, airAbsorb: 0.5 }, null], [{ action: 'throw', obj: 'baseball', angle: 45, airAbsorb: 0.5 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, airAbsorb: 0.999 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, airAbsorb: 0.5 }, null]]) {
    await load(st, eff);
    const t = await text('bay');
    console.log(JSON.stringify(st), eff, '\n  ITEM:', pick(t, /Air resistance absorbed: their power takes back[^]*?(?=His hand still|$)/).slice(0, 900), '\n  TILE:', await tile('bay'));
  }
  // pyramid straight up 1e17 all-out; car at 1e12 (relativistic); car 1e12 at 50%
  for (const [st, eff] of [[{ action: 'throw', obj: 'pyramid', angle: 90, logKg: 17 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, logKg: 12 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, logKg: 12, airAbsorb: 0.5 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, logKg: 12, m: 1e12 }, 'allout']]) {
    await load(st, eff);
    const t = await text('bay');
    console.log(JSON.stringify(st), '\n  SHIM:', (t.match(/The shimmer \(the Shimmer tile\)[^.]*\.[^.]*\./g) || []).join(' || '), '\n  TILE:', await tile('bay'));
  }
  // unbounded
  await load({ action: 'throw', obj: 'car', inf: true }, 'allout'); console.log('INF TILE', await tile('bay'));
  // copy-1
  await load({ action: 'weight' }); console.log('WEIGHT', pick(await text('bay'), /Canon: energy they absorb[^]*?m = E ÷ c²\./));
  console.log('HINT', await page.evaluate(() => document.getElementById('absorb-hint').textContent));
  await load({ action: 'jump', softLanding: true }, null); console.log('JUMP', pick(await text('bay'), /Soft landing: what the landing[^]*?would have\./));
  const all = await page.evaluate(() => document.body.textContent);
  console.log('nothing changes left:', /and nothing changes|nothing outside changes/.test(all));
  console.log('errs', page.errs);
  await browser.close();
})();
