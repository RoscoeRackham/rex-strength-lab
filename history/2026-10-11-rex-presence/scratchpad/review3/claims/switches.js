const H = require('./hc.js');
const cases = [
  ['lift', { obj: 'person', gentleHold: true, safePassenger: true }],
  ['lift', { obj: 'car', gentleHold: true }],
  ['lift', { obj: 'piano', gentleHold: true, logKg: 7 }],
  ['throw', { obj: 'car', gentleHold: true }],
  ['throw', { obj: 'person', safePassenger: true }],
  ['throw', { obj: 'person', safePassenger: false }],
  ['throw', { obj: 'person', safePassenger: true, logKg: 7 }],
  ['throw', { obj: 'car', coolFlight: true, logKg: 9 }],
  ['jump', { softLanding: true }],
  ['jump', { softLanding: true, logKg: 9 }],
  ['jump', { softLanding: true, surface: 'sand', logKg: 9 }],
  ['punch', { silentStrike: true, logKg: 9 }],
  ['clap', { silentStrike: true, logKg: 9 }],
  ['punch', { silentStrike: true }],
];
const efforts = (process.argv[2] || 'least,allout').split(',');
const absorbs = (process.argv[3] || 'ocean').split(',');
(async () => {
  const p = await H.open();
  const base = { gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false, surface: 'concrete', logKg: Math.log10(100 * 907.18474), inf: false, angle: 45 };
  for (const [tab, st] of cases) {
    await H.setState(p, Object.assign({}, base, st));
    await H.tab(p, tab);
    for (const ab of absorbs) {
      await p.evaluate(() => { document.getElementById('comic-setup').open = true; });
      await H.sel(p, '#absorb', ab);
      for (const ef of (tab === 'lift' ? ['-'] : efforts)) {
        if (ef !== '-') { await H.sel(p, '#effort', ef); await H.settle(p, 90000); }
        const t = await p.evaluate(() => {
          const b = document.getElementById('bay');
          b.querySelectorAll('details').forEach((d) => d.open = true);
          const v = b.querySelector('.verdict'), sr = b.querySelector('.status-row'), er = b.querySelector('.effort-read');
          const tl = [...b.querySelectorAll('.tile')].map((t) => t.innerText.replace(/\n/g, ' | ')).join(' ;; ');
          const li = [...b.querySelectorAll('.happens li')].map((x) => x.innerText).join('\n  ');
          const co = [...b.querySelectorAll('.callout')].map((x) => x.innerText.replace(/\n/g, ' / ')).join('\n  // ');
          const mt = [...b.querySelectorAll('.math .eq')].map((x) => x.innerText).join('\n');
          return 'VERDICT: ' + (v ? v.innerText : '-') + '\nCHIPS: ' + (sr ? sr.innerText.replace(/\n/g, ' · ') : '-') + '\nEFFORT: ' + (er ? er.innerText : '-') + '\nTILES: ' + tl + '\nLIST:\n  ' + li + '\nCALLOUTS:\n  ' + co + '\nMATH: ' + mt;
        });
        console.log(`\n==== ${tab} | ${JSON.stringify(st)} | absorb=${ab} | effort=${ef}\n${t}`);
      }
    }
  }
  console.log('ERRS', p.errs);
  await H.close();
})();
