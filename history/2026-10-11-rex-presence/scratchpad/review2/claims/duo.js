const H = require('./h.js');
(async () => {
  const combos = JSON.parse(process.argv[2]);
  for (const st of combos) {
    const p = await H.open(Object.assign({ group: 'duo' }, st));
    if (st._effort) { await p.selectOption('#duo-effort', st._effort); }
    await p.waitForTimeout(500);
    let t = await H.waitDone(p, 120000);
    await H.openAll(p);
    t = await p.evaluate(() => {
      const b = document.querySelector('#bay');
      const v = b.querySelector('.verdict'); const sr = b.querySelector('.status-row'); const er = b.querySelector('.effort-read');
      const happ = [...b.querySelectorAll('ul.happens li')].map((x) => '  • ' + x.innerText).join('\n');
      const tl = [...b.querySelectorAll('.tile')].map((x) => x.innerText.replace(/\n/g, ' | ')).join('\n  ');
      const co = [...b.querySelectorAll('.callout')].map((x) => 'CALLOUT: ' + x.innerText).join('\n');
      return 'VERDICT: ' + (v ? v.innerText : '-') + '\nCHIPS: ' + (sr ? sr.innerText.replace(/\n/g, ' / ') : '-') + '\nREADOUT: ' + (er ? er.innerText : '-') + '\n' + co + '\nTILES:\n  ' + tl + '\nHAPPENS:\n' + happ;
    });
    console.log('=========== ' + JSON.stringify(st));
    console.log(t);
    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
