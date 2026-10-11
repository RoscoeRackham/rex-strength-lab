const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const [w, touch] of [[390, true], [1280, false]]) {
    const p = await open(b, { width: w, height: 900, skel: 'host', touch });
    const info = await p.evaluate(() => { const bc = window.__bc; const g = bc.GAPS[bc.GAPS.length - 1]; return { lastGap: [g.from, g.to, g.above], MEAT: bc.MEAT, stops: bc.SEQ.filter(s => s.kind !== 'end').slice(-3).map(s => [s.id, s.lo, s.hi]) }; });
    console.log(w, JSON.stringify(info));
    for (const host of ['glance', 'locTape']) for (const s of [700, 900, 924, 960, 1000]) {
      await p.evaluate(() => window.scrollTo(0, 0));
      if (host === 'locTape') { await p.evaluate(() => document.getElementById('stops').scrollIntoView()); await p.waitForTimeout(50); }
      const pt = await p.evaluate(({ host, s }) => { const h = document.getElementById(host); const r = h.getBoundingClientRect(); return { x: r.left + h._X(s), y: r.top + 6 }; }, { host, s });
      if (touch) await p.touchscreen.tap(pt.x, pt.y); else await p.mouse.click(pt.x, pt.y);
      await p.waitForTimeout(150);
      const res = await p.evaluate(() => { const st = window.__bc.SEQ.filter(s => s.kind !== 'end'); let cur = null, bd = 1e9; st.forEach(s => { const el = document.getElementById(s.id); const d = Math.abs(el.getBoundingClientRect().top - 60); if (d < bd) { bd = d; cur = s.id + '@' + Math.round(el.getBoundingClientRect().top); } }); return { cur, loc: document.getElementById('locNow').textContent }; });
      console.log('  ', host, s, JSON.stringify(res));
    }
    await p._ctx.close();
  }
  await b.close();
})();
// cluster button check
(async () => {
  await new Promise(r => setTimeout(r, 100));
})();
