const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><style>[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'r9-preview.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext();
  for (const action of ['stomp']) for (const lk of [26,27,28,29,30]) {
    const page = await ctx.newPage();
    await page.goto('file://' + prev);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { logKg: lk, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action, obj: 'car', angle: 45 });
    await page.reload();
    await page.waitForTimeout(1500);
    const txt = await page.$eval('main.panel', (e) => e.innerText);
    const all = txt.split('\n'); const lines = []; all.forEach((l,i)=>{ if (/^(Crater|Energy into the ground|Foot speed at impact|Compared with)$/.test(l)) lines.push(l+': '+all[i+1]+' | '+all[i+2]); if (/rater scaling|overstates|whole planet|resurface/.test(l)) lines.push('  * '+l); });
    console.log('==', action, lk); console.log(lines.join('\n'));
    await page.close();
  }
  await browser.close();
})();
