// Typing an out-of-range value into a number field: what does the page do and say?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  for (const [st, sel, val] of [[{ group: 'solo', action: 'throw' }, '#near', '2000'], [{ group: 'solo', action: 'throw' }, '#goal', '5e9'], [{ group: 'solo', action: 'walk' }, '#walk-d', '20000'], [{ group: 'solo', action: 'throw' }, '#near', '0.2']]) {
    const { ctx, page } = await open(b, 390, 844, 'light', { storage: JSON.stringify(st), wait: 1200 });
    await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details.effort-adjust')) d.open = true; });
    await page.fill(sel, val);
    await page.press(sel, 'Enter');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    const r = await page.evaluate((s) => { const e = document.querySelector(s); return { value: e.value, min: e.min, max: e.max, invalid: e.matches(':invalid'), msg: e.validationMessage, desc: e.getAttribute('aria-describedby'), saved: JSON.parse(localStorage.getItem('rex-lab-v1'))[{ '#near': 'near', '#goal': 'gThrow', '#walk-d': 'walkD' }[s]] }; }, sel);
    const bodyMentions = await page.evaluate(() => /between|out of range|at most|at least/i.test(document.querySelector('#bay .bay-controls').innerText));
    console.log(sel, 'typed', val, '->', JSON.stringify(r), 'any message in the controls:', bodyMentions);
    await ctx.close();
  }
  await b.close();
})();
