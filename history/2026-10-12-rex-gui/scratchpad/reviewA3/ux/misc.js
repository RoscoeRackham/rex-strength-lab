const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  // 320 px reflow with everything open, every duo tab
  for (const a of ['arm', 'wrestle', 'catch', 'collide']) {
    const page = await open(b, { w: 320, h: 640, state: { duoOpen: true, duoAction: a }, wait: 3000 });
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('ollie-setup').open = true; document.getElementById('setup').open = true; });
    await page.waitForTimeout(300);
    console.log('320', a, 'overflow', await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    await page.context().close();
  }
  // hidden attribute respected
  for (const absorb of ['ocean', 'gradual', 'instant']) {
    const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true }, wait: 2500 });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.selectOption('#absorb', absorb); await page.waitForTimeout(400);
    console.log('absorb', absorb, await page.evaluate(() => JSON.stringify({ shownHidden: Array.from(document.querySelectorAll('[hidden]')).filter((n) => n.getClientRects().length).map((n) => n.id), growFields: !!document.getElementById('grow-fields').getClientRects().length, growT: !!document.getElementById('grow-t-row').getClientRects().length })));
    await page.context().close();
  }
  // reopen after a change: placeholder in the first frame
  {
    const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus' }, wait: 6000 });
    await page.click('#duo > summary'); await page.waitForTimeout(300);
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll('#tier-chips .chip')).map((x) => x.dataset.id));
    await page.click('#tier-chips .chip[data-id="' + ids.find((i) => /star/i.test(i)) + '"]'); await page.waitForTimeout(500);
    const first = await page.evaluate(() => new Promise((res) => { document.querySelector('#duo > summary').click(); requestAnimationFrame(() => res(document.getElementById('duo-bay').textContent.slice(0, 60))); }));
    await page.waitForTimeout(6000);
    const later = await page.evaluate(() => document.querySelector('#duo-bay .verdict') && document.querySelector('#duo-bay .verdict').textContent.slice(0, 80));
    console.log('reopen first frame:', JSON.stringify(first), '| later:', later);
    await page.context().close();
  }
  await b.close();
})();
