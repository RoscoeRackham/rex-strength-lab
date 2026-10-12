const H = require('./h.js');
(async () => {
  for (const [st, tab, eff] of [[{ logKg: 12, surface: 'concrete' }, 'jump', 'ceiling'], [{ obj: 'person', angle: 45 }, 'throw', 'least']]) {
    let p = await H.open(Object.assign({ action: tab }, st));
    await H.tab(p, tab);
    if (eff !== 'least') await H.sel(p, 'effort', eff);
    let t = await H.settle(p, 40000);
    console.log('=====', tab, eff);
    for (const l of t.split('\n')) if (/Effort:|Courtesy ceiling|past /.test(l)) console.log(l);
    await p.close();
  }
  await H.close();
})();
