const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[1280, 900], [1280, 720]]) {
    const { ctx, p } = await open(browser, w, h, 'light');
    await p.mouse.wheel(0, 600); await p.waitForTimeout(300);
    const m = await p.evaluate(() => { const el = document.querySelector('.panel'); const cs = getComputedStyle(el); return { sh: el.scrollHeight, ch: el.clientHeight, ov: cs.overflowY, scrollbarW: el.offsetWidth - el.clientWidth }; });
    console.log(w, h, m);
    await p.screenshot({ path: `/home/user/build-calc/shots/audit-${w}x${h}-panel.png` });
    await ctx.close();
  }
  await browser.close();
})();
