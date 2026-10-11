const { open, launch, DIR } = require('./h.js');
const CSS = `
.seg button:focus-visible { outline-offset: -2px; box-shadow: inset 0 0 0 4px var(--sheet); }
.fig:focus-visible { position: relative; z-index: 1; }
.plate { grid-template-columns: minmax(0, 1fr); } .plate .chip { overflow-wrap: anywhere; }
@media (min-width: 720px) and (max-width: 899px) { .drawer { grid-template-columns: minmax(0, 1fr) !important; padding: 16px !important; gap: 18px !important; } }
.drawer[hidden] { display: none; }
`;
(async () => {
  const b = await launch();
  // L1 + L13 ring checks
  const p = await open(b, { width: 390, height: 844, skel: 'host' });
  await p.addStyleTag({ content: CSS });
  await p.evaluate(() => { const el = document.getElementById('hReal'); el.previousElementSibling.focus(); });
  await p.keyboard.press('Tab');
  let el = await p.$('#hReal'); let bb = await el.boundingBox(); await p.screenshot({ path: `${DIR}/fix-l1.png`, clip: { x: bb.x - 120, y: bb.y - 6, width: bb.width + 130, height: bb.height + 12 } });
  const id = await p.evaluate(() => Array.from(document.querySelectorAll('.figs')).find(g => g.children.length >= 3).children[1].dataset.id);
  await p.evaluate((id) => { const c = document.querySelector('.fig[data-id="' + id + '"]'); c.previousElementSibling.focus(); c.scrollIntoView({ block: 'center' }); }, id);
  await p.keyboard.press('Tab'); await p.waitForTimeout(100);
  el = await p.$('.fig[data-id="' + id + '"]'); bb = await el.boundingBox(); await p.screenshot({ path: `${DIR}/fix-l13.png`, clip: { x: bb.x - 6, y: bb.y - 6, width: bb.width + 12, height: 120 } });
  // L6 under real heights
  await p.click('#hReal'); await p.waitForTimeout(50);
  console.log('L6 after fix:', await p.evaluate(() => { let n = 0; document.querySelectorAll('.fig[data-id]').forEach(c => { const cr = c.getBoundingClientRect(); c.querySelectorAll('.plate *').forEach(x => { if (x.getBoundingClientRect().right > cr.right + 0.5) n++; }); }); return n; }));
  el = await p.$('.fig[data-id="thing"]'); await el.scrollIntoViewIfNeeded(); bb = await el.boundingBox(); await p.screenshot({ path: `${DIR}/fix-l6.png`, clip: { x: bb.x, y: bb.y + bb.height - 150, width: bb.width, height: 150 } });
  await p._ctx.close();
  // L2 at 720/768
  for (const w of [720, 768, 860]) {
    const q = await open(b, { width: w, height: 900, skel: 'task' });
    await q.addStyleTag({ content: CSS });
    const r = await q.evaluate(async () => { let bad = 0; const ids = [...new Set(Array.from(document.querySelectorAll('.fig[data-id]')).map(c => c.dataset.id))]; for (const id of ids) { document.querySelector('.fig[data-id="' + id + '"]').click(); await new Promise(r => setTimeout(r, 0)); if (document.documentElement.scrollWidth > document.documentElement.clientWidth) bad++; document.getElementById('drawerClose').click(); } return { bad, n: ids.length, drawerHiddenH: document.getElementById('drawer').getBoundingClientRect().height }; });
    console.log('L2/L9 after fix', w, JSON.stringify(r));
    await q._ctx.close();
  }
  await b.close();
})();
