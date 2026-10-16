const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile, text } = await open();
  const runs = [
    ['wrestle throw, Ollie throws, 1e9, 30deg, allout', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'ollie', wAngle: 30, logKg: 9 }, 'allout'],
    ['collide, Rex charges, allout', { duoOpen: true, duoAction: 'collide', colWho: 'rex' }, 'allout'],
    ['wrestle throw, Rex throws, default dial, 45deg, least (default)', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 45 }, null],
    ['wrestle throw, Rex throws, default dial, 45deg, allout', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 45 }, 'allout'],
  ];
  for (const [lab, st, eff] of runs) {
    await load(st, eff);
    console.log('---', lab, '| effort', await page.$eval('#duo-effort', (x) => x.value), '|', await tile('duo-bay'));
  }
  console.log('errs', page.errs);
  await browser.close();
})();
