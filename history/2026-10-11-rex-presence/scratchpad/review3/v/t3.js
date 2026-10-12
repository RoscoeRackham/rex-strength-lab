const H = require('./h.js');
(async () => {
  for (const [st, tab, eff] of [[{ surface: 'sand' }, 'throw', 'least'], [{ surface: 'sand' }, 'throw', 'ground'], [{ surface: 'sand' }, 'jump', 'ground'], [{ surface: 'sand', logKg: 12 }, 'jump', 'least'], [{ surface: 'sand' }, 'stomp', 'allout'], [{ surface: 'sand' }, 'stomp', 'ground']]) {
    const p = await H.open(Object.assign({ action: tab }, st));
    await H.tab(p, tab);
    if (eff !== 'least') await H.sel(p, 'effort', eff);
    const t = await H.settle(p, 30000);
    const i = t.indexOf('EFFORT (GENTLE');
    console.log('=====', tab, JSON.stringify(st), eff, '\n', t.slice(i + 26, i + 1300));
    await p.close();
  }
  await H.close();
})();
