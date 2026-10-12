const { open, tab } = require('./lib');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900, saved: { silentStrike: true, action: 'punch' } });
  await tab(page, 'punch', false, 2500);
  for (const m of ['instant', 'gradual', 'runaway']) {
    await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    await page.selectOption('#absorb', m); await page.waitForTimeout(1500);
    const t = await page.evaluate(() => [...document.querySelectorAll('#bay .callout')].map((e) => e.innerText).filter((x) => /absorbed/.test(x)).join('\n---\n'));
    console.log('=== ' + m + '\n' + t);
  }
  const chk = await page.evaluate(() => { const P = window.DinoPhys; const b = P.makeBody({ H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m, build: 'rex' }); return { W: b.m * 9.80665 }; });
  console.log(chk);
  await browser.close();
})();
