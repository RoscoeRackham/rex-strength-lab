const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ logKg: 12 }, { logKg: 9 }, { logKg: 20 }]) {
    await load(page, st, 'jump');
    await pick(page, '#effort', 'allout', 'bay');
    const t = await text(page, 'bay');
    const i = t.indexOf('Adjust effort');
    console.log('=== jump ' + JSON.stringify(st) + '\n', t.slice(i, i + 3800));
  }
  console.log(errs);
  await browser.close();
})();
