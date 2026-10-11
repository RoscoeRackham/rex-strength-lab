const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const w of [390, 1280]) {
    const p = await open(b, { width: w, height: 900, skel: 'host' });
    const r = await p.evaluate(() => {
      const bc = window.__bc; const g0 = bc.GAPS[0];
      const hum = bc.LIST.filter(e => e.group !== 'Comic characters' && e.group !== 'Rex and Ollie');
      const top = hum.reduce((a, e) => e.score.hi > a.score.hi ? e : a);
      const below = bc.LIST.find(e => e.id === g0.below);
      const atGap = bc.LIST.filter(e => Math.abs(e.score.hi - g0.from) < 1e-6).map(e => e.id + ' ' + e.group);
      return { clusters: Array.from(document.querySelectorAll('#clusters button')).map(x => x.textContent), HUMAN_TOP: bc.HUMAN_TOP, topHuman: top.id, gap0: { from: g0.from, to: g0.to, below: g0.below }, belowGroup: below && below.group, atGap,
        rule: (document.querySelector('.rule-end') || {}).textContent, gapVerdict: document.querySelector('#empty .verdict') && document.querySelector('#empty .verdict').textContent };
    });
    console.log(w, JSON.stringify(r, null, 1));
    await p._ctx.close();
  }
  await b.close();
})();
