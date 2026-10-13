const { open } = require('./page.js');
(async () => {
  const H = await open();
  await H.load({ duoOpen: true, duoAction: 'collide', colSrc: 'jump', surface: 'sand' });
  await H.pick('#duo-effort', 'allout');
  let r = await H.items('duo-bay');
  console.log('COLLIDE JUMP SAND ALLOUT', JSON.stringify({ verdict: r.verdict, status: r.status, effort: r.effort, happens: r.happens.filter(x=>/ground|push/i.test(x)) }, null, 1));
  await H.pick('#duo-effort', 'least');
  r = await H.items('duo-bay');
  console.log('LEAST', JSON.stringify({ verdict: r.verdict, effort: r.effort }, null, 1));
  console.log(H.errs);
  await H.browser.close();
})();
