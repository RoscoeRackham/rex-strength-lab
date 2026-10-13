const { open } = require('./pw.js');
(async () => {
  const W = await open(process.argv[2]);
  const st = { action: 'throw', obj: 'car', angle: 0, logKg: 10, mode: 'comic' };
  const t = () => W.page.evaluate(() => document.querySelector('#bay .effort-read').textContent.replace(/\s+/g, ' '));
  for (const e of ['windows', 'houses', 'block']) {
    await W.load(st); await W.pick('#effort', e);
    const x = await t(); console.log(e, '|', (x.match(/Even all-out[^.]*\.[^.]*\.?[^.]*\.?/) || [x.slice(0, 120)])[0]);
  }
  // timing: block directly, vs windows then block 50 ms later
  const timeTo = async (seq) => {
    await W.load(st);
    const t0 = Date.now();
    for (const [e, wait] of seq) { await W.page.selectOption('#effort', e); await W.page.waitForTimeout(wait); }
    for (let i = 0; i < 400; i++) { const x = await t(); if (!/Working out/.test(x)) return { ms: Date.now() - t0, hint: /Lower Air resistance absorbed/.test(x) }; await W.page.waitForTimeout(50); }
    return { ms: Infinity };
  };
  console.log('block directly:', JSON.stringify(await timeTo([['block', 0]])));
  console.log('windows then block:', JSON.stringify(await timeTo([['windows', 30], ['block', 0]])));
  console.log('houses then block:', JSON.stringify(await timeTo([['houses', 30], ['block', 0]])));
  console.log('errors', W.errs);
  await W.close();
})();
