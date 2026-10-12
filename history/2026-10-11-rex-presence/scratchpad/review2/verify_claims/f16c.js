const H = require('./vh.js');
(async () => {
  const p = await H.open({ group: 'duo', duoAction: 'catch', cObj: 'shot', cStyle: 'hard', logKg: 9 });
  await p.waitForTimeout(500); await H.settle(p);
  await H.check(p, '#sw-gentle');
  await H.check(p, '#sw-cool');
  await H.sel(p, '#duo-effort', 'allout');
  await p.waitForTimeout(800); await H.settle(p);
  const t = await H.text(p);
  console.log(t.split('\n').filter((l) => /cool|heat|absorbed|air takes/i.test(l)).join('\n'));
  await p.close(); await H.close();
})();
