const H = require('./h.js');
(async () => {
  let p = await H.open({ action: 'jump', logKg: 22, softLanding: true });
  await H.tab(p, 'jump');
  await H.sel(p, 'absorb', 'gradual');
  await H.sel(p, 'effort', 'allout');
  let t = await H.settle(p, 60000);
  const i = t.indexOf('EFFORT (GENTLE'); console.log(t.slice(i + 26, i + 900));
  const n = await p.evaluate(() => document.querySelectorAll('#bay .callout').length);
  console.log('callouts', n, 'has growth text', /Gradual growth|absorbed\./.test(t));
  await H.close();
})();
