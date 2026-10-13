const { open } = require('./page.js');
(async () => {
  const H = await open();
  await H.load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'easy', cLogD: 2, logKg: 7 });
  await H.pick('#duo-effort', 'allout');
  let r = await H.items('duo-bay');
  console.log('PARTNER ALLOUT', JSON.stringify({ verdict: r.verdict, effort: r.effort, tiles: r.tiles, happens: r.happens }, null, 1));
  await H.pick('#duo-effort', 'plaster');
  r = await H.items('duo-bay');
  console.log('PARTNER PLASTER', JSON.stringify({ effort: r.effort }, null, 1));
  console.log(H.errs);
  await H.browser.close();
})();
