const H = require('./h.js');
(async () => {
  const p = await H.open({ action: 'throw', obj: 'shot', logKg: 8 + 1e-12, coolFlight: true });
  await H.tab(p, 'throw');
  await H.effort(p, 'allout');
  const t = await H.text(p);
  const L = t.split('\n');
  console.log(L.filter((l) => /Cool flight|Sonic boom|absorbed|Launch|Energy|energy/.test(l)).join('\n'));
  L.forEach((l, i) => { if (/^Energy|Launch energy|Kinetic/.test(l)) console.log(L.slice(i, i + 3).join(' | ')); });
  await H.close();
})();
