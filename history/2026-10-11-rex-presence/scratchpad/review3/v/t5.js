const H = require('./h.js');
(async () => {
  let p = await H.open({ group: 'duo', duoAction: 'wrestle', wrestleMove: 'push' });
  await H.tab(p, 'wrestle', true);
  let t = await H.settle(p, 30000);
  console.log(t.slice(0, 2500));
  // shove
  await p.close();
  p = await H.open({ group: 'duo', duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' });
  await H.tab(p, 'wrestle', true);
  t = await H.settle(p, 30000);
  console.log('======= SHOVE both\n', t.slice(0, 2500));
  await p.close();
  await H.close();
})();
