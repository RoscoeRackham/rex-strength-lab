const { open, settle } = require('./lib.js');
const dist = process.argv[2];
(async () => {
  const { browser, page, errs } = await open(dist, { tag: 'leak' + process.pid, state: { duoOpen: true, duoAction: 'collide', anchor: 'bolted' } });
  await page.selectOption('#duo-effort', 'ground'); await page.waitForTimeout(300); await settle(page);
  const dg = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
  console.log('duo ground read:', dg.slice(0, 600));
  // now a later solo render and a save: switch Rex's tab to Stomp
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button, [role=tab]')).find((x) => /^Stomp$/.test(x.textContent.trim())); b && b.click(); });
  await page.waitForTimeout(500); await settle(page);
  const after = await page.evaluate(() => ({ sw: document.getElementById('sw-unbreakable').checked, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).unbreakable, action: JSON.parse(localStorage.getItem('rex-lab-v1')).action }));
  const stompChips = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .status-row > *')).map((n) => n.textContent.trim()).join(' | '));
  console.log('after:', JSON.stringify(after), '\n stomp chips:', stompChips.slice(0, 300));
  if (errs.length) console.log('ERR', errs);
  await browser.close();
})();
