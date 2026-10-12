const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  for (const soft of [false, true]) {
    const p = await open('wt', { action: 'jump', group: 'solo', surface: 'sand', softLanding: soft });
    if (soft) await check(p, 'sw-soft', true);
    await range(p, 'effort-use', 4.95);
    await bay(p, 3500);
    const tiles = await p.evaluate(() => [...document.querySelectorAll('#bay .tile')].map((x) => x.innerText.replace(/\n/g, ' | ')));
    console.log('=== soft ' + soft + '\n' + tiles.filter((x) => /Landing|ground|sink/i.test(x)).join('\n'));
    await p.evaluate(() => { const d = document.querySelector('details.haz-list'); if (d) d.open = true; });
    const t = await bay(p, 300);
    console.log(grep(t, /Plaster|ground breaks|happens now|not now/i));
  }
  await close();
})();
