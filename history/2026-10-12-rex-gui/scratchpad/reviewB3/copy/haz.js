const { open, view } = require('./h.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const [st, tab, eff] of [
    [{ obj: 'baseball', logKg: 6 }, 'throw', 'allout'],
    [{ obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0 }, 'throw', 'allout'],
    [{ logKg: 14 }, 'jump', 'allout'],
    [{ logKg: 8, surface: 'sand' }, 'stomp', 'allout'],
    [{ obj: 'car', logKg: 6, angle: 45 }, 'throw', 'allout'],
    [{ obj: 'car', logKg: 6, angle: 45, airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, 'throw', 'allout'],
  ]) {
    await view(page, st, tab, eff);
    const t = await page.evaluate(() => { const d = Array.from(document.querySelectorAll('#bay details')).find((n) => /Where each hazard|Hazards checked/.test(n.querySelector('summary').textContent)); return d ? Array.from(d.querySelectorAll('li')).map((l) => l.textContent).join('\n') : 'none'; });
    console.log('=====', tab, JSON.stringify(st)); console.log(t);
  }
  console.log('errs', errs);
  await browser.close();
})();
