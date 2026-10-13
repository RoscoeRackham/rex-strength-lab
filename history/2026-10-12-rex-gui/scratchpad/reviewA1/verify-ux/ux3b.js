const { BR, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx } = await open(b, BR, { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus' }, { width: 1280, height: 900 });
  await page.waitForTimeout(4000);
  await page.click('#duo > summary'); await page.waitForTimeout(500);
  await page.locator('#tier-chips .chip', { hasText: 'All-Star' }).click();
  await page.waitForTimeout(1500);
  await page.click('#duo > summary');
  for (const t of [200, 1500, 3000, 6000, 12000]) {
    await page.waitForTimeout(t);
    console.log(t, JSON.stringify(await page.evaluate(() => { const v = document.querySelector('#duo-bay .verdict'); const r = document.querySelector('#duo-bay .effort-read, #duo-bay [class*=read]'); return { v: v && v.textContent.slice(0, 100), read: r && r.textContent.slice(0, 120), live: document.querySelector('#duo-live').textContent.slice(0, 80) }; })));
  }
  // compare with fresh load at the same state
  const o = await open(b, BR, { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus', logKg: null }, { width: 1280, height: 900 });
  await o.page.locator('#tier-chips .chip', { hasText: 'All-Star' }).click();
  await o.page.waitForTimeout(12000);
  console.log('fresh+chip', JSON.stringify(await o.page.evaluate(() => { const v = document.querySelector('#duo-bay .verdict'); return v && v.textContent.slice(0, 100); })));
  await ctx.close(); await b.close();
})();
