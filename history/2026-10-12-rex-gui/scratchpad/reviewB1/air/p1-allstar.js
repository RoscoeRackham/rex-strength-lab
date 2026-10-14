const { withPage, DIR } = require('./page.js');
(async () => {
  const errs = await withPage(async (page, load) => {
    for (const [share, keep] of [[1, true], [0.5, true], [0, true], [0, false], [0.5, false]]) {
      await load({ action: 'throw', obj: 'baseball', angle: 0, logKg: Math.log10(1.81436948e23) + 1e-12, airAbsorb: share, keepForm: keep, unbreakable: true, ownRecoil: true }, 'allout');
      const t = await page.evaluate(() => { const b = document.querySelector('#bay') || document.querySelector('main'); return (b || document.body).innerText; });
      const i = t.indexOf('The baseball leaves');
      console.log('==== share', share, 'keep', keep, '\n', t.slice(i, i + 3500).replace(/\n+/g, '\n'));
    }
  });
  console.log('errors', errs);
})();
