const H = require('./h.js');
(async () => {
  for (const sid of ['concrete', 'granite']) {
    const p = await H.open({ action: 'walk', surface: sid, walker: 'rex' });
    await H.tab(p, 'walk');
    const t = await H.text(p);
    console.log('=== walk', sid, '\n', t.split('\n').filter((l) => /Canon says|Presence stops/.test(l)).join('\n'));
    await p.close();
    const q = await H.open({ action: 'stomp', surface: sid, near: 3 });
    await H.tab(q, 'stomp');
    for (const e of ['plaster', 'rattle', 'allout']) {
      await H.effort(q, e);
      const t2 = await H.text(q);
      console.log('--- stomp', sid, e, '\n', t2.split('\n').filter((l) => /Effort|Even all-out|Courtesy|Ground shaking|feel|Plaster/.test(l)).slice(0, 12).join('\n'));
    }
  }
  await H.close();
})();
