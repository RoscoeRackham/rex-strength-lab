const H = require('./h.js');
(async () => {
  let p = await H.open({ action: 'jump', logKg: 12, surface: 'concrete' });
  await H.tab(p, 'jump');
  await H.sel(p, 'effort', 'windows');
  let t = await H.settle(p, 40000);
  const i = t.indexOf('EFFORT (GENTLE');
  console.log(t.slice(i + 26, i + 1500));
  await H.close();
})();
