const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const which of ['branch', 'main']) for (const [w, h] of [[360, 740], [390, 844]]) {
    const page = await open(b, { which, w, h, state: null, wait: 3000 });
    const r = await page.evaluate(() => {
      const y = (s) => { const n = document.querySelector(s); return n ? Math.round(n.getBoundingClientRect().top + scrollY) : null; };
      return { tabs: y('#tabs'), verdict: y('#bay .verdict'), asideTop: y('aside'), asideBottom: Math.round(document.querySelector('aside').getBoundingClientRect().bottom + scrollY), duo: y('#duo'), powers: y('#powers'), ground: y('#ground-sec') || y('#surface') };
    });
    console.log(which, w + 'x' + h, JSON.stringify(r), 'verdict screens down:', (r.verdict / h).toFixed(2));
    if (which === 'branch') await page.screenshot({ path: S + '/shots/phone-first-' + w + '.png' });
    await page.context().close();
  }
  await b.close();
})();
