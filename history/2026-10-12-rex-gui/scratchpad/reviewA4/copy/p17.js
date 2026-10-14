const { session } = require('./lib2');
(async () => {
  const s = await session();
  const out = {};
  for (const anchor of ['friction', 'bolted']) {
    await s.load({ action: 'stomp', surface: 'concrete', logKg: 8, anchor });
    await s.page.selectOption('#effort', 'allout'); await s.stable();
    out[anchor] = await s.text('#bay');
  }
  const fl = out.friction.split('\n'), bl = out.bolted.split('\n'); const fs = new Set(fl), bs = new Set(bl);
  console.log('only standing:', fl.filter(x => !bs.has(x)).slice(0, 10));
  console.log('only bolted:', bl.filter(x => !fs.has(x)).slice(0, 10));
  // Collide stomp-launch with Rex bolted as charger
  await s.load({ duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'rex', colSrc: 'stomp', anchor: 'bolted' });
  await s.page.selectOption('#duo-effort', 'allout'); await s.stable();
  console.log('collide stomp bolted charger verdict:', await s.page.evaluate(() => document.querySelector('#duo-bay .verdict').textContent));
  await s.browser.close();
})();
