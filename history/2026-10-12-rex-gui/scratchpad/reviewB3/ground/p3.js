const { open } = require('./page.js');
(async () => {
  const H = await open();
  await H.load({ action: 'jump', surface: 'sand', logKg: 5 });
  await H.pick('#effort', 'allout');
  let r = await H.items('bay');
  console.log('JUMP SAND 1e5 ALLOUT', JSON.stringify({ verdict: r.verdict, status: r.status, effort: r.effort, happens: r.happens.filter(x=>/ground|push/i.test(x)) }, null, 1));
  await H.pick('#effort', 'least');
  r = await H.items('bay');
  console.log('LEAST', JSON.stringify({ verdict: r.verdict, effort: r.effort }, null, 1));
  console.log(H.errs);
  await H.browser.close();
})();
