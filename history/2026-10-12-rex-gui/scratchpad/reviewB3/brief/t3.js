const { open } = require('./h.js');
(async () => {
  const H = await open();
  for (const air of [0.5, 0]) {
    await H.load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg: 25, airAbsorb: air });
    for (const e of ['least', 'rattle', 'plaster', 'windows', 'block', 'allout']) {
      await H.pick('#duo-effort', e);
      const r = await H.read('duo-bay');
      console.log('air', air, e, '|', r.verdict, '|', r.effort.join(' '));
    }
  }
  // default partner toss at default strength, powers on
  await H.load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg: 9 });
  await H.pick('#duo-effort', 'allout');
  const r = await H.read('duo-bay'); console.log('1e9 allout |', r.verdict, '|', r.effort.join(' '), '|', r.happens.join(' ').slice(0, 1500));
  console.log('ERRS', H.errs);
  await H.browser.close();
})();
