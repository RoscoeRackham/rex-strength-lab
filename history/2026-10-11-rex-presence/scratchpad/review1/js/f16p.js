const H = require('./h.js');
(async () => {
  for (const mv of ['punch', 'clap']) {
    const p = await H.open({ action: mv, logKg: 14.13, silentStrike: true });
    await H.tab(p, mv);
    await H.effort(p, 'allout');
    const t = await H.text(p);
    const L = t.split('\n');
    console.log('=====', mv);
    L.forEach((l, i) => { if (/Air at the knuckles|Silent strike|thunderclap|blast|Damage radius|Windows shatter/.test(l)) console.log(L.slice(i, i + (/knuckles/.test(l) ? 3 : 1)).join(' | ')); });
    console.log('ARIA:', await H.aria(p));
    await p.close();
  }
  await H.close();
})();
