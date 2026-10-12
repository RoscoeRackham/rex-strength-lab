const H = require('./h.js');
(async () => {
  let p = await H.open({ action: 'throw', obj: 'car', angle: 45, surface: 'concrete' });
  await H.tab(p, 'throw');
  let t = await H.settle(p, 30000);
  for (const l of t.split('\n')) if (/^Drive:|Effort:/.test(l)) console.log(l);
  await H.close();
})();
