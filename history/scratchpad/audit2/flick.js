const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  const r = await page.evaluate(async () => {
    const s = document.querySelector('#strength'); const samples = [];
    for (let i = 0; i < 30; i++) {
      s.value = 4 + i * 0.05; s.dispatchEvent(new Event('input'));
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      samples.push(+getComputedStyle(document.querySelector('.verdict')).opacity);
    }
    return samples;
  });
  console.log('verdict opacity sampled ~2 frames after each slider step:', r.map(x => x.toFixed(2)).join(' '));
  const avg = r.reduce((a, b) => a + b) / r.length; console.log('mean', avg.toFixed(2));
  // effective contrast of verdict ink at mean opacity on surface
  await browser.close();
})();
