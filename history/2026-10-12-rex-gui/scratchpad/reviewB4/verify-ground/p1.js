const { open, settle, load, text } = require('./harness.js');
(async () => {
  const { browser, pg, errs } = await open();
  for (const angle of [90, 45, 0]) {
    await load(pg, { action: 'throw', obj: 'car', angle, surface: 'sand' });
    await pg.selectOption('#effort', 'allout'); await pg.waitForTimeout(500); await settle(pg, 'bay');
    const t = await text(pg, 'bay');
    const lines = t.split('\n').filter((l) => /drives his feet down|part of the downward push|supplies the rest|Rex throws|lands|shak/i.test(l));
    console.log('=== angle', angle); console.log(lines.slice(0, 8).join('\n'));
  }
  console.log('errors', errs);
  await browser.close();
})();
