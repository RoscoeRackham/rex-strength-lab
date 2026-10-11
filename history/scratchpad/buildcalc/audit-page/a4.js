const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, 390, 844, 'light', { dpr: 3 });
  await p.selectOption('#buildSelect', 'ronnie_coleman');
  await p.fill('#hFt', '32'); await p.fill('#hIn', '9.7');
  const fig = await p.$('.figure');
  await fig.screenshot({ path: 'fig-10m-imp.png' });
  await p.click('#uMet');
  await fig.screenshot({ path: 'fig-10m-met.png' });
  await p.fill('#hCm', '50');
  await fig.screenshot({ path: 'fig-05m-met.png' });
  await ctx.close(); await browser.close();
})();
