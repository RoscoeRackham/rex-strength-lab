const { open } = require('./h.js');
(async () => {
  const H = await open();
  for (const air of [1, 0.01, 0]) {
    await H.load({ action: 'throw', obj: 'baseball', logKg: 8, angle: 30, airAbsorb: air });
    await H.pick('#effort', 'windows');
    const r = await H.read('bay');
    console.log('air', air, '|', r.verdict, '|', r.effort.join(' ').slice(0, 600));
    console.log('   HAPPENS:', r.happens.join(' ').match(/[^.]*(hand|Hand)[^.]*\./g));
  }
  console.log('ERRS', H.errs);
  await H.browser.close();
})();
