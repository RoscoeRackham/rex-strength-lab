const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[1366, 768], [1440, 900], [1920, 1080]]) {
    const page = await open(b, { w, h, state: { duoOpen: true, duoAction: 'arm' }, wait: 3500 });
    await page.evaluate(() => window.scrollTo(0, document.getElementById('duo').getBoundingClientRect().top + scrollY - 40)); await page.waitForTimeout(400);
    const r = await page.evaluate(() => { const a = document.querySelector('aside').getBoundingClientRect(); const s = document.getElementById('surface').getBoundingClientRect(); const p = document.querySelector('#powers > summary').getBoundingClientRect(); return { asideBottom: Math.round(a.bottom), groundTop: Math.round(s.top), powersTop: Math.round(p.top), vh: innerHeight }; });
    console.log(w + 'x' + h, JSON.stringify(r));
    await page.screenshot({ path: S + '/shots/stuck-' + w + 'x' + h + '.png' });
    await page.context().close();
  }
  // sidebar height with Size and density closed
  const page = await open(b, { w: 1280, h: 900, wait: 2500 });
  await page.evaluate(() => { document.getElementById('setup').open = false; });
  console.log('content height with Size and density closed', await page.evaluate(() => document.querySelector('aside').scrollHeight));
  await b.close();
})();
