const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const [tab, st] of [['wrestle', { wrestleMove: 'throw', wAngle: 30, logKg: 16 }], ['wrestle', { wrestleMove: 'throw', wAngle: 30, logKg: 16, airAbsorb: 0.5 }], ['catch', { cObj: 'baseball', cStyle: 'hard', logKg: 22, cLogD: 3 }], ['catch', { cObj: 'partner', cStyle: 'hard', logKg: 16 }]]) {
    await load(page, st, tab, true);
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    const t = await text(page, 'duo-bay');
    console.log('=== ' + tab + ' ' + JSON.stringify(st), '| bend stated:', /bend|deflect|gravity/i.test(t), '| where it goes:', /Sun|galaxy|solar/i.test(t));
    const m = t.match(/[^.\n]*(bend|deflect|Sun|galaxy)[^.\n]*\./gi); if (m) console.log('   ', m.slice(0, 3).join(' | '));
  }
  console.log(errs);
  await browser.close();
})();
