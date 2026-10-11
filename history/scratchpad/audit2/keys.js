const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  await page.focus('#strength');
  const v = () => page.evaluate(() => [document.querySelector('#strength').value, document.querySelector('#dial-big').textContent, document.querySelector('#strength').getAttribute('aria-valuetext')]);
  console.log('start', await v());
  await page.keyboard.press('ArrowRight'); console.log('ArrowRight', await v());
  await page.keyboard.press('PageUp'); console.log('PageUp', await v());
  await page.keyboard.press('End'); console.log('End', await v());
  // tabs: Home/End
  await page.focus('#tab-throw');
  await page.keyboard.press('End'); console.log('tab End ->', await page.evaluate(() => document.activeElement.id + ' selected=' + document.querySelector('[aria-selected=true]').id));
  await page.keyboard.press('ArrowRight'); console.log('tab ArrowRight ->', await page.evaluate(() => document.activeElement.id + ' selected=' + document.querySelector('[aria-selected=true]').id));
  // angle slider via keyboard keeps focus?
  await page.click('#tab-throw');
  await page.focus('#angle');
  for (let i = 0; i < 5; i++) { await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(60); }
  console.log('angle after 5x ArrowLeft:', await page.evaluate(() => [document.querySelector('label[for=angle]').textContent, document.activeElement.id]));
  // Rapid keys (no wait) — key repeat
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(150);
  console.log('angle after 10 rapid ArrowLeft:', await page.evaluate(() => [document.querySelector('label[for=angle]').textContent, document.activeElement.id]));
  await browser.close();
})();
