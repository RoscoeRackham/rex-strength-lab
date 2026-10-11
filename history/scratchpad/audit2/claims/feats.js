const { open } = require('./harness');
(async () => {
  for (const mode of ['comic', 'real']) {
    const { browser, page, errs } = await open();
    await page.evaluate((m) => window.__set({ mode: m }), mode);
    const n = await page.evaluate(() => document.querySelectorAll('.feat .run').length);
    for (let i = 0; i < n; i++) {
      const r = await page.evaluate((i) => {
        const b = document.querySelectorAll('.feat .run')[i];
        const title = b.closest('.feat').querySelector('.t').textContent;
        b.click();
        const s = window.__snap();
        return { title, dial: s.dial, verdict: s.verdict, chips: s.chips, tiles: s.tiles.map((t) => t.join(' / ')), happens: s.happens, callouts: s.callouts, tab: document.querySelector('[aria-selected=true]').textContent, obj: document.querySelector('#obj') && document.querySelector('#obj').value };
      }, i);
      console.log('\n[' + mode + '] ' + r.title + '  -> tab ' + r.tab + ' obj ' + r.obj);
      console.log('  dial: ' + r.dial.join(' | '));
      console.log('  V: ' + r.verdict);
      console.log('  C: ' + r.chips.join(' || '));
      console.log('  T: ' + r.tiles.join(' || '));
      for (const h of r.happens) console.log('   - ' + h.slice(0, 300));
      for (const h of r.callouts) console.log('   > ' + h.slice(0, 400));
    }
    console.log(errs);
    await browser.close();
  }
})();
