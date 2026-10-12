const H = require('./h.js');
(async () => {
  const cases = [['runaway', 'chicxulub', 'concrete'], ['instant', 'krakatoa', 'concrete'], ['instant', 'chicxulub', 'sand'], ['instant', 'krakatoa', 'sand']];
  for (const [mode, what, sf] of cases) {
    const p = await H.open({ action: 'weight', surface: sf });
    await H.tab(p, 'weight');
    await H.absorb(p, mode);
    await p.click('#grow-what-' + what); await p.waitForTimeout(500);
    const t = await p.evaluate(() => document.querySelector('.growth-whatif').innerText);
    console.log('=====', mode, what, sf, '\n' + t);
    await p.close();
  }
  await H.close();
})();
