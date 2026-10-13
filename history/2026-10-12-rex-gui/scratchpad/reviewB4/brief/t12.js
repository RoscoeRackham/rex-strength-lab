const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ angle: 90 }, { angle: 90, obj: 'baseball' }, { angle: 90, obj: 'piano' }]) {
    await load(page, st, 'throw');
    const t = await text(page, 'bay');
    const i = t.indexOf('Adjust effort');
    console.log('=== throw ' + JSON.stringify(st) + '\n', t.slice(i, i + 3000).split('\n').filter(l => /flies|vacuum|No drag|car|ball|piano/i.test(l)).join('\n'));
  }
  console.log(errs);
  await browser.close();
})();
