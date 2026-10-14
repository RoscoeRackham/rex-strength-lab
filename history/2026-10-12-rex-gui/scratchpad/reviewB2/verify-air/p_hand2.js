const { open, load, pick, text } = require('./page');
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { action: 'throw', obj: 'baseball', angle: 0, logKg: 9 });
  await pick(page, '#effort', 'allout');
  const t2 = await text(page, 'bay');
  console.log(t2.slice(0, 6000));
  await browser.close();
})();
