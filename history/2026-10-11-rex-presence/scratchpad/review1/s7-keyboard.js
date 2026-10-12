const { launch, OUT, PREV } = require('./lib');
// Tab through the page on several tabs; list each focusable control in the bay / comic panel with its accessible label and focus outline.
(async () => {
  const b = await launch();
  const cases = [
    { name: 'throw', st: { action: 'throw' } },
    { name: 'walk', st: { action: 'walk' } },
    { name: 'weight', st: { action: 'weight' }, after: async (p) => { await p.click('#grow-what-chicxulub'); } },
    { name: 'duo-arm', st: { group: 'duo', duoAction: 'arm' }, after: async (p) => { await p.check('#o-effort-own'); } },
    { name: 'comic', st: { action: 'throw' }, after: async (p) => { await p.evaluate(() => { document.querySelector('#comic-setup').open = true; }); await p.selectOption('#absorb', 'runaway'); } },
  ];
  for (const cs of cases) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, cs.st);
    await page.goto(PREV); await page.waitForTimeout(1500);
    if (cs.after) { await cs.after(page); await page.waitForTimeout(800); }
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.focus('body');
    const seen = [];
    for (let i = 0; i < 160; i++) {
      await page.keyboard.press('Tab');
      const f = await page.evaluate(() => {
        const e = document.activeElement; if (!e || e === document.body) return null;
        const inScope = e.closest('#bay') || e.closest('#comic-setup');
        const s = getComputedStyle(e);
        const lbl = e.getAttribute('aria-label') || (e.id && document.querySelector('label[for="' + e.id + '"]') ? document.querySelector('label[for="' + e.id + '"]').innerText : '') || (e.closest('label') ? e.closest('label').innerText.slice(0, 40) : '') || e.innerText.slice(0, 40);
        return { inScope: !!inScope, tag: e.tagName, id: e.id, type: e.type || '', lbl: lbl.replace(/\s+/g, ' ').slice(0, 60), vt: e.getAttribute('aria-valuetext'), outline: s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor, footer: !!e.closest('footer') || !!e.closest('#sources') };
      });
      if (!f) continue;
      if (f.inScope) seen.push(f);
      if (f.footer) break;
    }
    console.log('=====', cs.name);
    const uniq = []; const k = new Set();
    for (const f of seen) { const key = f.tag + f.id + f.lbl; if (!k.has(key)) { k.add(key); uniq.push(f); } }
    for (const f of uniq) console.log('  ', f.tag, f.type, '#' + f.id, '|', f.lbl, '| vt:', f.vt, '|', f.outline);
    await ctx.close();
  }
  await b.close();
})();
