// Accessibility tree: Bolted names, tab list names, aria-controls/labelledby pairs, the h2 in the summary, the cue
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const duoOpen of [false, true]) {
    const { page, errs } = await open(browser, { w: 1280, h: 900, state: duoOpen ? { duoOpen: true, duoAction: 'collide' } : null });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { document.getElementById('powers').open = true; }); await page.waitForTimeout(300);
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const name = (n) => (n.name && n.name.value) || '';
    const role = (n) => (n.role && n.role.value) || '';
    const pick = nodes.filter((n) => !n.ignored && (['checkbox', 'tablist', 'heading', 'tab', 'tabpanel', 'DisclosureTriangle', 'button'].includes(role(n))));
    const want = pick.filter((n) => /Bolted|moves|tests|Rex \+ Ollie|More below|TWO-PLAYER|Two-player/i.test(name(n)) || role(n) === 'tablist' || role(n) === 'tabpanel' || role(n) === 'DisclosureTriangle');
    console.log('duoOpen', duoOpen);
    for (const n of want) console.log('  ', role(n), JSON.stringify(name(n)).slice(0, 140), (n.properties || []).filter((p) => ['expanded', 'selected'].includes(p.name)).map((p) => p.name + '=' + p.value.value).join(' '));
    const cueInTree = nodes.some((n) => !n.ignored && /More below/.test(name(n)));
    console.log('   cue in the accessibility tree:', cueInTree);
    const refs = await page.evaluate(() => {
      const bad = [];
      for (const n of document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby],label[for]')) for (const a of ['aria-controls', 'aria-labelledby', 'aria-describedby', 'for']) { const v = n.getAttribute(a); if (v) for (const id of v.split(/\s+/)) if (!document.getElementById(id)) bad.push(a + '->' + id); }
      const ids = {}; for (const n of document.querySelectorAll('[id]')) ids[n.id] = (ids[n.id] || 0) + 1;
      return { bad, dup: Object.keys(ids).filter((k) => ids[k] > 1), bay: document.getElementById('bay').getAttribute('aria-labelledby'), duoBay: document.getElementById('duo-bay').getAttribute('aria-labelledby'), lives: Array.from(document.querySelectorAll('[aria-live]')).map((n) => n.id + ':' + n.getAttribute('aria-live')) };
    });
    console.log('   refs', JSON.stringify(refs));
    if (errs.length) console.log('   errs', errs);
    await page.context().close();
  }
  await browser.close();
})();
