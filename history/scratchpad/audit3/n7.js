const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'real hulk concrete', s: { mode: 'real', surface: 'concrete', action: 'jump' } },
    { name: 'real 1e12 stiffclay', s: { mode: 'real', surface: 'stiffclay', action: 'jump', logKg: 12 } },{ name: 'real 1e15 steel', s: { mode: 'real', surface: 'steel', action: 'jump', logKg: 15 } },{ name: 'real 1e6 gravel', s: { mode: 'real', surface: 'gravel', action: 'jump', logKg: 6 } },{ name: 'real 1e6 concrete', s: { mode: 'real', surface: 'concrete', action: 'jump', logKg: 6 } },
    { name: 'real 1e9 concrete', s: { mode: 'real', surface: 'concrete', action: 'jump', logKg: 9 } },
    { name: 'real 1e12 concrete', s: { mode: 'real', surface: 'concrete', action: 'jump', logKg: 12 } },
    { name: 'real 1e15 concrete', s: { mode: 'real', surface: 'concrete', action: 'jump', logKg: 15 } },
    { name: 'real hulk concrete groundHolds', s: { mode: 'real', surface: 'concrete', action: 'jump', groundHolds: true } },
  ];
  for (const cs of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((st) => { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, cs.s);
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/wrap.html');
    await page.waitForTimeout(1500);
    const txt = await page.evaluate(() => {
      const m = document.querySelector('main.panel');
      return m ? m.innerText : document.body.innerText.slice(0, 3000);
    });
    console.log('=== ' + cs.name + '\n' + txt.split('\n').filter(l => /jumps|Ground|ground|Rigid|Real muscle|Takeoff|Peak/.test(l)).join('\n'));
    await page.close();
  }
  await browser.close();
})();
