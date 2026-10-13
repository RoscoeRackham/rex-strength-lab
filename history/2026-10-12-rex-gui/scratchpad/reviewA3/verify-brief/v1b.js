const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file://' + D + '/branch.html');
  for (const gh of [false, true]) {
    await p.evaluate((gh) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide', colMode: 'charge', colSrc: 'set', colGB: -4, surface: 'concrete', groundHolds: gh })); }, gh);
    await p.reload(); await p.waitForTimeout(2500);
    const v = await p.evaluate(() => [...document.querySelectorAll(".verdict")].map(e => e.textContent));
    console.log('groundHolds', gh, JSON.stringify(v && v.slice(0, 4)));
  }
  await b.close();
})();
