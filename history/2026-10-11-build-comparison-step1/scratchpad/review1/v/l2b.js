const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  const p = await open(b, { width: 768, height: 900, skel: 'host' });
  await p.click('.fig[data-id="colossus_armored"]'); await p.waitForTimeout(200);
  const r = await p.evaluate(() => { const d = document.getElementById('drawer'), t = d.querySelector('.gt'), dd = t.closest('dd'); const R = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; }; return { drawer: R(d), dd: R(dd), table: R(t), tableMin: t.scrollWidth, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; });
  console.log(JSON.stringify(r));
  const t = await p.$('#drawer .gt'); await t.scrollIntoViewIfNeeded(); const bb = await t.boundingBox();
  await p.screenshot({ path: `${DIR}/l2-768-colossus.png`, clip: { x: 300, y: bb.y - 10, width: 468, height: 120 } });
  await b.close();
})();
