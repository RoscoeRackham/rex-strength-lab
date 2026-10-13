const { open, load, pick, text } = require('./page');
(async () => {
  const { browser, page, errs } = await open();
  const cases = [
    { action: 'throw', obj: 'baseball', logKg: 14, angle: 30, airAbsorb: 0 },
    { action: 'throw', obj: 'baseball', logKg: 14, angle: 30, airAbsorb: 0.5 },
    { action: 'throw', obj: 'baseball', logKg: 14, angle: 90, airAbsorb: 1 },
    { action: 'throw', obj: 'baseball', logKg: 17, angle: 60, airAbsorb: 0 },
    { action: 'throw', obj: 'baseball', logKg: 14, angle: 30, airAbsorb: 0.5 },
  ];
  for (const st of cases) {
    await load(page, st); await pick(page, '#effort', 'allout');
    const t = await text(page, 'bay');
    const i = t.indexOf('Past about 1%'), j = t.indexOf('Air resistance absorbed: with all');
    const s = i >= 0 ? i : j;
    console.log(JSON.stringify(st), '\n  ', s >= 0 ? t.slice(s, s + 1300) : t.slice(0, 600), '\n');
  }
  console.log('errs', errs);
  await browser.close();
})();
