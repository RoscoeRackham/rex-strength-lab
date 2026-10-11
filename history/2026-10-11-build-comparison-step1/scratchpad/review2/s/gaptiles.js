const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 900]]) {
    const { ctx, p } = await open(b, w, h, 'light');
    for (const hm of ['#hSame', '#hReal']) {
      await p.click(hm);
      const r = await p.evaluate(() => Array.from(document.querySelectorAll('.gaptile')).map((t) => {
        const tr = t.getBoundingClientRect();
        const labs = Array.from(t.querySelectorAll('span')).map((s) => ({ c: s.className, t: s.textContent, r: s.getBoundingClientRect() }));
        const out = labs.filter((l) => l.r.left < tr.left - 0.5 || l.r.right > tr.right + 0.5 || l.r.top < tr.top - 0.5 || l.r.bottom > tr.bottom + 0.5).map((l) => 'OUT ' + l.t);
        const ov = [];
        for (let i = 0; i < labs.length; i++) for (let j = i + 1; j < labs.length; j++) { const a = labs[i].r, c = labs[j].r; if (Math.min(a.right, c.right) - Math.max(a.left, c.left) > 0.5 && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 0.5) ov.push(labs[i].t + ' x ' + labs[j].t); }
        // svg wall height vs figure cell height
        const cell = document.querySelector('.fig svg').getBoundingClientRect().height;
        return t.getAttribute('data-gap') + ' h' + Math.round(tr.height) + (out.length ? ' ' + out.join(',') : '') + (ov.length ? ' OVERLAP ' + ov.join(',') : '');
      }));
      console.log(w, hm, r.join(' | '));
    }
    await ctx.close();
  }
  await b.close();
})();
