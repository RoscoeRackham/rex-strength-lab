const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname + '/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light','dark']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: scheme, deviceScaleFactor: 2 });
  await page.goto('file://' + S + 'preview.html');
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), {"group":"solo","action":"weight","m":1e15});
  await page.reload(); await page.waitForTimeout(700);
  const info = await page.evaluate(() => {
    const svgs=[...document.querySelectorAll('#bay svg')];
    for (const s of svgs) { const t=[...s.querySelectorAll('text')].find(x=>x.textContent==='inner core'); if (t) { const tb=t.getBoundingClientRect(); const circ=[...s.querySelectorAll('circle')].map(c=>{const b=c.getBoundingClientRect(); return {w:b.width,fill:c.getAttribute('fill')};}); return {tw:tb.width, th:tb.height, tfill:getComputedStyle(t).fill, circ}; } }
    return null; });
  console.log(scheme, JSON.stringify(info));
  const svg = await page.evaluateHandle(() => [...document.querySelectorAll('#bay svg')].find(s => [...s.querySelectorAll('text')].some(x => x.textContent === 'inner core')));
  await svg.asElement().screenshot({ path: S + 'cut-' + scheme + '.png' });
  await page.close();
  }
  await browser.close();
})();
