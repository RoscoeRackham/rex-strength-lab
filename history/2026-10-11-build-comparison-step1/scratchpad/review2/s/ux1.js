// L2 drawers at tablet widths, L3 aria labels, L9 hidden drawer, L12 focus return.
const { open } = require('./h.js');
(async () => {
  // L2
  for (const w of [720, 768, 800, 820, 860, 899, 900, 960]) {
    const { browser, p } = await open({ w, h: 1000 });
    const ids = await p.evaluate(() => window.__bc.LIST.map((e) => e.id));
    let over = [];
    for (const id of ids) {
      await p.click('.fig[data-id="' + id + '"]');
      const sw = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: document.documentElement.clientWidth }));
      if (sw.sw > sw.iw) over.push(id + ' +' + (sw.sw - sw.iw));
    }
    console.log('L2', w, 'px: drawers causing sideways scroll', over.length, over.slice(0, 5).join(', '));
    if (w === 768) {
      // L3
      const lab = await p.evaluate(() => ['colossus_armored', 'thor', 'thing', 'rex', 'luke_cage', 'wolverine'].map((id) => document.querySelector('.fig[data-id="' + id + '"]').getAttribute('aria-label')));
      lab.forEach((l) => console.log('L3 cell:', l));
      const fl = await p.evaluate(() => ['thor', 'rex', 'thing'].map((id) => document.querySelector('.fp-row[data-row="' + id + '"] .nm').getAttribute('aria-label')));
      fl.forEach((l) => console.log('L3 forest:', l));
      // L9
      await p.keyboard.press('Escape');
      const hd = await p.evaluate(() => { const d = document.getElementById('drawer'); const r = d.getBoundingClientRect(); return { hidden: d.hidden, display: getComputedStyle(d).display, h: r.height }; });
      console.log('L9 closed drawer:', JSON.stringify(hd));
      // L12
      await p.evaluate(() => document.querySelector('.fp-row[data-row="eddie_hall"] .nm').focus({ focusVisible: true }));
      await p.keyboard.press('Enter');
      await p.waitForTimeout(200);
      const a1 = await p.evaluate(() => document.activeElement.id || document.activeElement.className);
      await p.keyboard.press('Escape');
      await p.waitForTimeout(200);
      const a2 = await p.evaluate(() => { const a = document.activeElement; return (a.closest('.fp-row') ? 'forest row ' + a.closest('.fp-row').getAttribute('data-row') : a.className + ' ' + (a.getAttribute('data-id') || '')); });
      console.log('L12: after Enter focus on', a1, '; after Escape focus on', a2);
      // L12 via Close button
      await p.evaluate(() => document.querySelector('.fp-row[data-row="phil_heath"] .nm').focus({ focusVisible: true }));
      await p.keyboard.press('Enter'); await p.waitForTimeout(200);
      await p.click('#drawer .close'); await p.waitForTimeout(200);
      const a3 = await p.evaluate(() => { const a = document.activeElement; return (a.closest('.fp-row') ? 'forest row ' + a.closest('.fp-row').getAttribute('data-row') : a.className + ' ' + (a.getAttribute('data-id') || '')); });
      console.log('L12 (Close button): focus on', a3);
    }
    await browser.close();
  }
})();
