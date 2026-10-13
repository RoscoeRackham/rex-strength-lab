const { open, settle, load, text } = require('./harness.js');
(async () => {
  const { browser, pg, errs } = await open();
  await load(pg, { duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'easy', cLogD: 1, surface: 'sand' });
  await settle(pg, 'duo-bay');
  await pg.selectOption('#duo-effort', 'rattle'); await pg.waitForTimeout(600); await settle(pg, 'duo-bay');
  const t = await text(pg, 'duo-bay');
  console.log(t);
  await browser.close();
})();
