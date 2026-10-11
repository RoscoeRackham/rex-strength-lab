const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const m = 180 * Math.pow(25, 3);
  for (const sc of [
    { name: 'Kaiju real 0.95W', st: { H: 50, m, logKg: Math.log10(0.95 * m), inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', obj: 'car', angle: 45 } },
    { name: 'Kaiju chip click from defaults', st: null },
  ]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    if (sc.st) await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, sc.st);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(600);
    if (!sc.st) { await page.click('#size-chips .chip[data-h="50"]'); await page.waitForTimeout(200); }
    console.log('=== ' + sc.name + ' | ' + await page.textContent('#dial-big') + ' | ' + await page.textContent('#dial-force') + ' | setup: ' + await page.textContent('#setup-sum'));
    for (const tab of ['throw', 'lift', 'jump', 'sprint', 'pull', 'punch']) {
      await page.click('#tab-' + tab); await page.waitForTimeout(150);
      console.log('  ' + tab + ': ' + await page.$eval('#bay .verdict', (e) => e.textContent));
    }
    await page.close();
  }
  await browser.close();
})();
