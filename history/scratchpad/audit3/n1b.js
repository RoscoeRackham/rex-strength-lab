const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const prev = '/home/user/dino-strength-sim/dist/preview.html';
const cases = [
 { name: 'shuttle-18-20-bolted', s: { logKg: 18, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'throw', obj: 'shuttle', angle: 20 } },
 { name: 'titanic-18.5-20-bolted', s: { logKg: 18.5, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'throw', obj: 'titanic', angle: 20 } },
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const c of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, c.s);
    const page = await ctx.newPage();
    await page.goto('file://' + prev);
    await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const bay = document.querySelector('main.panel');
      const verdict = bay.querySelector('.verdict') ? bay.querySelector('.verdict').textContent : '';
      const tiles = [...bay.querySelectorAll('.tile')].map(t => t.textContent.replace(/\s+/g, ' ').trim());
      const svgs = [...bay.querySelectorAll('svg[aria-label^="Flight path"]')].map(s => [...s.querySelectorAll('text')].map(t => t.textContent).join(' | '));
      const hap = [...bay.querySelectorAll('li')].map(l => l.textContent).join(' || ');
      return { verdict, tiles, svgs, hap: hap.slice(0, 800) };
    });
    console.log('==', c.name, JSON.stringify(info, null, 1));
    const bay = await page.$('main.panel');
    await bay.screenshot({ path: c.name + '.png' });
    await ctx.close();
  }
  await browser.close();
})();
