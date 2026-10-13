const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ oSame: false, oLogKg: 3, logKg: 3.3 }, { oSame: false, oLogKg: 4, logKg: 7 }, { wrestleMove: 'shove', logKg: 6 }]) {
    const tab = st.wrestleMove ? 'wrestle' : 'arm';
    await load(page, st, tab, true);
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    const t = await text(page, 'duo-bay');
    const i = t.indexOf('OLLIE\n');
    console.log('=== ' + tab + ' ' + JSON.stringify(st) + '\n', t.slice(i, i + 3000).split('\n').filter(l => /shak|ground|pin|Pin|kg·m\/s|plaster|felt|Effort|Courtesy/i.test(l)).join('\n'));
  }
  console.log(errs);
  await browser.close();
})();
