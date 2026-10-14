const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let pcFail = 0, mouseFail = 0;
  for (let i = 0; i < 6; i++) {
    for (const how of ['page.click', 'mouse']) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto(pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href);
      await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true })));
      await page.reload(); await page.waitForTimeout(1500);
      await page.evaluate(() => { document.querySelector('.panel-controls').scrollTop = 0; window.scrollTo(0, document.getElementById('duo-bay').getBoundingClientRect().top + window.scrollY - 20); });
      await page.waitForTimeout(300);
      try {
        if (how === 'page.click') await page.click('#more-below', { timeout: 3000 });
        else { const r = await page.$eval('#more-below', (c) => { const b = c.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); await page.mouse.click(r.x, r.y); }
        await page.waitForTimeout(900);
        const ok = await page.evaluate(() => { const r = document.querySelector('#powers > summary').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && document.getElementById('more-wrap').hidden; });
        if (!ok) { if (how === 'mouse') mouseFail++; else pcFail++; }
      } catch (e) { if (how === 'mouse') mouseFail++; else pcFail++; }
      await page.close();
    }
  }
  console.log('page.click failures', pcFail, '/6; real mouse click failures', mouseFail, '/6');
  await browser.close();
})();
