const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const delay of [8, 16, 50]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', angle: 45 })); } catch (e) {} });
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/preview_l04fix.html');
    await page.waitForTimeout(500);
    const r = await page.$('#angle');
    await r.scrollIntoViewIfNeeded();
    const box = await r.boundingBox();
    const y = box.y + box.height / 2, x0 = box.x + box.width * 0.5, x1 = box.x + box.width * 0.1;
    await page.mouse.move(x0, y); await page.mouse.down();
    const trace = [];
    for (let i = 1; i <= 30; i++) {
      await page.mouse.move(x0 + (x1 - x0) * i / 30, y);
      await page.waitForTimeout(delay);
      trace.push(await page.evaluate(() => document.getElementById('angle').value));
    }
    await page.mouse.up();
    await page.waitForTimeout(100);
    console.log('delay', delay, 'trace', trace.join(','), 'final', await page.evaluate(() => document.querySelector('label[for=angle]').textContent));
    await ctx.close();
  }
  await browser.close();
})();
