const H = require('./h.js');
(async () => {
  for (const mode of ['instant', 'gradual']) {
    const p = await H.open({ action: 'clap', logKg: 24 + 1e-12, silentStrike: true });
    await H.tab(p, 'clap');
    await H.absorb(p, mode);
    await H.effort(p, 'allout');
    const t = await H.text(p);
    console.log('===', mode, '\n' + t.split('\n').filter((l) => /Courtesy ceiling|windows break|thrown|Over |harmless|absorbed|Silent strike/.test(l)).join('\n'));
    await p.close();
  }
  await H.close();
})();
