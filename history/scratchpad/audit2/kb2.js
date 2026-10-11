const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    await page.focus('#strength');
    for (let i = 0; i < 37; i++) await page.keyboard.press('Tab'); // -> "Spider-Man" marker (index 34 in walk)
    const f = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
    console.log(scheme, 'focused:', f);
    const box = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    await page.screenshot({ path: `ladder-focus-${scheme}.png`, clip: { x: Math.max(0, box.x - 120), y: box.y - 60, width: 700, height: 160 } });
    // press Enter and see where focus lands
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => { const a = document.activeElement; return a === document.body ? 'BODY (focus lost)' : (a.getAttribute('aria-label') || a.id || a.tagName); });
    const dial = await page.textContent('#dial-big');
    console.log(scheme, 'after Enter: dial=', dial, '| focus=', after);
    await page.keyboard.press('Tab');
    const next = await page.evaluate(() => { const a = document.activeElement; return a.getAttribute('aria-label') || a.id || a.tagName + ' ' + a.textContent.slice(0, 30); });
    console.log(scheme, 'next Tab goes to:', next);
    await page.close();
  }
  await browser.close();
})();
