const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  for (const sf of ['concrete', 'granite']) {
    const p = await open('wt', { action: 'weight', group: 'solo', surface: sf });
    await select(p, 'absorb', 'instant');
    await p.waitForTimeout(500);
    await click(p, '#grow-what-chicxulub');
    const t = await bay(p, 1500);
    console.log('=== ' + sf + '\n' + grep(t, /Momentum isn’t absorbed|thrown|At that weight|punches|All at once/i));
    if (p._errs.length) console.log(p._errs);
    await p.close();
  }
  await close();
})();
