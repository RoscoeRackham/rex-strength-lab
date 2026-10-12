// After a background effort search finishes while a control in the bay has focus, are the effort slider and its
// aria-valuetext brought up to date with the readout?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const storage = JSON.stringify({ inf: true, mode: 'real', action: 'throw', group: 'solo', obj: 'car' });
  const { ctx, page, errs } = await open(b, 390, 844, 'light', { storage, wait: 600 });
  const snap = async (label) => page.evaluate((label) => {
    const sl = document.querySelector('#effort-use');
    const rd = document.querySelector('.effort-read');
    return { label, focus: document.activeElement && document.activeElement.id, sel: document.querySelector('#effort') && document.querySelector('#effort').value,
      slider: sl && { min: +(+sl.min).toFixed(2), max: +(+sl.max).toFixed(2), value: +(+sl.value).toFixed(2), vt: sl.getAttribute('aria-valuetext') },
      read: rd && rd.innerText.split('\n').slice(0, 2).join(' | ') };
  }, label);
  console.log(JSON.stringify(await snap('at open +0.6s')));
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText)))) break; }
  console.log(JSON.stringify(await snap('settled')));
  const objs = await page.evaluate(() => [...document.querySelectorAll('#obj option')].map((o) => o.value));
  console.log('objects', objs.join(','));
  for (const id of ['truck', 'boulder', 'baseball', 'person', 'bus', 'tank']) {
    if (!objs.includes(id)) continue;
    await page.focus('#obj');
    await page.selectOption('#obj', id);
    const s0 = await snap('just after picking ' + id);
    let k = 0;
    for (; k < 100; k++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText)))) break; }
    const s1 = await snap('settled after ' + id + ' (' + k * 100 + ' ms)');
    console.log(JSON.stringify(s0)); console.log(JSON.stringify(s1));
    // what a fresh render would show
    await page.evaluate(() => document.activeElement.blur());
    await page.evaluate(() => { document.querySelector('#grp-solo').click(); });
    await page.waitForTimeout(300);
    console.log(JSON.stringify(await snap('after a fresh render')));
  }
  console.log('errs', errs);
  await b.close();
})();
