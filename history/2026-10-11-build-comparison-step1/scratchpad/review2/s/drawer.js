const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[360, 740], [768, 1024], [1024, 768], [1280, 900]]) for (const mode of [['#hSame', '#vFront'], ['#hReal', '#vSide']]) {
    const { ctx, p } = await open(b, w, h, 'light');
    await p.click(mode[0]); await p.click(mode[1]);
    const r = await p.evaluate(() => {
      const out = [];
      const ids = Array.from(document.querySelectorAll('.fig[data-id]')).map((c) => c.getAttribute('data-id'));
      ids.forEach((id) => {
        document.querySelector('.fig[data-id="' + id + '"]').click();
        const d = document.getElementById('drawer'), dr = d.getBoundingClientRect();
        const sw = document.documentElement.scrollWidth;
        const over = Array.from(d.querySelectorAll('*')).filter((el) => { const q = el.getBoundingClientRect(); return q.width && (q.right > dr.right + 0.5 || q.left < dr.left - 0.5); }).map((el) => el.tagName + '.' + (el.className.baseVal != null ? el.className.baseVal : el.className));
        // big figure inside its svg
        const svg = d.querySelector('.bigfig svg'), g = svg.querySelector('g'), sr = svg.getBoundingClientRect(), gr = g.getBoundingClientRect();
        const clip = gr.left < sr.left - 0.5 || gr.right > sr.right + 0.5 || gr.top < sr.top - 0.5 || gr.bottom > sr.bottom + 0.5;
        const cols = getComputedStyle(d).gridTemplateColumns;
        if (sw > window.innerWidth || over.length || clip) out.push(id + ' sw ' + sw + ' over ' + over.slice(0, 4).join(',') + (clip ? ' FIGURE CLIPPED ' + [gr.left - sr.left, sr.right - gr.right, gr.top - sr.top, sr.bottom - gr.bottom].map((x) => x.toFixed(0)).join('/') : ''));
        if (id === 'rex') out.push('cols ' + cols);
      });
      document.querySelector('#drawer .close').click();
      return out;
    });
    console.log(w, mode.join(' '), r.join(' | ') || 'ok');
    await ctx.close();
  }
  await b.close();
})();
