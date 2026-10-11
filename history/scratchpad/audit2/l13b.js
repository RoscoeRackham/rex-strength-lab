const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light','dark']) {
  const p = await b.newPage({ viewport: { width: 1200, height: 900 }, colorScheme: scheme });
  await p.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/patched.html');
  await p.waitForTimeout(800);
  const labels = await p.$$eval('#ladder-viz .mk', els => els.map(e => e.getAttribute('aria-label')));
  console.log(scheme, 'markers', labels.length);
  const idx = labels.findIndex(l => /Captain America/i.test(l));
  console.log('cap idx', idx, labels[idx]);
  // focus it via keyboard: focus first marker then Tab idx times
  await p.focus('#ladder-viz .mk');
  for (let i = 0; i < idx; i++) await p.keyboard.press('Tab');
  console.log('focused:', await p.evaluate(() => document.activeElement.getAttribute('aria-label')));
  const bb = await p.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
  await p.evaluate(() => document.activeElement.scrollIntoView({block:'center'}));
  await p.waitForTimeout(200);
  await p.screenshot({ path: `/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l13-fixed-${scheme}.png` });
  await p.keyboard.press('Enter');
  console.log('right after Enter:', await p.evaluate(() => document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label')||'')));
  await p.waitForTimeout(400);
  console.log('after 400ms:', await p.evaluate(() => document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label')||'')));
  await p.keyboard.press('Tab');
  console.log('after Tab:', await p.evaluate(() => document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label')||document.activeElement.id||document.activeElement.textContent.slice(0,40))));
  // test space too
  await p.keyboard.press('Shift+Tab');
  await p.keyboard.press('Tab');
  await p.keyboard.press('Space');
  await p.waitForTimeout(400);
  console.log('after Space:', await p.evaluate(() => document.activeElement.tagName));
  // click with mouse also
  await p.close();
  }
  await b.close();
})();
