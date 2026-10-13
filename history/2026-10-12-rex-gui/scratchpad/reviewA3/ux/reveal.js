// Scroll the page top to bottom with the pointer over the results (not the sidebar), as a reader does.
// At any scroll position, is the Ground menu / the Their powers summary actually visible (inside both the viewport and
// the sidebar's visible box)? Branch vs main, first load (defaults), element closed and open.
const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const sizes = [[1280, 900], [1024, 768], [1366, 768], [1440, 900], [1536, 864], [1920, 1080]];
  for (const which of ['branch', 'main']) for (const [w, h] of sizes) for (const duo of [false, true]) {
    if (which === 'main' && duo) continue;
    const page = await open(b, { w, h, which, state: duo ? { duoOpen: true, duoAction: 'collide' } : null, wait: 3500 });
    const targets = which === 'branch' ? { ground: '#surface', powers: '#powers > summary' } : { ground: '#surface', powers: '#comic-setup > summary' };
    const r = await page.evaluate(async (targets) => {
      const aside = document.querySelector('aside');
      const seen = {}; for (const k in targets) seen[k] = null;
      const maxY = document.documentElement.scrollHeight - innerHeight;
      for (let y = 0; y <= maxY; y += 40) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => r()));
        const box = aside.getBoundingClientRect();
        const bt = parseFloat(getComputedStyle(aside).borderTopWidth) || 0;
        for (const k in targets) {
          if (seen[k] !== null) continue;
          const n = document.querySelector(targets[k]); if (!n) continue;
          const rc = n.getBoundingClientRect();
          const top = Math.max(0, box.top + bt), bottom = Math.min(innerHeight, box.bottom - bt);
          if (rc.top >= top - 1 && rc.bottom <= bottom + 1 && rc.height > 0) seen[k] = y;
        }
      }
      return { seen, asideScrollTop: aside.scrollTop, contentH: aside.scrollHeight, boxH: aside.clientHeight };
    }, targets);
    console.log(which, w + 'x' + h, duo ? 'element open' : 'element closed', 'first scrollY where visible:', JSON.stringify(r.seen), 'sidebar content/box', r.contentH + '/' + r.boxH);
    await page.context().close();
  }
  await b.close();
})();
