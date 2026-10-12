const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900, saved: { group: 'duo', duoAction: 'wrestle', wrestleMove: 'throw' } });
  await tab(page, 'wrestle', true, 3000);
  const t = await bayText(page);
  const k = t.indexOf('VS'); console.log(t.slice(k, k + 1500));
  // custom effort just above ceiling: 3.2 t
  await page.evaluate(() => { const s = document.querySelector('#duo-effort-use'); s.value = String(Math.log10(3300)); s.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(1500);
  const t2 = await bayText(page);
  const k2 = t2.indexOf('Effort:'); console.log('---- at 3.3 t\n' + t2.slice(k2, k2 + 300));
  const k3 = t2.indexOf('VS'); console.log(t2.slice(k3, k3 + 1200));
  await browser.close();
})();
