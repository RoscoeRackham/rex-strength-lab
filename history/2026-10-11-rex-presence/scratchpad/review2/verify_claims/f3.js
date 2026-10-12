const H = require('./vh.js');
(async () => {
  const cases = JSON.parse(process.argv[2]);
  for (const c of cases) {
    const p = await H.open(Object.assign({ group: 'solo' }, c));
    await H.settle(p);
    for (const id of (c._check || [])) await H.check(p, id);
    for (const [id, v] of (c._sel || [])) await H.sel(p, id, v);
    await H.settle(p);
    const t = await p.evaluate((re) => { const b = document.querySelector('#bay'); b.querySelectorAll('details').forEach((d) => { d.open = true; });
      const v = b.querySelector('.verdict'); const er = b.querySelector('.effort-read'); const sr = b.querySelector('.status-row');
      return 'VERDICT: ' + (v ? v.innerText : '-') + '\nCHIPS: ' + (sr ? sr.innerText.replace(/\n/g, ' / ') : '-') + '\nREADOUT: ' + (er ? er.innerText : '-'); });
    console.log('=====', JSON.stringify(c)); console.log(t);
    if (c._grep) { const all = await H.text(p); console.log('--- grep'); console.log(all.split('\n').filter((l) => new RegExp(c._grep, 'i').test(l)).join('\n')); }
    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
