const H = require('./h.js');
(async () => {
  for (const [w, h, scheme] of [[390, 844, 'light'], [390, 844, 'dark'], [1280, 900, 'dark']]) {
    const page = await H.open(w, h, scheme);
    await H.load(page, { action: 'throw', obj: 'car', logKg: 12, airAbsorb: 0.5 });
    await page.selectOption('#effort', 'allout'); await H.settle(page);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    const pw = await page.$('#powers'); await pw.screenshot({ path: H.DIR + `/shots/powers-${w}-${scheme}.png` });
    const bay = await page.$('main.panel'); await bay.screenshot({ path: H.DIR + `/shots/throw-${w}-${scheme}.png` });
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    // check chips overflow their container
    const chipOv = await page.evaluate(() => Array.from(document.querySelectorAll('.status')).filter((n) => n.scrollWidth > n.clientWidth + 1 || n.getBoundingClientRect().right > document.documentElement.clientWidth).map((n) => n.textContent));
    // slider attributes
    const sl = await page.evaluate(() => { const s = document.getElementById('air-absorb'); return { vt: s.getAttribute('aria-valuetext'), lab: s.labels && s.labels[0] && s.labels[0].textContent, desc: s.getAttribute('aria-describedby'), w: s.getBoundingClientRect().width }; });
    console.log(w, scheme, 'overflow', ov, 'chipOv', chipOv, JSON.stringify(sl), page.errs);
    await page.close();
  }
  await H.close();
})();
