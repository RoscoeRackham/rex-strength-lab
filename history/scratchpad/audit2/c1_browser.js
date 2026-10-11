const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);
  for (const chip of ['allstar', 'earth']) {
    await page.click(`#tier-chips .chip[data-id="${chip}"]`);
    await page.waitForTimeout(200);
    console.log('==== chip', chip);
    for (const tab of ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'lift']) {
      await page.click('#tab-' + tab);
      await page.waitForTimeout(150);
      const txt = await page.$eval('main.panel', (e) => e.innerText);
      const lines = txt.split('\n').map(s=>s.trim()).filter(Boolean);
      const hits = [];
      lines.forEach((l, i) => { if (/light speed/.test(l)) hits.push((lines[i-1]||'') + ' | ' + l); });
      console.log('--', tab, JSON.stringify(hits, null, 0));
    }
  }
  console.log('errors', errs);
  await browser.close();
})();
