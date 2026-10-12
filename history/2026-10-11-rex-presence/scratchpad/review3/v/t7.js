const H = require('./h.js');
(async () => {
  for (const [tab, eff] of [['throw', 'allout'], ['throw', 'windows'], ['jump', 'allout']]) {
    let p = await H.open({ action: tab, inf: true, surface: 'concrete', obj: 'car', angle: 45 });
    await H.tab(p, tab);
    await H.sel(p, 'effort', eff);
    let t = await H.settle(p, 60000);
    const i = t.indexOf('EFFORT (GENTLE');
    console.log('=====', tab, eff, '\n', t.slice(i + 26, i + 1600));
    await p.close();
  }
  await H.close();
})();
