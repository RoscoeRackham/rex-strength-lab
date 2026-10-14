const { BR, MAIN, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, url, st] of [['branch', BR, {}], ['main', MAIN, {}]]) {
    const { page, ctx } = await open(b, url, st, { width: 1280, height: 900 });
    await page.waitForTimeout(2500);
    console.log(name, 'h2#duo-title parent:', await page.evaluate(() => { const h = document.querySelector('#duo-title'); return h ? h.parentElement.tagName + '.' + h.parentElement.className + ' > grandparent ' + h.parentElement.parentElement.tagName : 'none'; }));
    const cdp = await ctx.newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const byId = new Map(nodes.map((n) => [n.nodeId, n]));
    const interesting = nodes.filter((n) => n.role && ['DisclosureTriangle', 'button', 'heading'].includes(n.role.value) && n.name && /REX \+ OLLIE|Ollie|Size and density|Their powers|Comic|Ground/i.test(n.name.value || ''));
    for (const n of interesting.slice(0, 8)) console.log('  ', n.role.value, JSON.stringify(n.name.value), n.properties ? n.properties.filter((p) => ['expanded', 'level'].includes(p.name)).map((p) => p.name + '=' + p.value.value).join(',') : '');
    await ctx.close();
  }
  await b.close();
})();
