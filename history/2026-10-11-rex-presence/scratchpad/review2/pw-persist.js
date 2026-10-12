const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage();
  await page.goto(pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href);
  await page.waitForTimeout(1000);
  await page.click('#tab-sprint'); await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('details.effort-adjust').open = true);
  await page.fill('#goal', '0.05'); await page.press('#goal', 'Enter'); await page.dispatchEvent('#goal', 'change'); await page.waitForTimeout(800);
  const before = await page.evaluate(() => ({ goal: document.querySelector('#goal').value, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).gSprint, line: (document.querySelector('#bay').innerText.match(/The gentlest push that[^\n]*/) || [''])[0] }));
  await page.reload(); await page.waitForTimeout(1500);
  await page.evaluate(() => document.querySelector('details.effort-adjust').open = true);
  const after = await page.evaluate(() => ({ goal: document.querySelector('#goal').value, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).gSprint }));
  console.log('sprint goal before reload', JSON.stringify(before), '\n after reload', JSON.stringify(after));
  await b.close();
})();
