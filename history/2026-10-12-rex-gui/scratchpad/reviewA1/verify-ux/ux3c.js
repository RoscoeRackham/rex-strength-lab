const { BR, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const [chip, extra] of [['All-Star', {}], ['Spider-Man', {}]]) {
    const { page, ctx } = await open(b, BR, Object.assign({ duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus' }, extra), { width: 1280, height: 900 });
    await page.waitForTimeout(4000);
    await page.click('#duo > summary'); await page.waitForTimeout(500);
    await page.locator('#tier-chips .chip', { hasText: chip }).click();
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      window.__log = []; const t0 = performance.now();
      const cap = (tag) => { const bay = document.querySelector('#duo-bay'); window.__log.push({ tag, t: Math.round(performance.now() - t0), dial: document.querySelector('.dial-read .big').textContent, cards: Array.from(bay.querySelectorAll('.fighter')).map((c) => c.textContent.replace(/\s+/g, ' ').slice(0, 40)), working: /Working it out|working it out/.test(bay.textContent) }); };
      document.querySelector('#duo').addEventListener('toggle', () => { requestAnimationFrame(() => { cap('first frame'); }); }, { once: true });
      const mo = new MutationObserver(() => { cap('first redraw'); mo.disconnect(); });
      mo.observe(document.querySelector('#duo-bay'), { childList: true, subtree: true });
      document.querySelector('#duo > summary').click();
    });
    await page.waitForTimeout(4000);
    console.log(chip, JSON.stringify(await page.evaluate(() => window.__log), null, 1));
    await page.screenshot({ path: __dirname + '/ux3-' + chip + '.png' });
    await ctx.close();
  }
  await b.close();
})();
