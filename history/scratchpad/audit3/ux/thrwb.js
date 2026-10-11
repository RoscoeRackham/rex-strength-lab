const { open, close } = require('./h.js');
(async () => {
  const { page, ctx } = await open({ w: 1280, h: 900, state: { action: 'throw', obj: 'shot', mode: 'real' } });
  await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = 1.33; s.dispatchEvent(new Event('input')); });
  const s = await page.evaluate(() => window.__snap());
  console.log(JSON.stringify({ dial: s.dial, verdict: s.verdict, tiles: s.tiles, happens: s.happens }));
  await ctx.close(); await close();
})();
