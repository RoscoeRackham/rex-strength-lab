const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const btns = await page.$$('.run');
    const n = btns.length;
    const out = [];
    for (const i of [0, 5, n - 1]) {
      const b = (await page.$$('.run'))[i];
      const title = await b.evaluate(e => e.closest('.feat').querySelector('.t').textContent);
      await b.focus(); await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      const r = await page.evaluate((h) => { const v = document.querySelector('.verdict'); const b = v ? v.getBoundingClientRect() : null; const a = document.activeElement; return { verdictTop: b && Math.round(b.top), verdictVisible: !!b && b.top >= 0 && b.bottom <= h, verdict: v && v.textContent.slice(0, 70), focus: a.className + ' ' + a.textContent.slice(0, 20) }; }, h);
      out.push(title + ' -> ' + JSON.stringify(r));
    }
    console.log('== ' + w + ' (' + n + ' simulate buttons)\n' + out.join('\n'));
    if (w === 390) await page.screenshot({ path: __dirname + '/lay_after-simulate-390.png' });
    await ctx.close();
  }
  await browser.close();
})();
