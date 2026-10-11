const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const skel of ['task', 'host', 'hosthidden']) for (const w of [390, 1280]) {
    const p = await open(b, { width: w, height: 900, skel });
    const r = await p.evaluate(() => { const d = document.getElementById('drawer'); const cs = getComputedStyle(d); const r = d.getBoundingClientRect(); const foot = document.getElementById('foot').getBoundingClientRect(); return { hidden: d.hidden, display: cs.display, h: r.height, top: Math.round(r.top + scrollY), footBottom: Math.round(foot.bottom + scrollY), parent: d.parentElement.tagName, html: d.innerHTML.length }; });
    console.log(skel, w, JSON.stringify(r));
    if (w === 390 && skel === 'host') { await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(100); await p.screenshot({ path: `${DIR}/l9-bottom-390.png` }); }
    await p._ctx.close();
  }
  await b.close();
})();
