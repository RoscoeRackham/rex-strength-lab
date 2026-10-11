const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const fix of [false, true]) {
    const q = await open(b, { width: 720, height: 900, skel: 'task' });
    if (fix) await q.addStyleTag({ content: '@media (min-width: 720px) and (max-width: 899px) { .drawer { grid-template-columns: minmax(0, 1fr) !important; padding: 16px; gap: 18px; } }' });
    await q.click('.fig[data-id="ansur2_m_p50"]'); await q.waitForTimeout(100);
    const r = await q.evaluate(() => { const iw = document.documentElement.clientWidth; const out = []; document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); if (r.right > iw + 0.5 && r.width) out.push(el.tagName + '#' + el.id + '.' + (el.className.baseVal != null ? el.className.baseVal : el.className) + ' ' + Math.round(r.left) + '-' + Math.round(r.right)); }); return { sw: document.documentElement.scrollWidth, iw, cols: getComputedStyle(document.getElementById('drawer')).gridTemplateColumns, out: out.slice(0, 8) }; });
    console.log(fix, JSON.stringify(r));
    await q._ctx.close();
  }
  await b.close();
})();
