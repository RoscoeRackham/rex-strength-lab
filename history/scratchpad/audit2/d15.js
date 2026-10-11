const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [1280, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('#ladder-viz svg g.mk').forEach(g => {
        const t = g.querySelectorAll('text');
        out.push([t[0].textContent, t[1].textContent, t[0].getAttribute('y')]);
      });
      return out;
    });
    console.log(w, JSON.stringify(info.filter(r => /Captain|Strongest|Back-lift|Spider/.test(r[0]))));
    const lad = await p.$('#ladder-viz');
    await lad.scrollIntoViewIfNeeded();
    // hover Cap
    const caps = await p.$$('#ladder-viz g.mk');
    for (const g of caps) { const t = await g.evaluate(n => n.querySelector('text').textContent); if (t === 'Captain America') { await g.focus(); await p.waitForTimeout(200); console.log('tip:', await p.$eval('#ladder-viz .tip', n => n.textContent)); } }
    const box = await lad.boundingBox();
    await p.screenshot({ path: `/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/d15-ladder-${w}.png`, clip: { x: box.x, y: box.y + box.height - 320, width: box.width, height: 320 }, fullPage: true });
    // also feat card text and dial at cap
    const feat = await p.evaluate(() => [...document.querySelectorAll('#feat-groups *')].map(n => n.textContent).find(s => /Captain America presses/.test(s) && s.length < 400));
    console.log('feat:', feat);
    await p.close();
  }
  await b.close();
})();
