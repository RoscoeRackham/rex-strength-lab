const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile, text } = await open();
  for (const [st, eff] of [[{ action: 'throw', obj: 'car', angle: 45, logKg: 16 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, logKg: 16, airAbsorb: 0.5 }, 'allout'], [{ action: 'throw', obj: 'car', angle: 45, logKg: 16, airAbsorb: 0.5, keepForm: false }, 'allout']]) {
    await load(st, eff);
    const t = await text('bay');
    console.log(JSON.stringify(st), '\n  SHIM:', (t.match(/The shimmer \(the Shimmer tile\)[^.]*\.[^.]*\./g) || []).join(' || '), '\n  TILE:', await tile('bay'));
    console.log('  items:', await page.evaluate(() => Array.from(document.querySelectorAll('#bay ul.happens li')).map((l) => l.textContent.slice(0, 60)).join(' | ')));
  }
  console.log('errs', page.errs);
  await browser.close();
})();
