const { open } = require('./h.js');
(async () => {
  const { browser, page, load, text } = await open(1280);
  const gb = 0.001 / Math.sqrt(1 - 1e-6);
  await load({ duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: Math.log10(gb) });
  const t = await text('#duo-bay');
  for (const l of t.split('\n')) if (/stops himself|takes in|Shimmer|source too/.test(l)) console.log('collide: ' + l.slice(0, 600));
  await load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'easy', cLogD: 1 });
  const c = await text('#duo-bay');
  for (const l of c.split('\n')) if (/Stopping it frees|takes in/.test(l)) console.log('catch: ' + l.slice(0, 600));
  // the Their powers card
  const card = await page.evaluate(() => { const d = Array.from(document.querySelectorAll('#assume div')).find((n) => n.querySelector('b') && n.querySelector('b').textContent === 'Their powers'); const t = d.textContent.replace(/ /g, ' '); const i = t.indexOf('They take their own recoil:'); return t.slice(i, i + 420); });
  console.log('card: ' + card);
  const sc = await page.evaluate(() => { const d = Array.from(document.querySelectorAll('#assume div')).find((n) => n.querySelector('b') && n.querySelector('b').textContent.startsWith('The shimmer')); const t = d.textContent; const i = t.indexOf('a catch, which'); return t.slice(i - 40, i + 80); });
  console.log('shimmer card: ' + sc);
  console.log('errs', page.errs);
  await browser.close();
})();
