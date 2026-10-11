const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  for (const st of JSON.parse(process.argv[2])) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('#bay input, #bay label, #bay button.chip').forEach((e) => {
        const cs = getComputedStyle(e); const vis = e.offsetParent !== null && cs.visibility !== 'hidden' && cs.display !== 'none';
        out.push(e.tagName + (e.type ? '[' + e.type + ']' : '') + ' vis=' + vis + ' dis=' + !!e.disabled + ' | ' + (e.innerText || e.value || '').replace(/\s+/g, ' ').slice(0, 80) + (e.getAttribute('aria-label') ? ' aria=' + e.getAttribute('aria-label') : ''));
      });
      return out.slice(0, 40).join('\n');
    });
    console.log('=== ' + JSON.stringify(st) + '\n' + r);
  }
  await browser.close();
})();
