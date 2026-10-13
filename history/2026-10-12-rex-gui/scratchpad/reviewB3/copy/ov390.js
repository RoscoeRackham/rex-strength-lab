const { open, view, settle } = require('./h.js');
(async () => {
  const { browser, page, errs } = await open({ w: 390, h: 844, scheme: 'dark' });
  const cases = [
    [{ obj: 'car', logKg: 14, airAbsorb: 0.5 }, 'throw', 'allout'],
    [{ obj: 'pyramid', logKg: 22, angle: 90, airAbsorb: 0.5 }, 'throw', 'allout'],
    [{ obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0 }, 'throw', 'allout'],
    [{ obj: 'car', logKg: 10, angle: 0 }, 'throw', 'block'],
    [{ surface: 'sand', logKg: 8 }, 'stomp', 'allout'],
    [{ wrestleMove: 'throw', logKg: 14 }, 'wrestle', 'allout'],
    [{ cStyle: 'hard', cObj: 'baseball', logKg: Math.log10(1.8e23) }, 'catch', 'allout'],
    [{ cStyle: 'hard', cObj: 'car', logKg: 10 }, 'catch', 'block'],
    [{ anchor: 'bolted', colSrc: 'jump', logKg: 6 }, 'collide', 'plaster'],
    [{ surface: 'sand', obj: 'everest', logKg: 15 }, 'lift', null],
  ];
  let i = 0;
  for (const [st, tab, eff] of cases) {
    await view(page, st, tab, eff);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const wide = await page.evaluate(() => Array.from(document.querySelectorAll('#bay *, #duo-bay *')).filter((n) => { const r = n.getBoundingClientRect(); return r.width > 0 && (r.right > window.innerWidth + 1); }).slice(0, 5).map((n) => n.tagName + '.' + n.className + ' ' + (n.textContent || '').slice(0, 60)));
    console.log(tab, JSON.stringify(st), 'overflow', ov, wide);
    const el = await page.$(['arm', 'wrestle', 'catch', 'collide'].includes(tab) ? '#duo' : 'main.panel');
    await el.screenshot({ path: `shots/ov-${i++}-${tab}.png` });
  }
  console.log('errs', errs);
  await browser.close();
})();
