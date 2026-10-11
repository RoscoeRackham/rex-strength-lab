const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/index.html');
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); s.surface = 'ice'; s.groundHolds = false; localStorage.setItem('rex-lab-v1', JSON.stringify(s)); });
  await p.reload();
  await p.waitForTimeout(5000);
  const t = await p.evaluate(() => document.body.textContent.replace(/(MPa|kPa)/g, "$1\n"));
  for (const line of t.split('\n')) if (/(Ground limit|limit 5|Pressure under|5-25)/i.test(line)) console.log('>', line.slice(0, 400));
  await b.close();
})();
