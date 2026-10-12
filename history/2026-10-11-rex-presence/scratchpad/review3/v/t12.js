const H = require('./h.js');
(async () => {
  let p = await H.open({ action: 'walk', surface: 'concrete', walkD: 3, pace: 'walk' });
  await H.tab(p, 'walk');
  let t = await H.bay(p);
  const i = t.indexOf('At 3 m'); console.log(t.slice(i, i + 900));
  for (const pace of ['stroll', 'fast']) {
    await p.click('#pace-' + pace); await p.waitForTimeout(500);
    t = await H.bay(p); const j = t.indexOf('At 3 m'); console.log('---', pace, t.slice(j, j + 200));
    for (const l of t.split('\n')) if (/^Pace:|Canon says|^\(\d\)/.test(l)) console.log('   ', l.slice(0, 300));
  }
  await H.close();
})();
