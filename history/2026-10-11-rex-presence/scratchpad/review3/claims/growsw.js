const H = require('./hc.js');
const cases = [
  ['punch', { silentStrike: true, logKg: 20 }], ['punch', { silentStrike: true, logKg: 22 }], ['clap', { silentStrike: true, logKg: 25 }],
  ['jump', { softLanding: true, logKg: 22 }], ['punch', { silentStrike: true, inf: true }],
];
(async () => {
  const p = await H.open();
  const base = { gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false, surface: 'concrete', inf: false, angle: 45 };
  for (const [tab, st] of cases) {
    await H.setState(p, Object.assign({}, base, st));
    await H.tab(p, tab);
    await H.sel(p, '#effort', 'allout'); await H.settle(p, 90000);
    for (const ab of ['gradual', 'instant', 'runaway']) {
      await p.evaluate(() => { document.getElementById('comic-setup').open = true; });
      await H.sel(p, '#absorb', ab);
      for (const s of [0.5, 1, 0]) {
        await p.evaluate((s) => document.querySelector('#grow-chips .chip[data-s="' + s + '"]').click(), s);
        await p.waitForTimeout(250); await H.settle(p, 60000);
        const t = await p.evaluate(() => {
          const b = document.getElementById('bay');
          b.querySelectorAll('details').forEach((d) => d.open = true);
          const v = b.querySelector('.verdict'); const er = b.querySelector('.effort-read');
          const co = [...b.querySelectorAll('.callout')].map((x) => x.innerText).join('\n  // ');
          return 'VERDICT: ' + (v ? v.innerText : '-') + '\nEFFORT: ' + (er ? er.innerText.split('\n')[0] + ' ' + (er.innerText.match(/The courtesy ceiling covers[^\n]*/) || [''])[0] : '-') + '\nCALLOUTS:\n  ' + co;
        });
        console.log(`\n==== ${tab} | ${JSON.stringify(st)} | ${ab} | s=${s}\n${t}`);
      }
    }
  }
  console.log('ERRS', p.errs);
  await H.close();
})();
