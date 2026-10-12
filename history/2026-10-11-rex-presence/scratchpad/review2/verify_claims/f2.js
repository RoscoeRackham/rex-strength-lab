const H = require('./vh.js');
(async () => {
  const cases = JSON.parse(process.argv[2]);
  for (const c of cases) {
    const p = await H.open(Object.assign({ group: 'duo' }, c));
    await p.waitForTimeout(600); await H.settle(p);
    for (const [id, v] of (c._sel || [])) await H.sel(p, id, v);
    for (const id of (c._check || [])) await H.check(p, id);
    await p.waitForTimeout(600); await H.settle(p);
    const t = await p.evaluate(() => { const b = document.querySelector('#bay'); b.querySelectorAll('details').forEach((d) => { d.open = true; });
      const v = b.querySelector('.verdict'); const er = b.querySelector('.effort-read'); const sr = b.querySelector('.status-row');
      const tl = [...b.querySelectorAll('.tile')].map((x) => x.innerText.replace(/\n/g, ' | ')).join('\n  ');
      return 'VERDICT: ' + (v ? v.innerText : '-') + '\nCHIPS: ' + (sr ? sr.innerText.replace(/\n/g, ' / ') : '-') + '\nREADOUT: ' + (er ? er.innerText : '-') + '\nTILES:\n  ' + tl; });
    console.log('=====', JSON.stringify(c)); console.log(t); if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
