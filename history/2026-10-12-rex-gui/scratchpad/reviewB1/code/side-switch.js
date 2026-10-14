const { open } = require('./harness.js');
const fastClock = ({ k }) => { const now = performance.now.bind(performance), t0 = now(); performance.now = () => t0 + (now() - t0) * k; };
const readout = (h) => h.page.evaluate(() => ((document.querySelector('#bay .effort-read') || {}).textContent || '').replace(/\s+/g, ' '));
const waitDone = async (h) => { for (let i = 0; i < 900; i++) { const t = await h.text('bay'); if (!/working it out|Working out/i.test(t)) return true; await h.page.waitForTimeout(100); } return false; };
(async () => {
  const h = await open('branch', { init: { fn: fastClock, arg: { k: 200 } } });
  const base = { action: 'throw', obj: 'baseball', angle: 0, logKg: 9, mode: 'comic' };
  // direct: houses
  await h.load(base); await h.page.selectOption('#effort', 'houses'); const d1 = await waitDone(h); const direct = await readout(h);
  // switch mid-side-search: windows, then houses at once
  await h.load(base); await h.page.selectOption('#effort', 'windows'); await h.page.waitForTimeout(30); const mid = /Working out whether/.test(await h.text('bay'));
  await h.page.selectOption('#effort', 'houses'); const d2 = await waitDone(h); const switched = await readout(h);
  console.log('direct done', d1, '| mid-side when switched', mid, '| switched done', d2);
  console.log('direct  :', direct.slice(0, 400));
  console.log('switched:', switched.slice(0, 400));
  console.log('same:', direct === switched, h.errs.slice(0, 2));
  // switching tab mid-side-search and back
  await h.load(base); await h.page.selectOption('#effort', 'windows'); await h.page.waitForTimeout(30); await h.page.click('#tab-jump'); await h.page.waitForTimeout(300); await h.page.click('#tab-throw'); const d3 = await waitDone(h);
  console.log('tab switch back done', d3, (await readout(h)).slice(0, 200));
  await h.browser.close();
})();
