const H = require('./h.js');
(async () => {
  const p = await H.open({ action: 'throw', obj: 'car', surface: 'concrete' });
  await H.tab(p, 'throw');
  for (const e of ['least', 'rattle', 'ceiling', 'plaster']) {
    await H.effort(p, e);
    const t = await H.text(p);
    console.log('---', e, '\n' + t.split('\n').filter((l) => /^Effort|Courtesy ceiling:|Even all-out|Sonic|Air blast|Plaster may|He crushes|ground|Ground/.test(l)).slice(0, 10).join('\n'));
  }
  await H.close();
})();
