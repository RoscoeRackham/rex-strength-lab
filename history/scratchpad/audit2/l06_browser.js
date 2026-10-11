const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  for (const title of ['Atlas holds up the heavens', 'Hulk holds up a mountain range', 'Superman catches a 777', 'Bench-pressing the planet']) {
    const card = p.locator('.feat, article, div').filter({ hasText: title }).filter({ has: p.locator('button.run') }).last();
    await card.locator('button.run').first().click();
    await p.waitForTimeout(500);
    const info = await p.evaluate(() => {
      const q = (s) => [...document.querySelectorAll(s)].map(e => e.textContent.trim().replace(/\s+/g,' '));
      return { verdict: q('.verdict').slice(0,2), status: q('.status-row').slice(0,1), dial: q('.dial, #strength-out, output, .readout').slice(0,3), ls: localStorage.getItem('rex-lab-v1') };
    });
    console.log(title, JSON.stringify(info, null, 1));
  }
  await p.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l06_last.png' });
  // Atlas again with screenshot of rig
  const card = p.locator('div').filter({ hasText: 'Atlas holds up the heavens' }).filter({ has: p.locator('button.run') }).last();
  await card.locator('button.run').first().click();
  await p.waitForTimeout(800);
  await p.locator('.rig').screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l06_atlas.png' });
  await b.close();
})();
