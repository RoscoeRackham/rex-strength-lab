const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  const p = await open(b, { width: 1280, height: 900, skel: 'host', fonts: false });
  const r = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('.fig[data-id]').forEach(c => {
      const chips = Array.from(c.querySelectorAll('.plate .chip')).map(x => x.textContent.toLowerCase());
      const flags = Array.from(c.querySelectorAll('.plate .flag')).map(x => x.textContent);
      const warn = chips.filter(t => !/^(estimate|derived)$/.test(t));
      if (!warn.length && !flags.length) return;
      const lab = c.getAttribute('aria-label');
      out.push({ id: c.dataset.id, label: lab, warnChips: warn, flags, missing: warn.filter(w => !lab.toLowerCase().includes(w)).concat(flags.filter(f => !lab.includes(f))) });
    });
    const fr = [];
    document.querySelectorAll('.fp-row button.nm').forEach(bn => { const id = bn.dataset.open; const e = window.__bc.LIST.find(x => x.id === id); if (e.score.value > window.__bc.HUMAN_TOP) fr.push({ id, label: bn.getAttribute('aria-label'), hasBeyond: /beyond/.test(bn.getAttribute('aria-label')) }); });
    return { cells: out, forestBeyond: fr };
  });
  r.cells.forEach(c => console.log(JSON.stringify(c)));
  console.log('forest rows beyond human data:', r.forestBeyond.length, 'with "beyond" in label:', r.forestBeyond.filter(x => x.hasBeyond).length);
  console.log(JSON.stringify(r.forestBeyond.slice(0, 3)));
  // accessibility snapshot of one cell
  const snap = await p.accessibility.snapshot({ root: await p.$('.fig[data-id="colossus"]') || await p.$('.fig[data-id]') , interestingOnly: false}).catch(e => String(e));
  console.log('a11y snapshot:', JSON.stringify(snap).slice(0, 400));
  await b.close();
})();
