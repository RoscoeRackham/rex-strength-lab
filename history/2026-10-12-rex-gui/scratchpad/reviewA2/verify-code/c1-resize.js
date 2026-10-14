const { chromium, EXE, settle, rex, open } = require('./h.js');
const file = process.argv[2];
(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const st = { duoOpen: true, duoAction: 'catch', action: 'throw' };
  const page = await open(browser, file, st);
  console.log('before      Rex:', JSON.stringify(await rex(page)));
  await page.click('#duo-bay details.effort-adjust > summary');
  await page.waitForTimeout(300);
  // log the events the box gets
  await page.evaluate(() => { window.__ev = []; const n = document.getElementById('duo-near'); for (const t of ['change', 'blur', 'focusout']) n.addEventListener(t, () => window.__ev.push(t + (document.contains(n) ? '' : ':detached'))); });
  await page.click('#duo-near', { clickCount: 3 });
  await page.keyboard.type('50');
  console.log('typed, active =', await page.evaluate(() => document.activeElement.id), ' state.near saved =', await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).near));
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.waitForTimeout(1500);
  await settle(page, 'bay'); await settle(page, 'duo-bay');
  console.log('events on #duo-near:', JSON.stringify(await page.evaluate(() => window.__ev)));
  console.log('after resize Rex:', JSON.stringify(await rex(page)), ' near saved =', await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).near));
  await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); await settle(page, 'duo-bay');
  console.log('fresh load  Rex:', JSON.stringify(await rex(page)));
  console.log('errors:', JSON.stringify(page.errs));
  await browser.close();
})();
