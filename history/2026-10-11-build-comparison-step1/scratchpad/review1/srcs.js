const { chromium, CHROME, open } = require('./lib');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, { w: 1280, h: 900, fonts: false });
  const r = await p.evaluate(() => { const s = Array.from(document.querySelectorAll('#sources details.src summary')).map((x) => x.textContent); const n = document.querySelectorAll('#sources .fact').length; return { s, n }; });
  console.log(JSON.stringify(r));
  await ctx.close(); await browser.close();
})();
