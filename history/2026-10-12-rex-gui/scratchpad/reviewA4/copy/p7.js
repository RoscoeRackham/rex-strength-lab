const { session } = require('./lib2');
(async () => {
  const s = await session();
  for (const gh of [false, true]) {
    await s.load({ anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide', colMode: 'charge', colSrc: 'set', colGB: -4, surface: 'concrete', groundHolds: gh });
    const t = await s.text('#duo-bay');
    const v = await s.page.evaluate(() => document.querySelector('#duo-bay .verdict').textContent);
    console.log('groundHolds', gh, '\n verdict:', v, '\n chips:', await s.page.evaluate(() => [...document.querySelectorAll('#duo-bay .status-row .status, #duo-bay .status')].map(x => x.textContent).join(' | ')));
  }
  const hint = await s.page.evaluate(() => [...document.querySelectorAll('#powers .hint')].map(h => h.textContent).find(t => t.startsWith('On, a push')));
  console.log('\nHINT:', hint);
  const card = await s.page.evaluate(() => [...document.querySelectorAll('.assume div')].map(d => d.textContent).find(t => t.startsWith('Newton')));
  console.log('\nCARD:', card);
  console.log(s.errs);
  await s.browser.close();
})();
