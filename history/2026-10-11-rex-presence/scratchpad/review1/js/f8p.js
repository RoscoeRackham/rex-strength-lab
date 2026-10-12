const H = require('./h.js');
(async () => {
  const p = await H.open({ group: 'duo', duoAction: 'catch', cObj: 'shot', cLogD: 1, cStyle: 'hard', logKg: 8 + 1e-12, gentleHold: true, coolFlight: true });
  await H.tab(p, 'catch', true);
  await p.selectOption('#duo-effort', 'allout'); await p.waitForTimeout(2000);
  const t = await H.text(p);
  console.log(t.split('\n').filter((l) => /punch into|Gentle hold|palms press|plate|gives way|fires the shot/.test(l)).join('\n'));
  await H.close();
})();
