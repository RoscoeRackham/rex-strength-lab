const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const {PREV}=require('./lib');
(async()=>{
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [360,1280]) {
    const page = await browser.newPage({ viewport:{width:w,height:900}, deviceScaleFactor: 4 });
    await page.goto(PREV); await page.waitForTimeout(2000);
    await page.click('#grp-solo'); await page.click('#tab-walk'); await page.waitForTimeout(1500);
    const svgEl = await page.$('#bay svg[aria-label^="Ground shaking"]');
    await svgEl.scrollIntoViewIfNeeded();
    const b = await svgEl.boundingBox();
    await page.screenshot({ path: `f9z-corner-${w}.png`, clip: { x: b.x + 20, y: b.y + b.height - 50, width: 70, height: 40 } });
    if (w===360) await page.screenshot({ path: `f9z-right-${w}.png`, clip: { x: b.x + b.width - 120, y: b.y + b.height - 40, width: 120, height: 25 } });
    await page.close();
  }
  await browser.close();
})();
