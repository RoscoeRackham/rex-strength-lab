const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(NEW()); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2000);
  const cdp = await page.context().newCDPSession(page);
  const dump = async (label) => {
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const byId = new Map(nodes.map((n) => [n.nodeId, n]));
    const want = nodes.filter((n) => { const r = n.role && n.role.value; const nm = (n.name && n.name.value) || ''; return (r === 'heading' && /ollie|rex|test|lab/i.test(nm)) || r === 'DisclosureTriangle' || r === 'tablist' || (r === 'checkbox' && /bolted/i.test(nm)) || (r === 'combobox' && /ground/i.test(nm)) || r === 'tabpanel' || (r === 'main') || (r === 'complementary') || r === 'group' && /bolted/i.test(nm); });
    console.log('--- ' + label);
    for (const n of want) {
      const props = (n.properties || []).filter((p) => ['expanded', 'level', 'checked', 'selected', 'controls', 'labelledby'].includes(p.name)).map((p) => p.name + '=' + JSON.stringify(p.value.value !== undefined ? p.value.value : p.value.relatedNodes && p.value.relatedNodes.length));
      const kids = (n.childIds || []).map((id) => byId.get(id)).filter(Boolean).map((k) => k.role && k.role.value).join(',');
      console.log(n.role.value, JSON.stringify((n.name && n.name.value || '').slice(0, 110)), props.join(' '), n.ignored ? 'IGNORED' : '', 'kids:' + kids.slice(0, 80));
    }
  };
  await dump('closed');
  await page.click('#duo > summary'); await page.waitForTimeout(2500);
  await dump('open');
  // heading outline
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  console.log('--- headings in AX tree');
  for (const n of nodes) if (n.role && n.role.value === 'heading' && !n.ignored) { const lv = (n.properties || []).find((p) => p.name === 'level'); console.log('h' + (lv && lv.value.value), (n.name && n.name.value || '').slice(0, 70)); }
  await b.close();
})();
