const { open } = require('./harness.js');
(async () => {
  const h = await open('branch');
  const cases = [];
  for (const logKg of [4, 6, 8, 10]) for (const [tab, extra] of [['arm', {}], ['wrestle', { wrestleMove: 'throw' }], ['wrestle', { wrestleMove: 'shove' }], ['catch', {}], ['collide', {}], ['collide', { anchor: 'bolted' }]]) cases.push([logKg, tab, extra]);
  for (const [logKg, tab, extra] of cases) {
    await h.load(Object.assign({ duoOpen: true, duoAction: tab, logKg }, extra), 'duo-bay'); await h.settle('duo-bay', 120000);
    await h.page.selectOption('#duo-effort', 'ground'); await h.page.waitForTimeout(400); await h.settle('duo-bay', 180000);
    const rd = await h.page.evaluate(() => (document.querySelector('#duo-bay .effort-read') || {}).textContent.replace(/\s+/g, ' '));
    const vd = await h.page.evaluate(() => (document.querySelector('#duo-bay .verdict') || {}).textContent.replace(/\s+/g, ' '));
    console.log(logKg, tab, JSON.stringify(extra), '\n  READ:', rd.slice(0, 500), '\n  VERDICT:', vd.slice(0, 200));
  }
  console.log('errors', h.errs.slice(0, 3));
  await h.browser.close();
})();
