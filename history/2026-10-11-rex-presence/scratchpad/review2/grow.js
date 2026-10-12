const H = require('./h.js');
(async () => {
  const combos = JSON.parse(process.argv[2]);
  for (const st of combos) {
    const p = await H.open(Object.assign({ group: 'solo' }, st));
    await p.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    if (st._absorb) { await p.selectOption('#absorb', st._absorb); await p.waitForTimeout(150); }
    if (st._form != null) { await p.click('#grow-chips .chip[data-s="' + st._form + '"]'); await p.waitForTimeout(150); }
    if (st._what) { await p.locator('#bay button', { hasText: st._what }).first().click(); await p.waitForTimeout(200); }
    if (st._effort) { await p.selectOption('#effort', st._effort); await p.waitForTimeout(150); }
    await H.waitDone(p);
    await H.openAll(p);
    const t = await p.evaluate((what) => {
      const b = document.querySelector('#bay');
      const parts = [];
      const v = b.querySelector('.verdict'); parts.push('VERDICT: ' + (v ? v.innerText : '-'));
      const er = b.querySelector('.effort-read'); if (er) parts.push('READOUT: ' + er.innerText);
      for (const x of b.querySelectorAll('.callout')) parts.push('CALLOUT: ' + x.innerText);
      const gw = b.querySelector('.growth-whatif'); if (gw) parts.push('WHATIF: ' + gw.innerText);
      return parts.join('\n');
    });
    console.log('=========== ' + JSON.stringify(st));
    console.log(t);
    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
