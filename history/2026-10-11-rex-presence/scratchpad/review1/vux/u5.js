const { open, tab, bayText } = require('./lib');
(async () => {
  for (const saved of [{}, { inf: true }]) {
    const { browser, page, errs } = await open({ w: 390, h: 844, saved });
    for (const t of ['throw', 'jump', 'stomp', 'punch']) {
      await page.click('#grp-solo'); await page.waitForTimeout(300);
      // go to a different tab first so the target opens fresh
      await page.click('#tab-lift'); await page.waitForTimeout(400);
      const t0 = Date.now();
      await page.click('#tab-' + t);
      const samples = [];
      for (let k = 0; k < 25; k++) {
        const s = await page.evaluate(() => { const b = document.querySelector('#bay'), bt = b.getBoundingClientRect().top; const v = b.querySelector('.verdict'), tl = b.querySelector('.tiles, .tile'); const er = b.querySelector('.effort-read'); return { v: v ? Math.round(v.getBoundingClientRect().top - bt) : null, tile: tl ? Math.round(tl.getBoundingClientRect().top - bt) : null, er: er ? Math.round(er.getBoundingClientRect().height) : null, working: /Working out the courtesy ceiling/.test(b.innerText) }; });
        samples.push([Date.now() - t0, s.v, s.tile, s.er, s.working]);
        await page.waitForTimeout(80);
      }
      const first = samples[0], last = samples[samples.length - 1];
      const firstDone = samples.find((x) => !x[4]);
      console.log(JSON.stringify(saved), t, 'first', first, 'done at', firstDone && firstDone[0], 'last', last);
    }
    const ws = await page.evaluate(() => (document.querySelector('#bay').innerText.match(/vanishing share/g) || []).length);
    console.log('vanishing share count on last tab', ws);
    await browser.close();
  }
})();
