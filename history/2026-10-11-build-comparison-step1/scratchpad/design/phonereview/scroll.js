const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const base='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/';
  const jobs = [['instrument',[560,9900]],['lineup',[1650]],['reader',[7450, 2300]]];
  for (const [m, ys] of jobs) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await p.goto('file://'+base+m+'/mock.html'); await p.waitForTimeout(800);
    for (const y of ys) { await p.evaluate(y=>window.scrollTo(0,y), y); await p.waitForTimeout(400);
      await p.screenshot({ path: `v-${m}-${y}.png` }); }
    await p.close();
  }
  await b.close();
})();
