const { open, close } = require('./h.js');
(async () => {
  const sets = [['comic 2m', {}], ['comic kaiju', { H: 50, m: 180 * 15625 }], ['real kaiju', { mode: 'real', H: 50, m: 180 * 15625 }], ['comic plush', { H: 0.4, m: 180 * 0.008 }], ['real plush', { mode: 'real', H: 0.4, m: 180 * 0.008 }], ['comic 500m', { H: 500, m: 180 * 15625000 }], ['comic 2m sand', { surface: 'sand' }], ['comic 2m comicground', { groundHolds: true }]];
  for (const [name, st] of sets) {
    const { page, ctx } = await open({ w: 1280, h: 900, state: Object.assign({ action: 'lift' }, st), wait: 0 });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 120000 });
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => ({ th: [...document.querySelectorAll('#ladder-viz .mk[data-key^="R:"]')].map(g => g.getAttribute('aria-label').replace('. Set strength here.', '')), never: document.querySelector('#ladder-never').innerText.replace(/\n/g, ' / ') }));
    console.log('== ' + name + '\n  ' + r.th.join('\n  ') + '\n  NEVER: ' + r.never);
    await ctx.close();
  }
  await close();
})();
