const { open, S } = require('./h.js');
(async () => {
  const { browser, p } = await open(390, 844, 'light', { deviceScaleFactor: 2 });
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => !!document.getElementById('tgtFront').getAttribute('src'), null, { timeout: 60000 });
  const shapes = await p.evaluate(() => Array.from(document.querySelectorAll('#tShape option')).map((o) => o.value));
  console.log('shapes', shapes.join(','));
  let refused = false;
  for (const t of ['15', '900']) for (const sh of shapes) {
    await p.fill('#tTarget', t); await p.selectOption('#tShape', sh);
    await p.click('#targetBtn');
    await p.waitForFunction(() => !/Drawing/.test(document.getElementById('targetStatus').textContent), null, { timeout: 120000 });
    const s = await p.evaluate(() => ({ st: document.getElementById('targetStatus').textContent.slice(0, 110), src: !!document.getElementById('tgtFront').getAttribute('src') }));
    console.log(t, sh, JSON.stringify(s));
    if (!s.src) { refused = true; break; }
  }
  if (refused) {
    await p.evaluate(() => document.getElementById('tgtFront').scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(300);
    await p.screenshot({ path: S + '/target-refused-390.png' });
  }
  await browser.close();
})();
