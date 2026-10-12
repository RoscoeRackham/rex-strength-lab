const H = require('./h.js');
(async () => {
  for (const lk of [6, Math.log10(90718.474)]) {
    const p = await H.open({ action: 'throw', obj: 'person', logKg: lk + 1e-12, safePassenger: true });
    await H.tab(p, 'throw');
    await H.effort(p, 'allout');
    const t = await H.text(p);
    console.log('=== logKg', lk.toFixed(2), '\n' + t.split('\n').filter((l) => /Launch|Safe passenger|float|drag|Drag/.test(l)).join('\n'));
    await p.close();
  }
  await H.close();
})();
