// Rex's Throw with the Rex + Ollie element closed vs open (after a redraw of both bays)
const { wrap, launch, settle, readResult, S } = require('./h.js');
const path = require('path');
(async () => {
  const b = await launch();
  for (const src of process.argv.slice(2)) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto(wrap(path.resolve(src), 'p8-' + src.split('/').slice(-3, -2)[0]));
    const res = {};
    for (const open of [false, true]) {
      await p.evaluate((o) => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: o, duoAction: 'arm', action: 'throw' })), open);
      await p.reload(); await p.waitForTimeout(800); await settle(p, 'bay'); if (open) await settle(p, 'duo-bay');
      // a change that redraws both bays (Rex's tab away and back)
      await p.click('#tab-jump'); await p.click('#tab-throw'); await p.waitForTimeout(600); await settle(p, 'bay');
      const r = await readResult(p, 'bay'); res[open ? 'open' : 'closed'] = r.verdict + ' | ' + (r.effort[0] || '(no effort box)').slice(0, 70);
    }
    console.log(src.split('/').slice(-3, -2)[0], JSON.stringify(res, null, 1));
    await p.close();
  }
  await b.close();
})();
