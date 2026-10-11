const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const w of [390, 1280]) {
    const p = await open(b, { width: w, height: 844, skel: 'host' });
    const id = await p.evaluate(() => { const bn = Array.from(document.querySelectorAll('.fp-row button.nm')).find(x => /Eddie Hall/.test(x.textContent)); bn.focus(); return bn.dataset.open; });
    const s0 = await p.evaluate(() => ({ y: Math.round(scrollY), a: document.activeElement.className + ' ' + document.activeElement.textContent.slice(0, 20) }));
    await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const s1 = await p.evaluate(() => ({ y: Math.round(scrollY), a: document.activeElement.id || document.activeElement.className }));
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    const s2 = await p.evaluate(() => ({ y: Math.round(scrollY), a: (document.activeElement.className || '') + ' ' + (document.activeElement.getAttribute('data-id') || document.activeElement.getAttribute('data-open') || ''), inForest: !!document.activeElement.closest('#fp') }));
    // how many tab stops back to the forest row
    const n = await p.evaluate((id) => { const all = Array.from(document.querySelectorAll('a[href],button,select,input,textarea,summary,[tabindex]')).filter(e => e.tabIndex >= 0 && !e.disabled && e.getClientRects().length); const a = all.indexOf(document.activeElement), t = all.indexOf(document.querySelector('.fp-row button.nm[data-open="' + id + '"]')); return t - a; }, id);
    console.log(w, id, 'before', JSON.stringify(s0), 'open', JSON.stringify(s1), 'after Esc', JSON.stringify(s2), 'tab stops from focus to forest row:', n);
    await p._ctx.close();
  }
  await b.close();
})();
