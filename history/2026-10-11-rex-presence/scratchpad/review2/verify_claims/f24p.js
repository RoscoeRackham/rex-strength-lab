const H = require('./vh.js');
(async () => {
  for (const [obj, lk] of [['tank', 9]]) {
    const p = await H.open({ group: 'solo', action: 'throw', obj, logKg: lk, groundHolds: true });
    await H.settle(p);
    await H.check(p, '#sw-gentle');
    try { await H.sel(p, '#effort', 'allout'); } catch (e) { console.log('== ', obj, lk, 'crash/no control', p.errs.map((x) => x.split('\n')[0])); await p.close(); continue; }
    await H.settle(p);
    const t = await H.text(p);
    console.log('== ', obj, lk);
    console.log(t.split('\n').filter((l) => /flies|shoved|Courtesy ceiling:|None of the hazards|Where each|from .*happens now|Sonic/i.test(l)).map((l) => '  ' + l.slice(0, 300)).join('\n'));
    await p.close();
  }
  await H.close();
})();
