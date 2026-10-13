const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const s of [0.5, 0.9]) {
    await load(page, { cObj: 'partner', cStyle: 'hard', logKg: 16, airAbsorb: s }, 'catch', true);
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    const t = await text(page, 'duo-bay');
    const i = t.indexOf('EFFORT (ONE');
    console.log('=== allout share', s, '\n', t.slice(i, i + 1500));
  }
  for (const s of [0, 0.5]) {
    await load(page, { cObj: 'partner', cStyle: 'hard', logKg: 16, airAbsorb: s }, 'catch', true);
    for (const e of ['windows', 'houses']) {
    await pick(page, '#duo-effort', e, 'duo-bay');
    const t = await text(page, 'duo-bay');
    const i = t.indexOf('OLLIE');
    console.log('=== ' + e + ' preset share', s, '\n', t.slice(i, i + 900));
    }
  }
  console.log(errs);
  await browser.close();
})();
