const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/index.html');
  await p.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: Math.log10(100*907.18474), inf:false, mode:'comic', surface:'ice', groundHolds:false, anchor:'friction', H:2, m:180, action:'lift', obj:'car', angle:45 })); });
  await p.reload();
  await p.waitForTimeout(5000);
  const t = await p.evaluate(() => document.querySelector('#bay').innerText);
  for (const line of t.split('\n')) if (/limit|Ground/i.test(line)) console.log('>', line.slice(0, 300));
  await b.close();
})();
