const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile, text, settledOn } = await open();
  for (const ub of [true, false]) {
    await load({ duoOpen: true, duoAction: 'arm', logKg: 9, unbreakable: ub }, 'allout');
    await page.evaluate(() => { document.getElementById('o-own').click(); });
    await settledOn('duo-bay');
    await page.evaluate(() => { for (const n of document.getElementById('duo-bay').children) n.r5old = true; const s = document.getElementById('o-strength'); s.value = '8'; s.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForFunction(() => Array.from(document.getElementById('duo-bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 60000 });
    await settledOn('duo-bay');
    const t = await text('duo-bay');
    console.log('--- unbreakable', ub, '| o-big:', await page.$eval('#o-big', (x) => x.textContent), '| effort', await page.$eval('#duo-effort', (x) => x.value));
    console.log('tile:', await tile('duo-bay'));
    for (const re of [/Rex pins Ollie[^.]*\.[^.]*\./, /Unbreakable footing: the ground under the table[^]*?estimate\)\./, /The pin’s slam drives[^]*?upper bound\)\./]) { const m = t.match(re); console.log(m ? m[0] : '(none for ' + re + ')'); }
    console.log('has "Shimmer":', t.includes('Shimmer'));
  }
  console.log('errs', page.errs);
  await browser.close();
})();
