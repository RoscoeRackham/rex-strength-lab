const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pg.goto(url); await settledOn(pg, 'bay');
  const t = await pg.evaluate(() => Array.from(document.querySelectorAll('#assume div')).filter((d) => /shimmer/i.test(d.textContent)).map((d) => d.textContent.replace(/ /g, ' ')));
  console.log(t.join('\n\n'));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
