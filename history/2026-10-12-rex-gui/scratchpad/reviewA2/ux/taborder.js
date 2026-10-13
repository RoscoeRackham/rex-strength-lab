const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 900], [1024, 768], [390, 844]]) {
    const page = await open(b, { w, h, state: { duoOpen: true, duoAction: 'arm' }, wait: 3500 });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.mouse.click(5, 5);
    const seq = []; const off = [];
    for (let i = 0; i < 120; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(60);
      const r = await page.evaluate(() => {
        const a = document.activeElement; if (!a || a === document.body) return null;
        const rc = a.getBoundingClientRect();
        const zone = a.closest('aside') ? 'aside' : a.closest('#duo') ? 'duo' : a.closest('main') ? 'main' : a.closest('section') ? a.closest('section').id : 'other';
        const cs = getComputedStyle(a);
        // check visible: element on screen and not clipped by the sidebar scroll box
        let vis = rc.bottom > 0 && rc.top < innerHeight && rc.width > 0;
        const aside = a.closest('aside');
        if (aside) { const ar = aside.getBoundingClientRect(); vis = vis && rc.top >= ar.top - 1 && rc.bottom <= ar.bottom + 1; }
        return { zone, d: (a.id || a.tagName + ':' + (a.textContent || '').trim().slice(0, 18)), top: Math.round(rc.top), vis, ol: cs.outlineStyle + ' ' + cs.outlineWidth };
      });
      if (!r) { seq.push('BODY'); continue; }
      if (r.zone !== 'aside' && r.zone !== 'main' && r.zone !== 'duo') { seq.push(r.zone + ':' + r.d); break; }
      seq.push(r.zone + ':' + r.d + (r.vis ? '' : '[OFF@' + r.top + ']'));
      if (!r.vis) off.push(r.d + '@' + r.top);
      if (r.ol.startsWith('none')) off.push('NO-OUTLINE ' + r.d);
    }
    console.log('== ' + w + 'x' + h);
    console.log(seq.join(' > '));
    console.log('off-screen or no outline:', JSON.stringify(off));
    await page.context().close();
  }
  await b.close();
})();
