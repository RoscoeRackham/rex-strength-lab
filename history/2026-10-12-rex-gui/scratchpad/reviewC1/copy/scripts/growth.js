const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w,h,scheme] of [[1280,900,'light'],[390,844,'dark']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type()==='error') errs.push(m.text()); });
  await page.goto(url);
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'weight' });
  await page.reload(); await page.waitForTimeout(500); await settle(page, 'bay');
  for (const what of ['krakatoa','chicxulub','sun']) {
    await page.click('#grow-what-' + what); await page.waitForTimeout(500); await settle(page, 'bay');
    const t = await page.evaluate(() => document.querySelector('.growth-whatif').innerText);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log('=== ' + w + ' ' + what + (sw? ' OVERFLOW '+sw:'') + '\n' + t);
    await page.evaluate(() => document.querySelector('.growth-whatif').scrollIntoView());
    await page.screenshot({ path: OUT + '/growth-' + what + '-' + w + '.png' });
  }
  console.log('errors', errs);
  await page.close();
  }
  await browser.close();
})();
