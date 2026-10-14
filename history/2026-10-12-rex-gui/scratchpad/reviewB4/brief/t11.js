const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ obj: 'car', angle: 90, logKg: 11 }]) {
    await load(page, st, 'throw');
    for (const e of ['allout', 'plaster']) {
    await pick(page, '#effort', e, 'bay');
    const t = await text(page, 'bay');
    const i = t.indexOf('Adjust effort');
    console.log('=== throw ' + e + ' ' + JSON.stringify(st) + '\n', t.slice(i, i + 4000).split('\n').filter(l => /ground|Effort|Courtesy|plaster|feet|flies|leaves|All-out|Even/i.test(l)).join('\n'));
    }
  }
  console.log(errs);
  await browser.close();
})();
