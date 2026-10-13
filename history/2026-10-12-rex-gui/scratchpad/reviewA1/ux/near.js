const { NEW, OLD, launch } = require('./common');
(async () => {
  const b = await launch();
  for (const rexAdjustOpen of [false, true]) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm', action: 'throw' }))); await page.reload(); await page.waitForTimeout(3500);
    const info = await page.evaluate((rexOpen) => {
      const nears = Array.from(document.querySelectorAll('#near'));
      const where = nears.map((n) => n.closest('#duo-bay') ? 'duo-bay' : n.closest('#bay') ? 'bay' : '?');
      const duoAdj = document.querySelector('#duo-bay details'); if (duoAdj) duoAdj.open = true;
      if (rexOpen) document.querySelector('#bay details.effort-adjust').open = true;
      const duoNear = nears.find((n) => n.closest('#duo-bay'));
      return { count: nears.length, where, duoLabelControlIsRex: duoNear && duoNear.closest('.field').querySelector('label').control !== duoNear, duoNearLabels: duoNear && duoNear.labels.length };
    }, rexAdjustOpen);
    console.log('Rex adjust ' + (rexAdjustOpen ? 'open' : 'closed') + ':', JSON.stringify(info));
    // accessible name of the duo #near
    const cdp = await page.context().newCDPSession(page);
    await page.waitForTimeout(200);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const spins = nodes.filter((n) => n.role && n.role.value === 'spinbutton').map((n) => JSON.stringify((n.name && n.name.value) || ''));
    console.log('  spinbuttons in AX tree (names):', spins.join(', '));
    // click the duo label
    await page.evaluate(() => { const lab = Array.from(document.querySelectorAll('label[for="near"]')).find((l) => l.closest('#duo-bay')); lab.click(); });
    console.log('  click duo label -> focus:', await page.evaluate(() => { const a = document.activeElement; return a.tagName + '#' + a.id + ' in ' + (a.closest('#duo-bay') ? 'duo-bay' : a.closest('#bay') ? 'bay' : 'body/other'); }));
    // type into the duo #near and commit with Enter
    const duoNear = await page.$('#duo-bay #near');
    await duoNear.focus(); await duoNear.fill('40'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
    console.log('  duo #near = 40 + Enter -> focus:', await page.evaluate(() => { const a = document.activeElement; return a.tagName + (a.id ? '#' + a.id : '') + ' in ' + (a.closest('#duo-bay') ? 'duo-bay' : a.closest('#bay') ? 'bay' : 'body/other'); }), '; scrollY', await page.evaluate(() => Math.round(scrollY)));
    await page.close();
  }
  await b.close();
})();
