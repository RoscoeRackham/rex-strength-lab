const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);
  for (const chip of ['All-Star Superman', 'Superman benches Earth']) {
    await page.click(`#tier-chips .chip:has-text("${chip}")`);
    await page.waitForTimeout(200);
    for (const tab of ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint']) {
      await page.click('#tab-' + tab);
      await page.waitForTimeout(150);
      const txt = await page.$eval('main.panel', (e) => e.innerText);
      const lines = txt.split('\n').filter((l) => /light speed|leaves at|shoved|fist|recoil/i.test(l));
      // also find tiles with "1%"
      console.log(`== ${chip} / ${tab}`);
      const idx = txt.split('\n');
      idx.forEach((l, i) => { if (/light speed/.test(l)) console.log('  ', (idx[i-1]||'').slice(0,40), '|', l.slice(0, 200)); });
    }
  }
  await browser.close();
})();
