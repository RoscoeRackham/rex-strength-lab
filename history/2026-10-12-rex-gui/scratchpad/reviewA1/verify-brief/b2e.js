const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx } = await openPage(b, 'branch', { action: 'throw', duoAction: 'arm', duoOpen: true });
  await waitIdle(page, '#duo-bay', 30000);
  await page.evaluate(() => document.querySelectorAll('details.effort-adjust').forEach((d) => (d.open = true)));
  const lab = page.locator('#duo-bay label[for="near"]');
  await lab.scrollIntoViewIfNeeded(); await lab.click();
  console.log('Click the duo bay label "Nearest people and buildings (m)": focus on', await page.evaluate(() => { const a = document.activeElement; return (a.id || a.tagName) + ' in ' + (a.closest('#bay') ? 'bay (Rex)' : a.closest('#duo-bay') ? 'duo-bay' : 'other'); }));
  await ctx.close(); await b.close();
})();
