// Keyboard: the Tab sequence with the element open, focus visibility, the cue never focused, arrow keys in both lists
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const { page, errs } = await open(browser, { w, h, state: { duoOpen: true, duoAction: 'wrestle' } });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { window.scrollTo(0, 0); document.getElementById('powers').open = true; document.getElementById('ollie-setup').open = true; });
    await page.focus('body');
    const seq = []; const bad = [];
    for (let i = 0; i < 400; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const a = document.activeElement; if (!a || a === document.body) return null;
        const cs = getComputedStyle(a); const rr = a.getBoundingClientRect();
        const where = a.closest('aside') ? 'aside' : a.closest('#duo') ? 'duo' : a.closest('main') ? 'rex' : 'other';
        const onScreen = rr.bottom > 0 && rr.top < innerHeight && rr.right > 0 && rr.left < innerWidth;
        return { id: a.id || (a.tagName + ':' + (a.textContent || '').trim().slice(0, 18)), where, outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2, fv: a.matches(':focus-visible'), onScreen, cue: a.id === 'more-below' };
      });
      if (!r) break;
      if (r.where === 'other' && seq.length > 5 && seq[seq.length - 1].where !== 'other') { seq.push(r); break; }
      seq.push(r);
      if (!r.outline || !r.onScreen || r.cue) bad.push(r);
    }
    const compress = []; for (const s of seq) { const last = compress[compress.length - 1]; if (last && last.where === s.where) last.n++, last.ids.push(s.id); else compress.push({ where: s.where, n: 1, ids: [s.id] }); }
    console.log(w + 'x' + h + ' tab sequence by region:', compress.map((c) => c.where + '(' + c.n + ')').join(' -> '));
    for (const c of compress) console.log('   ' + c.where + ': ' + c.ids.slice(0, 40).join(', ') + (c.ids.length > 40 ? ' ...' : ''));
    console.log('   problems (no outline / off screen / cue focused):', JSON.stringify(bad));
    // arrow keys in each list
    const arrows = async (list, keys) => {
      const out = [];
      await page.focus('#' + list + ' [aria-selected="true"]');
      for (const k of keys) { await page.keyboard.press(k); await page.waitForTimeout(k === 'Home' || k === 'End' ? 50 : 50); out.push(await page.evaluate(() => document.activeElement.id + (document.activeElement.matches(':focus-visible') ? '' : '(!fv)'))); }
      return out.join(' ');
    };
    console.log('   Rex list:', await arrows('tabs', ['ArrowRight', 'ArrowRight', 'End', 'ArrowRight', 'ArrowLeft', 'Home', 'ArrowLeft', 'ArrowDown']));
    const solo0 = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).action);
    console.log('   duo list:', await arrows('duo-tabs', ['ArrowRight', 'ArrowRight', 'End', 'ArrowRight', 'ArrowLeft', 'Home', 'ArrowLeft', 'ArrowUp']));
    const solo1 = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).action);
    console.log('   Rex action before/after duo arrows:', solo0, solo1);
    if (errs.length) console.log('   errs', errs);
    await page.context().close();
  }
  await browser.close();
})();
