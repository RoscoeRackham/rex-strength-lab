const H = require('./h.js');
(async () => {
  for (const [st, tab, eff] of [[{ surface: 'sand', action: 'sprint' }, 'sprint', 'rattle'], [{ surface: 'sand', action: 'sprint' }, 'sprint', 'least'], [{ surface: 'sand', action: 'pull' }, 'pull', 'rattle'], [{ logKg: 12, action: 'punch' }, 'punch', 'plaster'], [{ logKg: 12, action: 'clap' }, 'clap', 'plaster']]) {
    const p = await H.open(st);
    await H.tab(p, tab);
    if (eff !== 'least') await H.sel(p, 'effort', eff);
    const t = await H.settle(p, 30000);
    const i = t.indexOf('EFFORT (GENTLE');
    console.log('=====', tab, JSON.stringify(st), eff, '\n', t.slice(i, i + 1800));
    await p.close();
  }
  await H.close();
})();
