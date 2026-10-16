const { open } = require('./h.js');
(async () => {
  const { browser, page, load, text } = await open(1280);
  const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false, silentStrike: false, softLanding: false };
  await load(Object.assign({ action: 'weight' }, OFF));
  const sw = await page.evaluate(() => ['sw-unbreakable','sw-recoil','sw-keep','sw-passenger','sw-silent','sw-soft','nkb-rex','nkb-ollie'].map((i) => i + '=' + (document.getElementById(i) || {}).checked).join(' ') + ' air=' + document.getElementById('air-absorb').value + ' absorb=' + JSON.parse(localStorage.getItem('rex-lab-v1')).absorb);
  console.log('switches:', sw);
  await page.evaluate(() => { for (const n of document.getElementById('bay').children) n.r5old = true; document.getElementById('grow-what-krakatoa').click(); });
  await page.waitForFunction(() => Array.from(document.getElementById('bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 30000 });
  const t = await page.evaluate(() => { const s = document.querySelector('#bay .tile.shimmer'); return s ? s.innerText.replace(/\n/g, ' | ') : null; });
  const hg = await page.evaluate(() => { const g = document.querySelector('#hero-glow'); return { hidden: g.hidden, s: g.dataset.strength }; });
  console.log('tile with every power off:', t); console.log('header glow:', JSON.stringify(hg));
  const sw2 = await page.evaluate(() => ['sw-unbreakable','sw-recoil','sw-keep','sw-passenger','sw-silent','sw-soft','nkb-rex','nkb-ollie'].map((i) => i + '=' + (document.getElementById(i) || {}).checked).join(' ') + ' air=' + document.getElementById('air-absorb').value);
  console.log('switches after:', sw2);
  console.log('errs', page.errs);
  await browser.close();
})();
