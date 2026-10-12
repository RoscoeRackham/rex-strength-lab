const H = require('./h.js');
(async () => {
  for (const [lk, soft, eff] of [[6, false, 'allout'], [6, true, 'allout'], [Math.log10(90718.474), true, 'allout']]) {
    const p = await H.open({ logKg: lk + 1e-12, action: 'jump', softLanding: soft });
    await H.tab(p, 'jump');
    await H.effort(p, eff);
    const t = await H.text(p);
    console.log('=====', lk.toFixed(2), 'soft', soft, eff);
    const L = t.split('\n');
    console.log(L.filter((l) => /Courtesy ceiling:|Plaster may crack within|Ground holds|Ground fails|Ground at/.test(l)).join('\n'));
    L.forEach((l, i) => { if (/Landing on the ground/.test(l)) console.log(L.slice(i, i + 3).join(' | ')); });
    await p.close();
  }
  const p = await H.open({ action: 'jump' });
  await H.tab(p, 'jump');
  console.log('switch label:', await p.evaluate(() => document.querySelector('#sw-soft').parentElement.innerText));
  await H.close();
})();
