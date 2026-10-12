// Safe passenger says it covers a person he lifts: does the Lift tab change at all?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const texts = [];
  for (const on of [false, true]) {
    const { ctx, page } = await open(b, 1280, 900, 'light', { storage: JSON.stringify({ group: 'solo', action: 'lift', obj: 'person', safePassenger: on }), wait: 1200 });
    texts.push(await page.evaluate(() => { const b = document.querySelector('#bay').cloneNode(true); return b.textContent; }));
    await ctx.close();
  }
  console.log('Lift, person: page text identical with Safe passenger off and on:', texts[0] === texts[1], '| mentions passenger:', /passenger/i.test(texts[1]));
  await b.close();
})();
