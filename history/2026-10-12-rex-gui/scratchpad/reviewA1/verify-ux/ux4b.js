const { open, launch, S } = require('./lib');
(async () => {
  const b = await launch();
  for (const f of ['branch.html', 'branch-fix4.html', 'branch-fix4b.html']) {
    const { page, ctx } = await open(b, 'file://' + S + '/' + f, {}, { width: 1280, height: 900 });
    await page.waitForTimeout(2000);
    const cdp = await ctx.newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const n = nodes.filter((n) => n.role && ['DisclosureTriangle', 'heading'].includes(n.role.value) && /OLLIE/i.test((n.name && n.name.value) || ''));
    console.log(f, JSON.stringify(n.map((x) => x.role.value + ':' + x.name.value)));
    console.log('  layout', await page.evaluate(() => { const s = document.querySelector('#duo > summary'); const h = document.querySelector('#duo-title'); return 'summary h=' + Math.round(s.getBoundingClientRect().height) + ' h2 top=' + Math.round(h.getBoundingClientRect().top - s.getBoundingClientRect().top) + ' glyph=' + getComputedStyle(s, '::after').content; }));
    await page.screenshot({ path: S + '/ux4-' + f + '.png', clip: await page.evaluate(() => { const r = document.querySelector('#duo').getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: 120 }; }), fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
