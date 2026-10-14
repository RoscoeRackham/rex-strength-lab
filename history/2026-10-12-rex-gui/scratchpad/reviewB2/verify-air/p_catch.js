const { open, load, pick, text, settle } = require('./page');
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 2, cStyle: 'hard', logKg: 23.2587 }, 'duo-bay');
  await pick(page, '#duo-effort', 'allout', 'duo-bay');
  const t = await text(page, 'duo-bay');
  console.log(t);
  console.log('errs', errs);
  await browser.close();
})();
