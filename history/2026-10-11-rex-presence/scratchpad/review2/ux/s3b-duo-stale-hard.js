// Two-player tabs: after the background effort search finishes with focus inside the bay, does the duo slider follow?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const storage = JSON.stringify({ group: 'duo', duoAction: 'catch', cStyle: 'hard', logKg: Number(process.argv[2] || 5) });
  const { ctx, page, errs } = await open(b, 390, 844, 'light', { storage, wait: 300 });
  const busy = () => page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText));
  const snap = async (label) => page.evaluate((label) => {
    const sl = document.querySelector('#duo-effort-use');
    const rd = document.querySelector('.effort-read');
    const cards = [...document.querySelectorAll('.fighter')].map((f) => f.innerText.replace(/\n/g, ' / '));
    return { label, focus: document.activeElement && document.activeElement.id, sel: document.querySelector('#duo-effort') && document.querySelector('#duo-effort').value,
      slider: sl && { min: +(+sl.min).toFixed(2), max: +(+sl.max).toFixed(2), value: +(+sl.value).toFixed(2), vt: sl.getAttribute('aria-valuetext') },
      read: rd && rd.innerText.split('\n').slice(0, 2).join(' | '), cards, verdict: (document.querySelector('#bay .verdict') || {}).innerText };
  }, label);
  let t0 = Date.now();
  console.log(JSON.stringify(await snap('open')));
  for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await busy())) break; }
  console.log('settled in', Date.now() - t0, 'ms'); console.log(JSON.stringify(await snap('settled')));
  const ids = await page.evaluate(() => [...document.querySelectorAll('#c-obj option')].map((o) => o.value));
  for (const id of ['car', 'person', 'bus', 'piano']) {
    if (!ids.includes(id)) continue;
    await page.focus('#c-obj'); await page.selectOption('#c-obj', id);
    const s0 = await snap('picked ' + id); t0 = Date.now();
    for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (!(await busy())) break; }
    const s1 = await snap('settled ' + id + ' after ' + (Date.now() - t0) + ' ms');
    console.log(JSON.stringify(s0)); console.log(JSON.stringify(s1));
    await page.evaluate(() => document.activeElement.blur()); await page.click('#grp-duo'); await page.waitForTimeout(500);
    console.log(JSON.stringify(await snap('fresh render')));
  }
  console.log('errs', errs);
  await b.close();
})();
