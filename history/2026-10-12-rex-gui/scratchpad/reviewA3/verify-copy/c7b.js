const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const { ctx, page } = await open(b, 'branch', { action: 'walk', walker: 'ollie', oM: 30000 });
  await page.evaluate(() => document.querySelectorAll('#bay details').forEach(d => d.open = true));
  const t = await settle(page, '#bay');
  console.log(t);
  // also check main: where was Ollie's panel; and was walk tab same?
  await ctx.close();
  const m = await open(b, 'main', { action: 'walk', walker: 'ollie', oM: 30000 });
  console.log('MAIN ollie-setup in sidebar visible:', await m.page.evaluate(() => { const e = document.querySelector('#ollie-setup'); return e ? [e.closest('aside') ? 'aside' : 'not aside', e.open, e.querySelector('summary').innerText] : null; }));
  console.log('MAIN verdict:', (await settle(m.page, '#bay')).split('\n').filter(l => /At 3 m/.test(l)).join());
  await m.ctx.close();
  await b.close();
})();
