const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ surface: 'sand', logKg: 9 }, { surface: 'sand', logKg: 9, unbreakable: false }, { surface: 'softclay', logKg: 7 }, { surface: 'softclay', logKg: 7, unbreakable: false }]) {
    await load(page, st, 'sprint');
    await pick(page, '#effort', 'allout', 'bay');
    const t = await text(page, 'bay');
    const i = t.indexOf('Adjust effort');
    console.log('=== sprint ' + JSON.stringify(st) + '\n', t.slice(i, i + 3500).replace(/\n10 m\/s[\s\S]*?Escape velocity\n[^\n]*\n/, '\n[chart]\n'));
  }
  console.log(errs);
  await browser.close();
})();
