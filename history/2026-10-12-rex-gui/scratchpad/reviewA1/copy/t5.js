const { open, settle } = require('./lib');
(async () => {
  const { browser, page, errs } = await open('new', null);
  await settle(page);
  const sums = async (label) => console.log(label.padEnd(28), '|', await page.evaluate(() => ['#powers-sum', '#setup-sum', '#duo-sum', '#ollie-sum'].map((s) => document.querySelector(s).textContent).join(' | ')));
  await sums('default');
  await page.evaluate(() => { document.querySelector('#powers').open = true; document.querySelector('#setup').open = true; });
  for (const id of ['bolt-rex', 'bolt-ollie']) { await page.click('#' + id); await page.waitForTimeout(400); await sums('+' + id); }
  await page.click('#bolt-rex'); await page.waitForTimeout(400); await sums('-bolt-rex');
  await page.click('#bolt-ollie'); await page.waitForTimeout(400); await sums('-bolt-ollie');
  for (const id of ['ground-holds', 'sw-gentle', 'sw-passenger', 'sw-silent', 'sw-soft', 'sw-cool']) { await page.click('#' + id); await page.waitForTimeout(400); await sums('+' + id); }
  await page.click('#mode-real'); await page.waitForTimeout(400); await sums('real');
  for (const m of ['gradual', 'instant', 'runaway']) { await page.selectOption('#absorb', m); await page.waitForTimeout(400); await sums(m); }
  for (const id of ['ground-holds', 'sw-gentle', 'sw-passenger', 'sw-silent', 'sw-soft', 'sw-cool']) await page.click('#' + id);
  await page.waitForTimeout(400); await sums('switches off, runaway');
  await page.click('#size-cal'); await page.waitForTimeout(400); await sums('calibration');
  await page.click('text=Kaiju (50 m)'); await page.waitForTimeout(600); await sums('kaiju');
  await page.click('#setup .chips >> text=Steel'); await page.waitForTimeout(600); await sums('kaiju steel');
  await page.evaluate(() => { document.querySelector('#duo').open = true; }); await page.waitForTimeout(500);
  await page.evaluate(() => { document.querySelector('#ollie-setup').open = true; });
  await page.click('#o-own'); await page.waitForTimeout(500); await sums('ollie own');
  await page.click('#o-inf'); await page.waitForTimeout(500); await sums('ollie inf');
  await page.click('#tab-collide'); await page.waitForTimeout(500); await sums('collide tab');
  console.log('errs', errs);
  await browser.close();
})();
