const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    ['escape', 320, { logKg: 12, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'throw', obj: 'baseball', angle: 45 }],
    ['cantthrow', 390, { logKg: 1.33, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'shot', angle: 45 }],
    ['jumpreal', 390, { logKg: 8, inf: false, mode: 'real', surface: 'sand', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 }],
    ['stompbig', 390, { logKg: 24, inf: false, mode: 'comic', surface: 'granite', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 }],
    ['punchc', 390, { logKg: 30, inf: false, mode: 'comic', surface: 'granite', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'punch', obj: 'car', angle: 45 }],
  ];
  for (const [name, w, st] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: 'light' });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(700);
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const t = await page.evaluate(() => document.querySelector('#bay').innerText.replace(/OBJECT[\s\S]*?(?=\n[A-Z][a-z])/, ''));
    console.log('==== ' + name + '\n' + t.slice(0, 1800));
    await (await page.$('#bay')).screenshot({ path: S + name + '.png' });
    await page.close();
  }
  await browser.close();
})();
