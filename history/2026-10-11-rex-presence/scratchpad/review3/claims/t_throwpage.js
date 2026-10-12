const H = require('./hc.js');
(async () => {
  const p = await H.open();
  await H.setState(p, { surface: 'concrete', logKg: 15, inf: false, obj: 'car', angle: 45 });
  await H.tab(p, 'throw');
  for (const pr of ['windows', 'block', 'allout']) {
    await H.sel(p, '#effort', pr); await H.settle(p, 90000);
    const t = await p.evaluate(() => { const b = document.getElementById('bay'); b.querySelectorAll('details').forEach((d) => d.open = true); const v = b.querySelector('.verdict'), sr = b.querySelector('.status-row'), er = b.querySelector('.effort-read'); return 'VERDICT: ' + v.innerText + '\nCHIPS: ' + sr.innerText.replace(/\n/g, ' · ') + '\nEFFORT: ' + er.innerText + '\nTILES: ' + [...b.querySelectorAll('.tile')].map((t) => t.innerText.replace(/\n/g, ' | ')).join(' ;; ') + '\nITEMS: ' + [...b.querySelectorAll('.happens li')].map((x) => x.innerText).join(' // '); });
    console.log('==== ' + pr + '\n' + t);
  }
  await H.close();
})();
