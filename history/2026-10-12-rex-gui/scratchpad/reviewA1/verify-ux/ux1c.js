const { BR, MAIN, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx } = await open(b, BR, { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'throw', angle: 45 });
  await page.waitForTimeout(3000);
  console.log('angle inputs', JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('#angle')).map((n) => ({ bay: n.closest('#bay') ? 'bay' : n.closest('#duo-bay') ? 'duo' : '?', v: n.value, labels: n.labels.length })))));
  const cdp = await ctx.newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  console.log('slider AX names', JSON.stringify(nodes.filter((n) => n.role && n.role.value === 'slider').map((n) => n.name && n.name.value)));
  const da = page.locator('#duo-bay #angle');
  await da.focus();
  for (let i = 0; i < 5; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200); }
  await page.waitForTimeout(4000);
  console.log('after 5 ArrowRight on duo angle:', JSON.stringify(await page.evaluate(() => ({ stateAngle: JSON.parse(localStorage.getItem('rex-lab-v1')).angle, inputs: Array.from(document.querySelectorAll('#angle')).map((n) => (n.closest('#bay') ? 'bay' : 'duo') + '=' + n.value), labels: Array.from(document.querySelectorAll('label[for=angle]')).map((l) => (l.closest('#bay') ? 'bay' : 'duo') + ':' + l.textContent), focus: document.activeElement.id + (document.activeElement.closest('#bay') ? '@bay' : '@duo') }))));
  await ctx.close();
  // main: duplicates?
  for (const st of [{ group: 'solo', action: 'throw' }, { group: 'duo', duoAction: 'arm' }, { group: 'duo', duoAction: 'wrestle', wrestleMove: 'throw' }]) {
    const o = await open(b, MAIN, st); await o.page.waitForTimeout(2500);
    console.log('main', JSON.stringify(st), 'dups', JSON.stringify(await o.page.evaluate(() => { const ids = {}; document.querySelectorAll('[id]').forEach((e) => { ids[e.id] = (ids[e.id] || 0) + 1; }); return Object.entries(ids).filter(([k, v]) => v > 1); })));
    await o.ctx.close();
  }
  await b.close();
})();
