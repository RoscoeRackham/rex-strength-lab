const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>';
  const prev = __dirname + '/n8-preview.html';
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'allstar comic ground H2', logKg: Math.log10(200e18*907.18474), inf:false, groundHolds:true, H:2 },
    { name: 'inf comic ground H2', inf:true, groundHolds:true, H:2 },
    { name: 'allstar comic ground H50', logKg: Math.log10(200e18*907.18474), inf:false, groundHolds:true, H:50 },
    { name: 'allstar comic ground H0.3', logKg: Math.log10(200e18*907.18474), inf:false, groundHolds:true, H:0.3 },
    { name: 'allstar concrete H2', logKg: Math.log10(200e18*907.18474), inf:false, groundHolds:false, H:2 },
  ];
  for (const cs of cases) {
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    const st = Object.assign({ logKg: 5, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 }, cs);
    delete st.name;
    await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, st);
    await page.goto('file://' + prev);
    await page.waitForTimeout(1500);
    const txt = await page.evaluate(() => { const m = document.querySelector('main.panel'); return m ? m.innerText.slice(0, 900) : 'no panel'; });
    console.log('=== ' + cs.name, errs);
    console.log(txt);
    await page.close();
  }
  await browser.close();
})();
