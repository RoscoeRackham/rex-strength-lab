const { session } = require('./lib2');
(async () => {
  const s = await session();
  for (const [a, gnd, L, eff] of [['punch', 'concrete', Math.log10(100 * 907.18474), 'least'], ['punch', 'concrete', 8, 'allout'], ['pull', 'concrete', Math.log10(100 * 907.18474), 'least'], ['pull', 'ice', 8, 'allout']]) {
    const out = {};
    for (const anchor of ['friction', 'bolted']) {
      await s.load({ action: a, surface: gnd, logKg: L, anchor });
      if (eff === 'allout') { await s.page.selectOption('#effort', 'allout'); await s.stable(); }
      out[anchor] = await s.text('#bay');
      out[anchor + 'math'] = await s.page.evaluate(() => { const d = document.querySelector('#bay details.math .eq'); return d ? d.textContent : null; });
    }
    console.log('=====', a, gnd, L.toFixed(2), eff);
    const fl = out.friction.split('\n'), bl = out.bolted.split('\n'); const fs = new Set(fl), bs = new Set(bl);
    console.log(' only standing:', JSON.stringify(fl.filter(x => !bs.has(x)), null, 1));
    console.log(' only bolted  :', JSON.stringify(bl.filter(x => !fs.has(x)), null, 1));
    console.log(' bolted math:', out.boltedmath);
  }
  await s.browser.close();
})();
