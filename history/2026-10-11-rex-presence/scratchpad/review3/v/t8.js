const H = require('./h.js');
(async () => {
  let p = await H.open({ action: 'weight', growS: 0 });
  await H.tab(p, 'weight');
  await H.sel(p, 'absorb', 'runaway');
  await p.click('#grow-what-chicxulub'); await p.waitForTimeout(500);
  let t = await H.bay(p);
  for (const l of t.split('\n')) if (/Runaway loop|Only his own gravity|absorbed\./.test(l)) console.log(l);
  await H.close();
})();
