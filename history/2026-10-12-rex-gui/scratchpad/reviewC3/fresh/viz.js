const open = require('./pw.js');
(async () => {
  const { browser, page, load } = await open(1280);
  await load({ action: 'punch' }, false); await page.waitForTimeout(6000);
  const t = await page.evaluate(() => Array.from(document.querySelectorAll('#ladder-viz text, #ladder-viz title')).map((n) => n.textContent).join(' | '));
  console.log(t);
  // hover details for chix
  const det = await page.evaluate(() => { const n = document.getElementById('ladder-viz'); return n ? n.innerText || n.textContent : ''; });
  console.log('TEXT:', det.slice(0, 3000));
  await browser.close();
})();
