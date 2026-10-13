const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(S + '/pagecmp/branch.html').href);
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'throw', obj: 'baseball', angle: 0, logKg: 14 });
  await page.reload(); await page.waitForTimeout(800);
  await page.selectOption('#effort', 'windows'); await page.waitForTimeout(500);
  for (let i = 0; i < 400; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('bay').textContent)); if (!busy) break; await page.waitForTimeout(250); }
  const t = await page.evaluate(() => document.querySelector('#bay .effort-read').textContent.replace(/\s+/g, ' '));
  const h = await page.evaluate(() => (document.getElementById('bay').textContent.replace(/\s+/g, ' ').match(/His hand still meets real air[^.]*\.[^.]*\./) || [''])[0]);
  console.log('THROW windows:', t.slice(0, 300)); console.log('HAND:', h);
  await browser.close();
})();
