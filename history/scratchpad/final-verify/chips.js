const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' })); });
    await page.reload(); await page.waitForTimeout(700);
    const r = await page.evaluate(() => [...document.querySelectorAll('#size-chips button, #density-chips button, #o-density-chips button, #tier-chips button')].map((b) => b.closest('[id]').id + ':' + b.textContent.trim() + (b.getAttribute('aria-pressed') === 'true' || b.classList.contains('on') || b.classList.contains('active') ? ' [PRESSED]' : '')));
    console.log(w, r.join(' | '));
    const vis = await page.evaluate(() => { const b = [...document.querySelectorAll('#density-chips button')].find((x) => /His build/.test(x.textContent)); if (!b) return 'none'; const rc = b.getBoundingClientRect(); const cs = getComputedStyle(b); return JSON.stringify({ x: rc.x, y: rc.y, w: rc.width, h: rc.height, bg: cs.backgroundColor, color: cs.color, display: cs.display }); });
    console.log(vis);
    await page.close();
  }
  await browser.close();
})();
