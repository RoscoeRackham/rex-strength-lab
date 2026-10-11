const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: Math.log10(511), inf: false, mode: 'real', action: 'jump', groundHolds: true })));
  await p.reload(); await p.waitForTimeout(800); await p.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true)); await p.waitForTimeout(200);
  const t = await p.evaluate(() => document.body.innerText);
  const lines = t.split('\n').filter(l => /of force|Legs push|share of it|a\/F₀/.test(l));
  console.log(lines.join('\n'));
  await b.close();
})();
