const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const solo = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
  const duo = [['arm', 'push'], ['wrestle', 'push'], ['wrestle', 'throw'], ['catch', 'push'], ['collide', 'push']];
  const dupPairs = {};
  for (const a of solo) for (const [d, mv] of duo) {
    const { page, ctx, errors } = await openPage(b, 'branch', { action: a, duoAction: d, wrestleMove: mv, duoOpen: true });
    await waitIdle(page, '#duo-bay', 30000); await waitIdle(page, '#bay', 30000);
    const dups = await page.evaluate(() => { const m = {}; for (const e of document.querySelectorAll('[id]')) { (m[e.id] = m[e.id] || []).push(e.closest('#bay') ? 'bay' : e.closest('#duo-bay') ? 'duo-bay' : 'other'); } return Object.entries(m).filter(([k, v]) => v.length > 1).map(([k, v]) => k + '@' + v.join('+')); });
    if (dups.length) dupPairs[a + '/' + d + (d === 'wrestle' ? ':' + mv : '')] = dups;
    await ctx.close();
  }
  console.log('DUPLICATE IDS:', JSON.stringify(dupPairs, null, 1));
  // labels and focus on the default view (throw + arm)
  {
    const { page, ctx } = await openPage(b, 'branch', { action: 'throw', duoAction: 'arm', duoOpen: true });
    await waitIdle(page, '#duo-bay', 30000);
    const lab = await page.evaluate(() => Array.from(document.querySelectorAll('#near')).map((e) => (e.closest('#bay') ? 'bay' : 'duo-bay') + ' labels=' + e.labels.length));
    console.log('near labels:', lab.join(', '));
    // accessible name via CDP-less snapshot: use Playwright's accessibility
    const duoNear = page.locator('#duo-bay #near');
    const snap = await page.accessibility.snapshot({ root: await duoNear.elementHandle() });
    const rexSnap = await page.accessibility.snapshot({ root: await page.locator('#bay #near').elementHandle() });
    console.log('a11y name: duo near =', JSON.stringify(snap && snap.name), '; rex near =', JSON.stringify(rexSnap && rexSnap.name));
    await duoNear.focus();
    await duoNear.fill('40');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500); await waitIdle(page, '#duo-bay', 30000);
    const where = await page.evaluate(() => { const a = document.activeElement; return (a.id || a.tagName) + ' in ' + (a.closest('#bay') ? 'bay' : a.closest('#duo-bay') ? 'duo-bay' : 'other'); });
    console.log('After Enter in duo #near, focus is on:', where);
    await ctx.close();
  }
  {
    const { page, ctx } = await openPage(b, 'branch', { action: 'throw', duoAction: 'wrestle', wrestleMove: 'throw', duoOpen: true });
    await waitIdle(page, '#duo-bay', 30000);
    const lab = await page.evaluate(() => Array.from(document.querySelectorAll('#angle')).map((e) => (e.closest('#bay') ? 'bay' : 'duo-bay') + ' labels=' + e.labels.length));
    console.log('angle labels:', lab.join(', '));
    await ctx.close();
  }
  await b.close();
})();
