const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page, errs } = await open({});
  await tab(page, 'throw', false, 2500);
  const rd = () => page.evaluate(() => { const s = document.querySelector('#effort-use'); const h = document.querySelector('#bay .effort-read p'); return { min: s.min, max: s.max, value: s.value, vt: s.getAttribute('aria-valuetext'), head: h && h.innerText.slice(0, 90), dial: document.querySelector('#strength').value }; });
  console.log('start', await rd());
  // drag the strength dial: dispatch input events with new values, as a drag does
  const setDial = async (v) => { await page.evaluate((v) => { const s = document.querySelector('#strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(800); };
  await setDial(7); console.log('dial 10^7 kg', await rd());
  await setDial(3.2); console.log('dial 10^3.2', await rd());
  // real mouse drag on the dial
  const box = await page.$eval('#strength', (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, min: e.min, max: e.max }; });
  console.log(box);
  await page.mouse.move(box.x + box.w * 0.2, box.y + box.h / 2); await page.mouse.down();
  for (let i = 0; i < 20; i++) { await page.mouse.move(box.x + box.w * (0.2 + i * 0.02), box.y + box.h / 2); await page.waitForTimeout(20); }
  await page.mouse.up(); await page.waitForTimeout(1000);
  console.log('after mouse drag', await rd());
  // duo
  await tab(page, 'arm', true, 2500);
  const rdd = () => page.evaluate(() => { const s = document.querySelector('#duo-effort-use'); return { min: s.min, max: s.max, value: s.value, dial: document.querySelector('#strength').value }; });
  console.log('duo start', await rdd());
  await setDial(7); console.log('duo dial 7', await rdd());
  console.log(errs);
  await browser.close();
})();
