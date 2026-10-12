const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file://' + __dirname + '/preview.html');
  for (const walker of ['rex', 'ollie']) {
    await p.evaluate((w) => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk', surface: 'sand', walker: w })), walker);
    await p.reload(); await p.waitForTimeout(2500);
    const txt = await p.evaluate(() => document.body.innerText);
    const j = txt.indexOf('\nFootprint\n'); console.log(walker, '|', txt.slice(j, j + 40).replace(/\n/g, ' / '));
  }
  const txt = await p.evaluate(() => document.body.innerText);
  for (const kw of ['footprint depth in sand like', 'airblast at which people start', 'airblast levels that rattle houses', 'A pushing speed borrowed']) {
    const k = txt.toLowerCase().indexOf(kw.toLowerCase()); console.log('ROW', txt.slice(Math.max(0, k - 30), k + 420).replace(/\n/g, ' / '));
  }
  await b.close();
})();
