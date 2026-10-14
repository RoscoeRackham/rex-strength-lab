const { launch, openPage, waitIdle } = require('./lib');
async function axName(page, sel) {
  const cdp = await page.context().newCDPSession(page);
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
  const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
  const n = nodes[0];
  return JSON.stringify(n.name ? n.name.value : null);
}
(async () => {
  const b = await launch();
  {
    const { page, ctx, errors } = await openPage(b, 'branch', { action: 'throw', duoAction: 'arm', duoOpen: true });
    await waitIdle(page, '#duo-bay', 30000);
    // open both effort-adjust details so the controls render
    await page.evaluate(() => document.querySelectorAll('details.effort-adjust').forEach((d) => (d.open = true)));
    await page.waitForTimeout(300);
    console.log('near labels:', await page.evaluate(() => Array.from(document.querySelectorAll('#near')).map((e) => (e.closest('#bay') ? 'bay' : 'duo-bay') + ' labels=' + e.labels.length).join(', ')));
    console.log('AX name rex #near:', await axName(page, '#bay #near'), ' duo #near:', await axName(page, '#duo-bay #near'));
    const duoNear = page.locator('#duo-bay #near');
    await duoNear.scrollIntoViewIfNeeded();
    await duoNear.click();
    await duoNear.fill('40');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000); await waitIdle(page, '#duo-bay', 30000);
    const where = await page.evaluate(() => { const a = document.activeElement; return (a.id || a.tagName) + ' in ' + (a.closest('#bay') ? 'bay (Rex)' : a.closest('#duo-bay') ? 'duo-bay' : 'other'); });
    console.log('After Enter in the duo bay #near (value 40), focus is on:', where, '| state.near =', await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).near), errors.join(';'));
    await ctx.close();
  }
  {
    const { page, ctx } = await openPage(b, 'branch', { action: 'throw', duoAction: 'wrestle', wrestleMove: 'throw', duoOpen: true });
    await waitIdle(page, '#duo-bay', 30000);
    console.log('angle labels:', await page.evaluate(() => Array.from(document.querySelectorAll('#angle')).map((e) => (e.closest('#bay') ? 'bay' : 'duo-bay') + ' labels=' + e.labels.length).join(', ')));
    console.log('AX name rex #angle:', await axName(page, '#bay #angle'), ' duo #angle:', await axName(page, '#duo-bay #angle'));
    // drag the duo angle with keyboard and see where focus lands
    const a = page.locator('#duo-bay #angle');
    await a.scrollIntoViewIfNeeded(); await a.focus(); await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(2500);
    console.log('After ArrowRight on duo #angle, focus:', await page.evaluate(() => { const a = document.activeElement; return (a.id || a.tagName) + ' in ' + (a.closest('#bay') ? 'bay (Rex)' : a.closest('#duo-bay') ? 'duo-bay' : 'other'); }));
    await ctx.close();
  }
  await b.close();
})();
