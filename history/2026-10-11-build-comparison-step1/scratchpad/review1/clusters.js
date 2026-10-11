const { chromium, CHROME, open } = require('./lib');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, { w: 390, h: 844, fonts: true });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  const n = await p.evaluate(() => document.querySelectorAll('#clusters button').length);
  for (let i = 0; i < n; i++) {
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.click('#clusters button >> nth=' + i);
    await p.waitForTimeout(150);
    console.log(await p.evaluate((i) => { const b = document.querySelectorAll('#clusters button')[i]; const id = b.dataset.jump; return b.textContent + ' -> #' + id + ' top=' + Math.round(document.getElementById(id).getBoundingClientRect().top) + ' loc=' + document.getElementById('locNow').textContent; }, i));
  }
  await ctx.close(); await browser.close();
})();
