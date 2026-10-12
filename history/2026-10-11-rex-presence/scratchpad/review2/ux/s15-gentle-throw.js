const { launch, open } = require('./lib');
(async () => {
  const b = await launch();
  for (const gh of [false, true]) {
    const { ctx, page } = await open(b, 1280, 900, 'light', { storage: JSON.stringify({ group: 'solo', action: 'throw', obj: 'car', logKg: 7, gentleHold: gh }), wait: 3000 });
    await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details')) d.open = true; });
    const t = await page.evaluate(() => { const b = document.querySelector('#bay'); return { read: b.querySelector('.effort-read').innerText, chips: [...b.querySelectorAll('.status')].map((s) => s.innerText).join(' ; '), gentle: (b.innerText.match(/[Gg]entle hold[^\n.]*/g) || []) }; });
    console.log('gentleHold', gh, JSON.stringify(t, null, 1));
    // and at all-out
    await page.selectOption('#effort', 'allout'); await page.waitForTimeout(800);
    const t2 = await page.evaluate(() => { const b = document.querySelector('#bay'); return { chips: [...b.querySelectorAll('.status')].map((s) => s.innerText).join(' ; '), gentle: (b.innerText.match(/[Gg]entle hold[^\n.]*/g) || []) }; });
    console.log('  all-out', JSON.stringify(t2));
    await ctx.close();
  }
  await b.close();
})();
