const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ inf: true, cObj: 'baseball', cStyle: 'hard', cLogD: Math.log10(20000), cMiss: true }, { logKg: 33, cObj: 'pyramid', cStyle: 'hard', cLogD: Math.log10(20000), cMiss: true }]) {
    await load(page, st, 'catch', true);
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    const t = await text(page, 'duo-bay');
    const i = t.indexOf('OLLIE\n');
    console.log('=== ' + JSON.stringify(st) + '\n', t.slice(i, i + 3500));
  }
  console.log(errs);
  await browser.close();
})();
