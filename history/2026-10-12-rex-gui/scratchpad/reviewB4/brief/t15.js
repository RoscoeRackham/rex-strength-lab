const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ wrestleMove: 'throw', wAngle: 90 }, { wrestleMove: 'throw', wAngle: 90, airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }]) {
    await load(page, st, 'wrestle', true);
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    const t = await text(page, 'duo-bay');
    const i = t.indexOf('OLLIE\n');
    console.log('=== ' + JSON.stringify(st) + '\n', t.slice(i, i + 1800));
  }
  console.log(errs);
  await browser.close();
})();
