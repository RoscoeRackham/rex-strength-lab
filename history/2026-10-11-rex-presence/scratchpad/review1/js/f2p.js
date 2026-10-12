const H = require('./h.js');
(async () => {
  for (const [lk, soft, eff] of [[6, false, 'allout'], [6, true, 'allout'], [Math.log10(90718.474), true, 'least']]) {
    const p = await H.open({ logKg: lk + 1e-12, action: 'jump', softLanding: soft });
    await H.tab(p, 'jump');
    await H.effort(p, eff);
    const t = await H.text(p);
    console.log('=====', lk, soft, eff);
    const L = t.split("\n"); L.forEach((l, i) => { if (/Landing on the ground/.test(l)) console.log(L.slice(i, i + 3).join(" | ")); });
  }
  await H.close();
})();
