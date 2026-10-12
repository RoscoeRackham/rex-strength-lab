const H = require('./h.js');
(async () => {
  const p = await H.open({ group: 'duo', duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'rex' });
  await H.tab(p, 'wrestle', true);
  await p.waitForTimeout(1500);
  for (let i = 0; i < 40; i++) { const t = await H.text(p); if (!/working it out/.test(t)) break; await p.waitForTimeout(500); }
  let t = await H.text(p);
  console.log(t.split('\n').filter((l) => /throw|Throw|Effort|ceiling|Lands|harm|breaks/.test(l)).slice(0, 14).join('\n'));
  await p.selectOption('#duo-effort', 'allout'); await p.waitForTimeout(1500);
  t = await H.text(p);
  console.log('--- allout\n' + t.split('\n').filter((l) => /Lands|Ollie flies|m\/s/.test(l)).slice(0, 8).join('\n'));
  await H.close();
})();
