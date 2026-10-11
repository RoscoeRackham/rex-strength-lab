const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  const widths = (process.argv[2] || '700,719,720,768,800,819,820,900').split(',').map(Number);
  for (const skel of ['host', 'task']) for (const w of widths) {
    const p = await open(b, { width: w, height: 900, skel });
    const r = await p.evaluate(async () => {
      const ids = Array.from(document.querySelectorAll('.fig[data-id]')).map(c => c.getAttribute('data-id'));
      const uniq = [...new Set(ids)];
      let bad = [], maxOver = 0, worst = null, base = document.documentElement.scrollWidth;
      for (const id of uniq) {
        const c = document.querySelector('.fig[data-id="' + id + '"]'); c.click();
        await new Promise(r => setTimeout(r, 0));
        const sw = document.documentElement.scrollWidth, iw = document.documentElement.clientWidth;
        const d = document.getElementById('drawer'), dr = d.getBoundingClientRect();
        let over = 0, who = '';
        d.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.width && r.right - dr.right > over) { over = r.right - dr.right; who = el.tagName + '.' + (el.className.baseVal != null ? el.className.baseVal : el.className) + ' ' + (el.textContent || '').slice(0, 20); } });
        if (sw > iw) bad.push(id + ':' + (sw - iw));
        if (over > maxOver) { maxOver = over; worst = id + ' ' + who; }
        document.getElementById('drawerClose').click();
      }
      return { n: uniq.length, base, bad: bad.length, sample: bad.slice(0, 4), maxOverDrawer: Math.round(maxOver * 10) / 10, worst };
    });
    console.log(skel, w, JSON.stringify(r));
    await p._ctx.close();
  }
  await b.close();
})();
