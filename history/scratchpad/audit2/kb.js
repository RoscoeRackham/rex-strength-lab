const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  const desc = () => page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return 'BODY'; const cs = getComputedStyle(a); const lab = a.getAttribute('aria-label') || a.textContent.trim().slice(0, 40) || a.id; return a.tagName + (a.id ? '#' + a.id : '') + ' "' + lab + '" outline=' + cs.outlineStyle + ' ' + cs.outlineWidth; });
  const seq = [];
  for (let i = 0; i < 45; i++) { await page.keyboard.press('Tab'); seq.push(await desc()); }
  console.log(seq.map((s, i) => i + ': ' + s).join('\n'));
  await browser.close();
})();
