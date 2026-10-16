const { open } = require('./h.js');
(async () => {
  const { browser, page, load, text } = await open(1280);
  // Weight tab with Krakatoa
  await load({ action: 'weight' });
  await page.evaluate(() => { for (const n of document.getElementById('bay').children) n.r5old = true; document.getElementById('grow-what-krakatoa').click(); });
  await page.waitForFunction(() => Array.from(document.getElementById('bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 30000 });
  const gw = await text('#bay .growth-whatif');
  console.log('--- growth what-if box:\n' + gw);
  const hg = await page.evaluate(() => { const g = document.querySelector('#hero-glow'); return { hidden: g.hidden, s: g.dataset.strength }; });
  console.log('header glow', JSON.stringify(hg));
  // hint
  const hint = await page.evaluate(() => { const h = document.getElementById('absorb-hint'); const cs = getComputedStyle(h); const det = h.closest('details'); return { t: h.textContent, display: cs.display, inDetails: det ? det.id + ' open=' + det.open : null }; });
  console.log('--- absorb-hint', JSON.stringify(hint));
  // cards
  const cards = await page.evaluate(() => Array.from(document.querySelectorAll('*')).filter((n) => n.children.length === 0 && /nothing changes|nothing outside changes|and it shows/.test(n.textContent)).map((n) => n.tagName + '#' + n.id + '.' + n.className + ': ' + n.textContent.slice(0, 160)));
  console.log('--- leaves with phrases:\n' + cards.join('\n'));
  // Jump soft landing least disruptive
  await load({ action: 'jump', softLanding: true }, 'least');
  const jt = await text('#bay');
  const lines = jt.split('\n').filter((l) => /Soft landing|Shimmer|faint flicker|nothing outside/.test(l));
  console.log('--- jump least, soft landing:\n' + lines.join('\n'));
  console.log('errs', page.errs);
  await browser.close();
})();
