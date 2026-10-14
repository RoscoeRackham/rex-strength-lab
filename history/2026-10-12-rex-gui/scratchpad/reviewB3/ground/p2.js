const { open } = require('./page.js');
(async () => {
  const H = await open();
  await H.load({ action: 'pull', obj: 'bus', logKg: 6, anchor: 'bolted' });
  await H.pick('#effort', 'allout');
  let r = await H.items('bay');
  console.log('BOLTED ALLOUT', JSON.stringify({ verdict: r.verdict, status: r.status, effort: r.effort, happens: r.happens }, null, 1));
  await H.pick('#effort', 'plaster');
  r = await H.items('bay');
  console.log('BOLTED PLASTER', JSON.stringify({ effort: r.effort }, null, 1));
  await H.load({ action: 'pull', obj: 'bus', logKg: 6, anchor: 'friction' });
  await H.pick('#effort', 'allout');
  r = await H.items('bay');
  console.log('FRICTION ALLOUT', JSON.stringify({ verdict: r.verdict, status: r.status, effort: r.effort, happens: r.happens }, null, 1));
  console.log(H.errs);
  await H.browser.close();
})();
