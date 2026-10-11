const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const init of [
    { mode: 'real' },
    { mode: 'real', logKg: Math.log10(511) },
    { mode: 'real', logKg: 6 },
    { mode: 'real', groundHolds: true },
    { mode: 'comic' },
    {},
  ]) {
    const p = await b.newPage();
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, init);
    await p.reload();
    await p.waitForTimeout(300);
    const before = await p.evaluate(() => localStorage.getItem('rex-lab-v1'));
    const btn = p.locator('article.feat', { hasText: 'Hurdle a twenty-story building' }).locator('button.run');
    await btn.click();
    await p.waitForTimeout(500);
    const after = await p.evaluate(() => localStorage.getItem('rex-lab-v1'));
    const bay = await p.locator('#bay').innerText();
    console.log('INIT', JSON.stringify(init));
    console.log(' before', before);
    console.log(' after ', after);
    console.log(' bay:', bay.slice(0, 600).replace(/\n+/g, ' | '));
    await p.close();
  }
  await b.close();
})();
