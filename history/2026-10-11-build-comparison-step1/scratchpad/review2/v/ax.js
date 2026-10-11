const { open, S } = require('./h.js');
(async () => {
  const { browser, ctx, p } = await open(1280, 900);
  await p.waitForTimeout(1000);
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  for (const sel of ['#toolStatus', '#targetStatus', '#validation', '#file', '#tChoose', '#tgtFront']) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
    const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
    const n = nodes[0];
    console.log(sel, 'role', n.role && n.role.value, 'name', JSON.stringify(n.name && n.name.value), 'ignored', n.ignored, 'props', JSON.stringify((n.properties || []).map((x) => x.name + '=' + JSON.stringify(x.value.value))));
  }
  // file input focus/tab
  const fi = await p.evaluate(() => { const f = document.getElementById('file'); const cs = getComputedStyle(f); return { tabindex: f.tabIndex, cls: f.className, ariaHidden: f.getAttribute('aria-hidden'), w: cs.width, h: cs.height, clip: cs.clip, pos: cs.position }; });
  console.log('file', JSON.stringify(fi));
  await browser.close();
})();
