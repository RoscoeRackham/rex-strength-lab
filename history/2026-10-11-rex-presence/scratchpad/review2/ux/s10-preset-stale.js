// Pick each effort preset from the select (focus stays on it) at unlimited strength, real muscle: does the slider follow
// once the background search finishes?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const act = process.argv[2] || 'throw';
  const { ctx, page, errs } = await open(b, 390, 844, 'light', { storage: JSON.stringify({ inf: true, mode: 'real', action: act, group: 'solo' }), wait: 300 });
  const busy = () => page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText));
  for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await busy())) break; }
  const snap = () => page.evaluate(() => { const sl = document.querySelector('#effort-use'); const rd = document.querySelector('.effort-read'); return { focus: document.activeElement.id, slider: (+sl.value).toFixed(2) + ' "' + sl.getAttribute('aria-valuetext') + '"', read: rd.innerText.split('\n')[0].slice(0, 110) }; });
  for (const pr of ['rattle', 'plaster', 'windows', 'ground', 'houses', 'block', 'ceiling', 'least']) {
    await page.focus('#effort'); await page.selectOption('#effort', pr);
    const a = await snap(); let k = 0;
    for (; k < 300; k++) { await page.waitForTimeout(50); if (!(await busy())) break; }
    const z = await snap();
    console.log(pr, '| right after:', JSON.stringify(a), '\n      settled after', k * 50, 'ms:', JSON.stringify(z));
  }
  console.log('errs', errs);
  await b.close();
})();
