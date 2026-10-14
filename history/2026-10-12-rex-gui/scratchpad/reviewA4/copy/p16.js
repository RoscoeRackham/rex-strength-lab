const { session } = require('./lib2');
(async () => {
  const s = await session();
  const out = {};
  for (const anchor of ['friction', 'bolted']) {
    await s.load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', anchor, surface: 'ice' });
    await s.page.selectOption('#duo-effort', 'allout'); await s.stable();
    out[anchor] = await s.text('#duo-bay');
  }
  const fl = out.friction.split('\n'), bl = out.bolted.split('\n'); const fs = new Set(fl), bs = new Set(bl);
  console.log('only standing:', fl.filter(x => !bs.has(x)));
  console.log('only bolted:', bl.filter(x => !fs.has(x)));
  await s.browser.close();
})();
