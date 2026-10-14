const { BR, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx } = await open(b, BR, { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus' }, { width: 1280, height: 900 });
  await page.waitForTimeout(4000);
  const snap = () => page.evaluate(() => { const v = document.querySelector('#duo-bay .verdict'); const bay = document.querySelector('#duo-bay'); return { dial: document.querySelector('.dial-read .big').textContent, verdict: v ? v.textContent.slice(0, 120) : null, first: bay.firstElementChild ? bay.firstElementChild.className + ':' + bay.firstElementChild.textContent.slice(0, 60) : null, working: /Working it out/.test(bay.textContent), cards: Array.from(bay.querySelectorAll('.fighter, .card')).slice(0, 2).map((c) => c.textContent.replace(/\s+/g, ' ').slice(0, 80)) }; });
  console.log('settled:', JSON.stringify(await snap()));
  await page.click('#duo > summary'); await page.waitForTimeout(500);
  console.log('closed? open=', await page.evaluate(() => document.querySelector('#duo').open));
  const chips = await page.evaluate(() => Array.from(document.querySelectorAll('#tier-chips .chip')).map((c) => c.textContent));
  console.log('chips', JSON.stringify(chips));
  await page.locator('#tier-chips .chip', { hasText: 'All-Star' }).click();
  await page.waitForTimeout(1500);
  console.log('dial now', await page.evaluate(() => document.querySelector('.dial-read .big').textContent));
  // reopen, and capture state at the first animation frame after toggle and over time
  await page.evaluate(() => {
    window.__log = [];
    const t0 = performance.now();
    const cap = (tag) => { const v = document.querySelector('#duo-bay .verdict'); window.__log.push({ tag, t: Math.round(performance.now() - t0), verdict: v ? v.textContent.slice(0, 90) : null, working: /Working it out/.test(document.querySelector('#duo-bay').textContent) }); };
    document.querySelector('#duo').addEventListener('toggle', () => { cap('toggle'); requestAnimationFrame(() => cap('raf1')); }, { once: true });
    const mo = new MutationObserver(() => { cap('mutation'); mo.disconnect(); });
    mo.observe(document.querySelector('#duo-bay'), { childList: true, subtree: true });
    document.querySelector('#duo > summary').click();
  });
  await page.waitForTimeout(5000);
  console.log(JSON.stringify(await page.evaluate(() => window.__log), null, 1));
  console.log('final:', JSON.stringify(await snap()));
  await ctx.close(); await b.close();
})();
