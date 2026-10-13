const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const solo = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
  const duo = [['arm', 'push'], ['wrestle', 'push'], ['wrestle', 'throw'], ['catch', 'push'], ['collide', 'push']];
  const byId = {};
  for (const a of solo) for (const [d, mv] of duo) {
    const { page, ctx } = await openPage(b, 'branch', { action: a, duoAction: d, wrestleMove: mv, duoOpen: true });
    await waitIdle(page, '#duo-bay', 30000); await waitIdle(page, '#bay', 30000);
    const dups = await page.evaluate(() => { const m = {}; for (const e of document.querySelectorAll('[id]')) (m[e.id] = m[e.id] || 0, m[e.id]++); return Object.keys(m).filter((k) => m[k] > 1); });
    for (const id of dups) (byId[id] = byId[id] || []).push(a + '/' + d + (d === 'wrestle' ? ':' + mv : ''));
    await ctx.close();
  }
  for (const [id, l] of Object.entries(byId)) console.log(id + ' (' + l.length + '): ' + l.join(' '));
  await b.close();
})();
