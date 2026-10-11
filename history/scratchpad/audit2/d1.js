const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  const st = { logKg: Math.log10(200e18*907.18474), inf:false, action:'lift', obj:'allstar', surface:'concrete', mode:'comic' };
  await p.evaluate(s => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await p.reload();
  await p.waitForTimeout(1500);
  const t = await p.evaluate(() => document.body.innerText);
  const i = t.indexOf('never says');
  console.log(i>=0 ? t.slice(Math.max(0,i-300), i+200) : 'NOT FOUND');
  await b.close();
})();
