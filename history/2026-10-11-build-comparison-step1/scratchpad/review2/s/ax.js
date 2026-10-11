const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 390, 844, 'light');
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
  const doc = await cdp.send('DOM.getDocument', { depth: -1 });
  async function ax(sel) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: sel });
    if (!nodeId) return sel + ': not found';
    const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
    const n = nodes[0];
    const props = (n.properties || []).filter((x) => /live|busy|atomic|relevant|hidden|pressed|expanded/.test(x.name)).map((x) => x.name + '=' + JSON.stringify(x.value.value));
    return sel + ' -> role=' + (n.role && n.role.value) + ' name="' + (n.name && n.name.value) + '"' + (n.ignored ? ' IGNORED' : '') + (props.length ? ' ' + props.join(' ') : '');
  }
  for (const s of ['#clusters button:nth-child(1)', '#clusters button:nth-child(4)', '.fig[data-id="thing"]', '.fig[data-id="rex"]', '#file', '#sheetCanvas', '#tSoldier', '#tChoose', '.btnrow', '#locTape', '#glance', '#tgtFront', '#toolStatus', '#targetStatus', '#validation', '#checks', '#results', '#tSkull', '#tTarget', '#tShape', '#limitCards .limit:nth-child(2)', '#fp [data-open="thing"]', '#zHum', '#hReal', '.gaptile', '#copyOut', '#copyBtn']) console.log(await ax(s));
  // fig open with drawer
  await p.click('.fig[data-id="rex"]');
  console.log(await ax('#drawer'));
  console.log(await ax('.fig[data-id="rex"]'));
  await ctx.close(); await b.close();
})();
