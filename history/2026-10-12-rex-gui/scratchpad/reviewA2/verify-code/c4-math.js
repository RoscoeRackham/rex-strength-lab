const { chromium, EXE, settle, open } = require('./h.js');
(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await open(browser, __dirname + '/pages/' + (process.argv[2] || 'branch') + '.html', { duoOpen: true, duoAction: 'catch', action: 'throw' });
  const st = () => page.evaluate(() => ({ rexMath: !!(document.querySelector('#bay details.math') || {}).open, duoMath: !!(document.querySelector('#duo-bay details.math') || {}).open }));
  const s = async (l) => { await page.waitForTimeout(600); await settle(page, 'bay'); await settle(page, 'duo-bay'); console.log(l.padEnd(46), JSON.stringify(await st())); };
  await s('start');
  await page.click('#bay details.math > summary'); await s('opened Rex\'s Show the math');
  await page.click('#c-hard'); await s('clicked the element\'s Fastball');
  await page.click('#duo-bay details.math > summary'); await s('closed the element\'s Show the math');
  await page.click('#tab-jump'); await page.waitForTimeout(300); await page.click('#tab-throw'); await s('Rex\'s tab Jump -> Throw');
  await browser.close();
})();
