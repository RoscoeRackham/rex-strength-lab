const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const st of [null, { duoOpen: true, duoAction: 'arm' }]) {
    const page = await open(b, { w: 1280, h: 900, state: st, wait: 3500 });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const want = ['tablist', 'tab', 'tabpanel', 'heading', 'DisclosureTriangle', 'checkbox', 'group', 'main', 'complementary', 'region', 'combobox', 'status'];
    const out = [];
    for (const n of nodes) {
      if (n.ignored) continue;
      const role = n.role && n.role.value;
      if (!want.includes(role)) continue;
      const name = n.name ? n.name.value : '';
      const props = Object.fromEntries((n.properties || []).map((p) => [p.name, p.value.value]));
      out.push(role + ' "' + name + '"' + (props.level ? ' L' + props.level : '') + (props.expanded !== undefined ? ' exp=' + props.expanded : '') + (props.selected ? ' sel' : '') + (props.checked !== undefined ? ' chk=' + props.checked : ''));
    }
    console.log('=== state', JSON.stringify(st));
    console.log(out.filter((x) => !/^tab "/.test(x) || /sel/.test(x)).join('\n'));
    // aria-controls / labelledby validity
    const v = await page.evaluate(() => {
      const bad = [];
      for (const n of document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby],label[for]')) {
        for (const a of ['aria-controls', 'aria-labelledby', 'aria-describedby']) { const v = n.getAttribute(a); if (v) for (const id of v.split(/\s+/)) if (!document.getElementById(id)) bad.push(a + '=' + id + ' on ' + (n.id || n.tagName)); }
        if (n.tagName === 'LABEL' && n.htmlFor && !document.getElementById(n.htmlFor)) bad.push('for=' + n.htmlFor);
      }
      const ids = {}; for (const n of document.querySelectorAll('[id]')) ids[n.id] = (ids[n.id] || 0) + 1;
      const dup = Object.entries(ids).filter(([, c]) => c > 1);
      const tabs = ['tabs', 'duo-tabs'].map((id) => { const l = document.getElementById(id); return { id, label: l.getAttribute('aria-label'), n: l.querySelectorAll('[role=tab]').length, zero: l.querySelectorAll('[tabindex="0"]').length, controls: [...new Set([...l.querySelectorAll('[role=tab]')].map((t) => t.getAttribute('aria-controls')))] }; });
      const panels = ['bay', 'duo-bay'].map((id) => ({ id, lb: document.getElementById(id).getAttribute('aria-labelledby') }));
      return { bad, dup, tabs, panels };
    });
    console.log(JSON.stringify(v));
    await page.context().close();
  }
  await b.close();
})();
