const H = require('./vh.js');
(async () => {
  const cases = [
    { action: 'throw', obj: 'tank', logKg: 8, surface: 'concrete' },
    { action: 'throw', obj: 'semi', logKg: 7, surface: 'concrete' },
    { action: 'throw', obj: 'tank', logKg: 8, surface: 'granite' },
    { action: 'throw', obj: 'tank', logKg: 9, surface: 'granite' },
  ];
  for (const c of cases) {
    const p = await H.open(Object.assign({ group: 'solo' }, c));
    await H.settle(p);
    let t = await H.text(p);
    console.log('==== LEAST', JSON.stringify(c));
    console.log(t.split('\n').filter(l => /flies|Even all-out|Calculation|ceiling|lands|gives way|Courtesy/i.test(l)).slice(0, 12).join('\n'));
    console.log('ERRS', p.errs);
    await H.sel(p, '#effort', 'allout');
    t = await H.text(p);
    console.log('---- ALLOUT');
    console.log(t.split('\n').filter(l => /flies|Even all-out|Calculation|ceiling|lands|gives way|Courtesy|none/i.test(l)).slice(0, 12).join('\n'));
    console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
