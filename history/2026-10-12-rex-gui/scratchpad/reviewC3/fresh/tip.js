const open = require('./pw.js');
(async () => {
  const { browser, page, load } = await open(1280);
  await load({ action: 'punch' }, false); await page.waitForTimeout(6000);
  const out = await page.evaluate(() => { const g = document.querySelector('#ladder-viz g.mk[data-key="R:chix"]'); if (!g) return 'no marker'; g.dispatchEvent(new Event('focus')); g.focus(); const tip = Array.from(document.querySelectorAll('#ladder-viz *')).find((n) => n.tagName === 'DIV' && !n.hidden && n.querySelector('b')); return (g.getAttribute('aria-label')) + ' || TIP: ' + (tip ? tip.innerText : 'none'); });
  console.log(out);
  await browser.close();
})();
