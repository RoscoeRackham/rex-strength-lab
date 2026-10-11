const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[768, 1024], [1024, 768], [360, 740]]) {
    const { ctx, p } = await open(b, w, h, 'light');
    const ids = await p.evaluate(() => Array.from(document.querySelectorAll('.fig[data-id]')).map((c) => c.getAttribute('data-id')));
    const bad = [];
    for (const id of ids) {
      await p.focus(`.fig[data-id="${id}"]`);
      await p.keyboard.press('Enter');
      await p.waitForTimeout(30);
      const r = await p.evaluate(() => {
        const a = document.activeElement, cl = document.querySelector('#drawer .close').getBoundingClientRect(), hd = document.getElementById('drawerH').getBoundingClientRect();
        const top = document.elementFromPoint(cl.left + cl.width / 2, cl.top + cl.height / 2);
        const onscreen = cl.top >= 0 && cl.bottom <= window.innerHeight;
        const hTop = document.elementFromPoint(hd.left + 5, hd.top + hd.height / 2);
        return { focus: a && a.id, closeVisible: onscreen && top && top.closest('.close') != null, headVisible: hd.top >= 0 && hd.bottom <= window.innerHeight && !!hTop && hTop.closest('#drawer') != null };
      });
      if (r.focus !== 'drawerH' || !r.closeVisible || !r.headVisible) bad.push(id + ' ' + JSON.stringify(r));
      await p.keyboard.press('Escape');
      const back = await p.evaluate((id) => document.activeElement && document.activeElement.getAttribute('data-id') === id, id);
      if (!back) bad.push(id + ' focus not returned');
    }
    console.log(w, h, bad.length ? bad.slice(0, 10).join('\n   ') + ' (' + bad.length + ')' : 'all ' + ids.length + ' ok');
    await ctx.close();
  }
  await b.close();
})();
