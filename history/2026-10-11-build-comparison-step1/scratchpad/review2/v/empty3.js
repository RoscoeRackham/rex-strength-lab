const { open, S } = require('./h.js');
(async () => {
  const { browser, p } = await open(390, 844, 'light', { deviceScaleFactor: 2 });
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => !!document.getElementById('tgtFront').getAttribute('src'), null, { timeout: 60000 });
  await p.fill('#tTarget', '15'); await p.selectOption('#tShape', 'ansur2_m_p5');
  await p.click('#targetBtn');
  await p.waitForFunction(() => !/Drawing/.test(document.getElementById('targetStatus').textContent), null, { timeout: 120000 });
  console.log(await p.evaluate(() => document.getElementById('targetStatus').textContent));
  await p.evaluate(() => document.getElementById('tgtFront').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(300);
  await p.screenshot({ path: S + '/target-refused-390.png' });
  await browser.close();
})();
