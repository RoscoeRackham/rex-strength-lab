const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html'); await p.waitForTimeout(600);
  console.log(await p.evaluate(() => { let e = document.querySelector('#bay .verdict'); while (e) { const c = getComputedStyle(e).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)') return [e.tagName, e.id, e.className, c]; e = e.parentElement; } }));
  // other triggers that close math: mode toggle, surface select
  await p.click('#bay details.math > summary');
  await p.click('#mode-real'); await p.waitForTimeout(200);
  console.log('math open after mode toggle:', await p.evaluate(() => document.querySelector('#bay details.math')?.open));
  await b.close();
})();
