const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[360, 740], [768, 1024], [1024, 768]]) {
    const { ctx, p } = await open(b, w, h, 'light');
    const r = await p.evaluate(async () => {
      const out = [];
      for (const s of window.__bc.SEQ.filter((x) => x.kind !== 'end')) {
        document.getElementById(s.id).scrollIntoView({ block: 'start' });
        await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
        const loc = document.getElementById('locator').getBoundingClientRect(), tag = document.querySelector('#' + s.id + ' .tag').getBoundingClientRect();
        if (tag.top < loc.bottom - 0.5) out.push(s.id + ' tag top ' + Math.round(tag.top) + ' under locator bottom ' + Math.round(loc.bottom));
      }
      return out;
    });
    console.log(w, r.length ? r.join(' | ') : 'all stop tags clear of the locator');
    await ctx.close();
  }
  await b.close();
})();
