const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const [st, e] of [[{ cObj: 'partner', cStyle: 'hard' }, 'allout'], [{ cObj: 'partner', cStyle: 'hard', surface: 'sand' }, 'allout'], [{ cObj: 'partner', cStyle: 'easy' }, 'plaster']]) {
    await load(page, st, 'catch', true);
    await pick(page, '#duo-effort', e, 'duo-bay');
    const t = await text(page, 'duo-bay');
    const i = t.indexOf('OLLIE\n');
    console.log('=== ' + e + ' ' + JSON.stringify(st) + '\n', t.slice(i, i + 2500));
  }
  console.log(errs);
  await browser.close();
})();
