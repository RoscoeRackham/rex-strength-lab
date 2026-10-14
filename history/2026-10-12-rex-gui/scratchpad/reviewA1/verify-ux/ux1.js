const { BR, MAIN, open, launch, S } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, url, st] of [['branch', BR, { duoOpen: true, duoAction: 'arm', action: 'throw' }], ['main-solo', MAIN, { group: 'solo', action: 'throw' }], ['main-duo', MAIN, { group: 'duo', duoAction: 'arm' }]]) {
    const { page, ctx, errs } = await open(b, url, st);
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => {
      const ids = {}; document.querySelectorAll('[id]').forEach((e) => { ids[e.id] = (ids[e.id] || 0) + 1; });
      const dups = Object.entries(ids).filter(([k, v]) => v > 1);
      const nears = Array.from(document.querySelectorAll('#near')).map((n) => ({ inBay: n.closest('[id=bay],[id=duo-bay]') && n.closest('[id=bay],[id=duo-bay]').id, labels: n.labels.length, visible: !!n.offsetParent }));
      return { dups, nears };
    });
    console.log(name, JSON.stringify(r), 'errs', errs.length);
    if (name === 'branch') {
      // AX names
      const snap = await page.accessibility.snapshot({ interestingOnly: true }).catch(() => null);
      const cdp = await ctx.newCDPSession(page);
      const { nodes } = await cdp.send('Accessibility.getFullAXTree');
      const spins = nodes.filter((n) => n.role && n.role.value === 'spinbutton').map((n) => (n.name && n.name.value));
      console.log('spinbutton AX names', JSON.stringify(spins));
      // click label in duo bay
      const lab = page.locator('#duo-bay label[for=near]');
      console.log('duo label count', await lab.count());
      if (await lab.count()) {
        await lab.click();
        console.log('after clicking duo label, focus:', await page.evaluate(() => { const a = document.activeElement; return a.tagName + '#' + a.id + ' in ' + (a.closest('#bay') ? 'bay' : a.closest('#duo-bay') ? 'duo-bay' : 'neither'); }));
      }
      // type in duo near
      const dn = page.locator('#duo-bay #near');
      await dn.focus(); await dn.fill('40'); await dn.press('Enter');
      await page.waitForTimeout(3000);
      console.log('after typing 40+Enter in duo near, focus:', await page.evaluate(() => { const a = document.activeElement; return a.tagName + '#' + a.id + ' in ' + (a.closest('#bay') ? 'bay' : a.closest('#duo-bay') ? 'duo-bay' : 'neither'); }));
      console.log('near values', await page.evaluate(() => Array.from(document.querySelectorAll('#near')).map((x) => x.value)));
    }
    await ctx.close();
  }
  // angle: wrestle throw + throw
  {
    const { page, ctx } = await open(b, BR, { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'throw', angle: 45 });
    await page.waitForTimeout(3000);
    const r = await page.evaluate(() => Array.from(document.querySelectorAll('#angle')).map((n) => ({ bay: n.closest('#bay') ? 'bay' : n.closest('#duo-bay') ? 'duo' : '?', v: n.value, labels: n.labels.length })));
    console.log('angle inputs', JSON.stringify(r));
    const cdp = await ctx.newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    console.log('slider AX names', JSON.stringify(nodes.filter((n) => n.role && n.role.value === 'slider').map((n) => n.name && n.name.value)));
    const da = page.locator('#duo-bay #angle');
    if (await da.count()) {
      await da.focus();
      for (let i = 0; i < 5; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(150); }
      await page.waitForTimeout(3000);
      console.log('after 5 ArrowRight on duo angle:', JSON.stringify(await page.evaluate(() => ({ stateAngle: JSON.parse(localStorage.getItem('rex-lab-v1')).angle, inputs: Array.from(document.querySelectorAll('#angle')).map((n) => (n.closest('#bay') ? 'bay' : 'duo') + '=' + n.value), labels: Array.from(document.querySelectorAll('label[for=angle]')).map((l) => l.textContent) }))));
    }
    await ctx.close();
  }
  await b.close();
})();
