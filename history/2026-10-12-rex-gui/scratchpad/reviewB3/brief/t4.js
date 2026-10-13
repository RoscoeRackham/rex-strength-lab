const { open } = require('./h.js');
(async () => {
  const H = await open();
  for (const [obj, lg, ang] of [['car', 5, 0], ['car', 6, 0], ['car', 7, 0], ['baseball', 5, 0], ['baseball', 4, 30], ['shot', 5, 30], ['car', 6, 45]]) for (const e of ['windows', 'rattle', 'houses', 'block']) {
    await H.load({ action: 'throw', obj, logKg: lg, angle: ang });
    await H.pick('#effort', e);
    const r = await H.read('bay');
    console.log(obj, lg, ang, e, '|', r.effort.join(' ').slice(0, 420));
  }
  console.log('ERRS', H.errs);
  await H.browser.close();
})();
