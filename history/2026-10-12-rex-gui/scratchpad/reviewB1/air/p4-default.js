const { withPage, DIR } = require('./page.js');
(async () => {
  const errs = await withPage(async (page, load) => {
    await load({}, null);
    const t = await page.evaluate(() => document.body.innerText);
    const i = t.indexOf('The car flies');
    console.log(t.slice(i, i + 900));
    const leg = await page.evaluate(() => [...document.querySelectorAll('.ladder-legend')].map((e) => e.innerText));
    console.log('legends:', JSON.stringify(leg));
    const el = await page.$('.viz');
    if (el) await el.screenshot({ path: DIR + '/default-throw-chart.png' });
  });
  console.log('errors', errs);
})();
