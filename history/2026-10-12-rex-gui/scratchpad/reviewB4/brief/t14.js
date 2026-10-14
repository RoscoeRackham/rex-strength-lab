const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const o of ['shot', 'bowling', 'loco', 'pyramid', 'car', 'cloud']) {
    await load(page, { angle: 90, obj: o }, 'throw');
    const t = await text(page, 'bay');
    const v = t.split('\n').find(l => / goes | flies | can’t|leaves/.test(l));
    const chip = /No drag: their power\n/.test(t.slice(0, t.indexOf('Effort:') > 0 ? t.indexOf('Effort:') : 3000));
    const item = (t.match(/flies as it would in a vacuum[^.]*\./) || [''])[0];
    const r = await page.evaluate((o) => { const P = window.DinoPhys, D = window.DINO_DATA; const ob = D.objects.find(x => x.id === o); return null; }, o);
    console.log(o, '|', v, '| chip:', chip, '|', item);
  }
  console.log(errs);
  await browser.close();
})();
