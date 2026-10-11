const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const intro = await p.$eval('#feats .intro', (e) => e.textContent);
  console.log('INTRO:', intro);
  const cards = await p.$$eval('#feat-groups article.feat', (as) => as.map((a) => [a.querySelector('.badge').textContent, a.querySelector('.t').textContent, a.querySelector('.c').textContent]));
  for (const c of cards) console.log(c[0].padEnd(15), '|', c[1], '|', c[2].slice(0, 90));
  const el = await p.$('#feats');
  await el.screenshot({ path: process.argv[2] + '/d9-feats.png' });
  await b.close();
})();
