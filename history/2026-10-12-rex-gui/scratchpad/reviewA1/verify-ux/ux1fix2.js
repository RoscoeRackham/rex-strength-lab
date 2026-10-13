const { open, launch, S } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx, errs } = await open(b, 'file://' + S + '/branch-fix1.html', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'throw', angle: 45 });
  await page.waitForTimeout(3000);
  const cdp = await ctx.newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  console.log('slider AX names', JSON.stringify(nodes.filter((n) => n.role && n.role.value === 'slider').map((n) => n.name && n.name.value)));
  await page.focus('#w-angle'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(2500);
  console.log('after ArrowRight on w-angle: focus', await page.evaluate(() => document.activeElement.id), 'values', await page.evaluate(() => [document.querySelector('#angle').value, document.querySelector('#w-angle').value]));
  console.log('errs', errs);
  await ctx.close(); await b.close();
})();
