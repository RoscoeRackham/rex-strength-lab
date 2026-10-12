const H = require('./hc.js');
(async () => {
  const p = await H.open();
  const surf = process.argv[2] || 'concrete';
  await H.setState(p, { surface: surf, growS: 0.5 });
  await H.tab(p, 'weight');
  for (const gw of ['krakatoa', 'chicxulub', 'sun']) {
    await p.click('#grow-what-' + gw); await p.waitForTimeout(200);
    for (const ab of ['ocean', 'gradual', 'instant', 'runaway']) {
      await p.evaluate(() => { document.getElementById('comic-setup').open = true; });
      await H.sel(p, '#absorb', ab);
      for (const s of [0.5, 1, 0]) {
        if (ab === 'ocean' && s !== 0.5) continue;
        await p.evaluate((s) => document.querySelector('#grow-chips .chip[data-s="' + s + '"]').click(), s);
        await p.waitForTimeout(200);
        const t = await p.evaluate(() => { const b = document.querySelector('.growth-whatif'); return b ? b.innerText : '-'; });
        console.log(`\n==== ${gw} | ${ab} | s=${s}\n${t}`);
      }
    }
  }
  console.log('ERRS', p.errs);
  await H.close();
})();
