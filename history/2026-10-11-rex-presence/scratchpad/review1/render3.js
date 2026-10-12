const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file://' + __dirname + '/preview.html');
  const H = 50, m = 3007 * Math.pow(50 / 3.048, 3);
  await p.evaluate(([H, m]) => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk', H, m, logKg: 12, stepEffort: 0.5 })), [H, m]);
  await p.reload();
  await p.waitForTimeout(3000);
  // open all <details>
  await p.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
  const txt = await p.evaluate(() => document.body.innerText);
  const i = txt.indexOf('Pace: people');
  console.log(txt.slice(i, i + 900));
  const j = txt.indexOf('Load on each step'); console.log(txt.slice(j, j + 120));
  await b.close();
})();
