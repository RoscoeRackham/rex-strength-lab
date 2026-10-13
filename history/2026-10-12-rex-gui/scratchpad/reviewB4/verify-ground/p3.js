const { open, settle, load, text } = require('./harness.js');
(async () => {
  const { browser, pg, errs } = await open();
  for (const [lab, st] of [['1e20 concrete', { logKg: 20 + 1e-12 }], ['1e20 sand', { logKg: 20 + 1e-12, surface: 'sand' }], ['inf concrete', { inf: true }]]) {
    await load(pg, Object.assign({ action: 'jump' }, st));
    await settle(pg, 'bay');
    await pg.selectOption('#effort', 'allout'); await pg.waitForTimeout(600); await settle(pg, 'bay');
    const t = await text(pg, 'bay');
    console.log('=== ' + lab);
    console.log(t.split('\n').filter((l) => /leaves at|whole push-off|only what it can bear|plaster|Courtesy|At this effort/i.test(l)).slice(0, 10).join('\n'));
  }
  console.log('errors', errs);
  await browser.close();
})();
