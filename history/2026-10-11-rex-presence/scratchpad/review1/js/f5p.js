const H = require('./h.js');
(async () => {
  for (const sid of ['sand', 'softclay']) for (const mv of ['sprint', 'throw', 'jump']) {
    const p = await H.open({ action: mv, surface: sid });
    await H.tab(p, mv);
    await H.settle(p);
    const t = await H.text(p);
    const L = t.split('\n');
    const i = L.findIndex((l) => /^Effort:|All-out\./.test(l));
    console.log('===', sid, mv, '\n', L.slice(Math.max(0, i - 4), i + 4).join('\n'));
    console.log(L.filter((l) => /Top speed|Footprint|gives way|sinks|Sinks/.test(l)).slice(0, 6).join('\n'));
    await p.close();
  }
  const p = await H.open({ action: 'walk', surface: 'sand' });
  await H.tab(p, 'walk');
  const t = await H.text(p);
  console.log('=== walk sand\n', t.split('\n').filter((l, i, a) => /Ground under each step|Footprint/.test(l) || /Ground under each step|Footprint/.test(a[i - 1] || '') || /Ground under each step|Footprint/.test(a[i - 2] || '')).join(' | '));
  await H.close();
})();
