const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cases = [ { name: 'kaiju-jump-granite-13.58', st: { logKg: 13.58, inf: false, mode: 'comic', surface: 'granite', groundHolds: false, anchor: 'friction', H: 50, m: 2812500, action: 'jump', obj: 'car', angle: 45 } }, { name: 'titanic-30-bolted-17.18', st: { logKg: 17.18, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'throw', obj: 'titanic', angle: 30 } },
  { name: 'pyramid-45-bolted-16.91', st: { logKg: 16.91, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'throw', obj: 'pyramid', angle: 45 } },
  { name: 'shuttle-90-bolted-14.92', st: { logKg: 14.92, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'throw', obj: 'shuttle', angle: 90 } },
  { name: 'ruyi-60-bolted-12.68', st: { logKg: 12.68, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'throw', obj: 'ruyi', angle: 60 } },
  { name: 'kaiju-jump-granite-13.59', st: { logKg: 13.59, inf: false, mode: 'comic', surface: 'granite', groundHolds: false, anchor: 'friction', H: 50, m: 2812500, action: 'jump', obj: 'car', angle: 45 } },
  { name: 'kaiju-jump-stiffclay-13.71', st: { logKg: 13.71, inf: false, mode: 'comic', surface: 'stiffclay', groundHolds: false, anchor: 'friction', H: 50, m: 2812500, action: 'jump', obj: 'car', angle: 45 } },
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const c of cases) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 2400 } });
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/r15/repo/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.st);
    await page.reload();
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => {
      const b = document.querySelector('#bay');
      if (!b) return 'no #bay';
      const parts = [];
      b.querySelectorAll('.verdict, .status, .tile, .happens li').forEach((e) => parts.push(e.className.split(' ')[0] + ': ' + e.innerText.replace(/\n/g, ' | ')));
      return parts.join('\n');
    });
    console.log('=== ' + c.name + '\n' + txt + '\n');
    await page.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/r15/' + c.name + '.png', fullPage: false });
    await page.close();
  }
  await browser.close();
})();
