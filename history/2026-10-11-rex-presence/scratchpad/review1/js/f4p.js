const H = require('./h.js');
(async () => {
  for (const sid of ['concrete', 'sand']) {
    const p = await H.open({ action: 'walk', surface: sid, walker: 'both' });
    await H.tab(p, 'walk');
    const t = await H.text(p);
    console.log('=== both', sid, '\n', t.split('\n').filter((l) => /^At 3 m|Canon says|Both walking|out to|not even/.test(l)).join('\n'));
  }
  await H.close();
})();
