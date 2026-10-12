const H = require('./hc.js');
const base = { surface: 'concrete', logKg: Math.log10(100 * 907.18474), inf: false, gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false, near: 5 };
const cases = [
  ['arm', {}], ['arm', { logKg: 9 }], ['arm', { logKg: 2.708 }],
  ['wrestle', { wrestleMove: 'push' }], ['wrestle', { wrestleMove: 'shove', wrestleWho: 'rex' }], ['wrestle', { wrestleMove: 'shove', wrestleWho: 'both' }],
  ['wrestle', { wrestleMove: 'lift', wrestleWho: 'rex' }], ['wrestle', { wrestleMove: 'throw', wrestleWho: 'rex', angle: 45 }],
  ['wrestle', { wrestleMove: 'throw', wrestleWho: 'rex', angle: 45, logKg: 9 }],
  ['catch', { cObj: 'baseball', cStyle: 'easy', cLogD: 1 }], ['catch', { cObj: 'baseball', cStyle: 'hard', cLogD: 1 }], ['catch', { cObj: 'person', cStyle: 'hard', cLogD: 1 }], ['catch', { cObj: 'person', cStyle: 'easy', cLogD: 2, safePassenger: true }], ['catch', { cObj: 'partner', cStyle: 'easy', cLogD: 1 }], ['catch', { cObj: 'car', cStyle: 'hard', cLogD: 2 }],
  ['collide', { colMode: 'charge', colSrc: 'sprint', colWho: 'ollie' }], ['collide', { colMode: 'charge', colSrc: 'jump', colWho: 'ollie' }], ['collide', { colMode: 'charge', colSrc: 'stomp', colWho: 'ollie' }], ['collide', { colMode: 'push', colWho: 'ollie' }], ['collide', { colMode: 'charge', colSrc: 'set', colGB: Math.log10(1000 / 299792458), colWho: 'ollie' }],
];
(async () => {
  const p = await H.open();
  for (const [tab, st] of cases) {
    await H.setState(p, Object.assign({}, base, st));
    await H.tab(p, tab);
    for (const ef of ['least', 'allout']) {
      await H.sel(p, '#duo-effort', ef);
      const ok = await H.settle(p, 120000);
      const t = await p.evaluate(() => {
        const b = document.getElementById('bay');
        b.querySelectorAll('details').forEach((d) => d.open = true);
        const vs = [...b.querySelectorAll('.verdict')].map((v) => v.innerText).join(' / ');
        const sr = [...b.querySelectorAll('.status-row')].map((s) => s.innerText.replace(/\n/g, ' · ')).join(' || ');
        const er = b.querySelector('.effort-read');
        const tl = [...b.querySelectorAll('.tile')].map((t) => t.innerText.replace(/\n/g, ' | ')).join(' ;; ');
        const co = [...b.querySelectorAll('.callout')].map((x) => x.innerText.replace(/\n/g, ' / ')).join('\n  // ');
        const li = [...b.querySelectorAll('.happens li')].map((x) => x.innerText).join('\n  ');
        return 'VERDICT: ' + vs + '\nCHIPS: ' + sr + '\nEFFORT: ' + (er ? er.innerText : '-') + '\nTILES: ' + tl + '\nCALLOUTS: ' + co + '\nLIST:\n  ' + li;
      });
      console.log(`\n==== ${tab} | ${JSON.stringify(st)} | ${ef} ${ok ? '' : '(NOT SETTLED)'}\n${t}`);
    }
  }
  console.log('ERRS', p.errs);
  await H.close();
})();
