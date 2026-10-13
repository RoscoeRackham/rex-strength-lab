// Tab through the sidebar on a wide screen: is a focused control ever under the 'More below' cue?
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const [w, h] of [[1280, 900], [1024, 768], [1366, 768], [1280, 720], [1920, 1080]]) {
    for (const powersOpen of [false, true]) {
      const { page, errs } = await open(browser, { w, h });
      if (powersOpen) await page.evaluate(() => { document.getElementById('powers').open = true; });
      await page.waitForTimeout(200);
      await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      await page.focus('body');
      const hits = [];
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(60);
        const r = await page.evaluate(() => {
          const a = document.activeElement, aside = document.querySelector('.panel-controls'), cue = document.getElementById('more-below');
          if (!aside.contains(a)) return { out: true, id: a.id || a.tagName };
          const ar = a.getBoundingClientRect(), cr = cue.getBoundingClientRect(), box = aside.getBoundingClientRect();
          const cueShown = !cue.hidden && cr.height > 0;
          const overlap = cueShown ? Math.max(0, Math.min(ar.bottom, cr.bottom) - Math.max(ar.top, cr.top)) : 0;
          // what is painted at the control's centre, and at its top
          const cx = (ar.left + ar.right) / 2, cy = (ar.top + ar.bottom) / 2;
          const atC = document.elementFromPoint(cx, cy);
          const atTop = document.elementFromPoint(cx, ar.top + 2);
          const vis = (n) => n && (n === a || a.contains(n) || (a.labels && Array.from(a.labels).some((l) => l.contains(n))) || (n.tagName === 'LABEL' && n.control === a));
          return { id: a.id || (a.tagName + ':' + a.textContent.slice(0, 20)), ctl: [Math.round(ar.top), Math.round(ar.bottom)], cue: cueShown ? [Math.round(cr.top), Math.round(cr.bottom), cue.textContent] : null, boxBottom: Math.round(box.bottom), overlap: Math.round(overlap), centre: atC === cue ? 'CUE' : vis(atC) ? 'self' : (atC ? atC.tagName + '.' + atC.className : null), top: atTop === cue ? 'CUE' : vis(atTop) ? 'self' : (atTop ? atTop.tagName : null), scrollTop: Math.round(aside.scrollTop) };
        });
        if (r.out) break;
        if (r.overlap > 0) hits.push(r);
      }
      console.log(w + 'x' + h + ' powers ' + (powersOpen ? 'open' : 'closed') + ': ' + hits.length + ' focused controls overlapped by the cue');
      for (const x of hits) console.log('   ' + JSON.stringify(x));
      if (errs.length) console.log('   errs', errs);
      await page.context().close();
    }
  }
  await browser.close();
})();
