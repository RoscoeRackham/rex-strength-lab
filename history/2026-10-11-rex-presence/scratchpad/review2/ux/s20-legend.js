const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { PREV, OUT } = require('./lib');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  await page.addInitScript((x) => localStorage.setItem('rex-lab-v1', x), JSON.stringify({ group: 'solo', action: 'walk', walker: 'both', oM: 6000 }));
  await page.goto(PREV); await page.waitForTimeout(1500);
  const v = await page.$('#bay .viz'); const leg = await page.$('#bay .ladder-legend');
  await leg.screenshot({ path: OUT + 'legend-both-390x3.png' });
  await v.screenshot({ path: OUT + 'viz-both-390x3.png' });
  const info = await page.evaluate(() => ({ legend: [...document.querySelectorAll('#bay .ladder-legend i')].map((i) => i.getAttribute('style').replace(/.*border-top:/, '')), paths: [...document.querySelectorAll('#bay .viz path')].map((p) => (p.getAttribute('stroke') + ' dash=' + p.getAttribute('stroke-dasharray') + ' w=' + p.getAttribute('stroke-width'))) }));
  console.log(JSON.stringify(info, null, 1));
  await b.close();
})();
