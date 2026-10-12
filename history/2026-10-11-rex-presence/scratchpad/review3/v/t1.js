const H = require('./h.js');
(async () => {
  // claim 1: throw at 10^15 kg, car, 45, concrete, windows preset
  const p = await H.open({ logKg: 15, action: 'throw', obj: 'car', angle: 45, surface: 'concrete' });
  await H.tab(p, 'throw');
  await H.sel(p, 'effort', 'windows');
  let t = await H.settle(p, 30000);
  console.log(t.slice(0, 4000));
  await H.close();
})();
