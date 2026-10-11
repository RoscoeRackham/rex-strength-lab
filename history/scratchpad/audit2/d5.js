const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 12, inf: false, mode: 'comic', surface: 'granite', action: 'stomp' })));
  await p.reload();
  await p.waitForTimeout(1500);
  const txt = await p.evaluate(() => document.body.innerText);
  const lines = txt.split('\n').filter(l => /magnitude|upper bound|Quake/i.test(l));
  console.log(lines.join('\n---\n'));
  await b.close();
})();
