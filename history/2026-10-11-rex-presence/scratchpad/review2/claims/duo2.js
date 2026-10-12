const H = require('./h.js');
(async () => {
  const combos = JSON.parse(process.argv[2]);
  for (const st of combos) {
    const p = await H.open(Object.assign({ group: 'duo' }, st));
    await p.waitForTimeout(400);
    await H.waitDone(p, 120000);
    if (st._own) { await p.evaluate(() => { document.querySelectorAll('#bay details').forEach((d) => { d.open = true; }); }); await p.click('#o-effort-own'); await p.waitForTimeout(400); await H.waitDone(p, 120000);
      if (st._oval != null) { await p.evaluate((v) => { const s = document.querySelector('#o-effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, st._oval); await p.waitForTimeout(800); await H.waitDone(p, 120000); } }
    if (st._effort) { await p.selectOption('#duo-effort', st._effort); await p.waitForTimeout(400); await H.waitDone(p, 120000); }
    if (st._val != null) { await p.evaluate((v) => { const s = document.querySelector('#duo-effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, st._val); await p.waitForTimeout(800); await H.waitDone(p, 120000); }
    await H.openAll(p);
    const t = await p.evaluate(() => {
      const b = document.querySelector('#bay');
      const v = b.querySelector('.verdict'); const sr = b.querySelector('.status-row'); const er = b.querySelector('.effort-read');
      return 'VERDICT: ' + (v ? v.innerText : '-') + '\nCHIPS: ' + (sr ? sr.innerText.replace(/\n/g, ' / ') : '-') + '\nREADOUT: ' + (er ? er.innerText : '-');
    });
    console.log('=========== ' + JSON.stringify(st)); console.log(t);
    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
