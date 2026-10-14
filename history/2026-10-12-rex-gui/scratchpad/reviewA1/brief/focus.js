const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'pages', 'branch.html'));
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm', action: 'throw' })));
  await page.reload(); await page.waitForTimeout(2500);
  const where = () => page.evaluate(() => { const a = document.activeElement; return (a.id || a.tagName) + ' in ' + (a.closest('#duo-bay') ? 'duo-bay' : a.closest('#bay') ? 'bay' : 'other'); });
  // open the duo bay's effort details so its near field is visible
  await page.evaluate(() => { for (const d of document.querySelectorAll('#duo-bay details')) d.open = true; });
  const duoNear = await page.$('#duo-bay #near');
  console.log('duo near exists', !!duoNear, 'solo near exists', !!(await page.$('#bay #near')));
  // 1. click the duo bay's label
  await page.click('#duo-bay label[for="near"]');
  console.log('after clicking the duo bay label "Nearest people and buildings":', await where());
  // 2. focus the duo bay's input, type a value, press Tab (change event)
  await duoNear.focus(); console.log('focused:', await where());
  await duoNear.fill('40'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
  console.log('after Enter in the duo bay near field:', await where());
  await browser.close();
})();
