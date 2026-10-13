const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { cObj: 'partner', cStyle: 'hard', logKg: 6 }, 'catch', true);
  await pick(page, '#duo-effort', 'plaster', 'duo-bay');
  const t = await text(page, 'duo-bay');
  const i = t.indexOf('OLLIE\n');
  console.log(t.slice(i, i + 2500));
  console.log(/shak|kg·m\/s|felt/i.test(t.slice(t.indexOf('Toss speed'))) ? 'bay mentions shaking' : 'NO shaking text in the bay body');
  console.log(errs);
  await browser.close();
})();
