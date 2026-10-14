const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const s of [1, 0.5]) {
    await load(page, { wrestleMove: 'throw', wAngle: 90, logKg: 16, airAbsorb: s }, 'wrestle', true);
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    let t = await text(page, 'duo-bay');
    let i = t.indexOf('OLLIE\n');
    console.log('=== wrestle throw 90 share ' + s + '\n', t.slice(i, i + 2500));
    await load(page, { cObj: 'partner', cStyle: 'hard', logKg: 16, airAbsorb: s }, 'catch', true);
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    t = await text(page, 'duo-bay');
    i = t.indexOf('OLLIE\n');
    console.log('=== partner toss share ' + s + '\n', t.slice(i, i + 2500));
  }
  console.log(errs);
  await browser.close();
})();
