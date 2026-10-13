// Tab through the page from the top; for each focused control inside the sidebar, record its rect, the cue rect,
// and what elementFromPoint returns at the control's centre.
const { wrap, launch, D } = require('./common');
const extra = process.argv[2] || '';
const url = wrap(process.env.SRC || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page' + (extra ? '-fix' : '') + '.html', extra);
(async () => {
  const b = await launch();
  for (const [w, h] of [[1024, 768], [1366, 768], [1280, 720], [1920, 1080], [1280, 900]]) {
    for (const openPowers of [false, true]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } });
      const p = await ctx.newPage();
      const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto(url); await p.waitForTimeout(800);
      if (openPowers) await p.evaluate(() => { document.querySelector('#powers').open = true; });
      await p.waitForTimeout(200);
      const hits = [];
      for (let i = 0; i < 80; i++) {
        await p.keyboard.press('Tab'); await p.waitForTimeout(60);
        const r = await p.evaluate(() => {
          const a = document.activeElement, aside = document.querySelector('.panel-controls');
          if (!a || !aside.contains(a)) return { out: true, id: a && (a.id || a.tagName) };
          const cue = document.querySelector('#more-below');
          const ar = a.getBoundingClientRect(), cr = cue.getBoundingClientRect();
          const cx = ar.left + ar.width / 2, cy = ar.top + ar.height / 2;
          const at = document.elementFromPoint(cx, cy);
          const ov = cue.hidden ? 0 : Math.max(0, Math.min(ar.bottom, cr.bottom) - Math.max(ar.top, cr.top));
          return { id: a.id || (a.textContent || '').trim().slice(0, 20), top: Math.round(ar.top), bot: Math.round(ar.bottom), h: Math.round(ar.height),
            cue: cue.hidden ? 'hidden' : Math.round(cr.top) + '-' + Math.round(cr.bottom), ov: Math.round(ov),
            atCue: at === cue, at: at ? (at.id || at.tagName) : null, scrollTop: Math.round(aside.scrollTop), winY: Math.round(scrollY), cueText: cue.textContent };
        });
        if (r.out) { if (hits.length) break; else continue; }
        if (r.ov > 0) hits.push(r);
      }
      console.log(`${w}x${h} powers=${openPowers}: ${hits.length} focused sidebar controls overlapped by the cue`);
      for (const r of hits) console.log('   ', JSON.stringify(r));
      if (errs.length) console.log('  ERR', errs);
      await ctx.close();
    }
  }
  await b.close();
})();
