const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l02/';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[390,'light'],[1280,'light']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 844 }, colorScheme: scheme, deviceScaleFactor: 3 });
    const p = await ctx.newPage();
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(1200);
    await p.locator('#ladder-viz').scrollIntoViewIfNeeded();
    await p.waitForTimeout(600);
    const box = await p.evaluate(() => {
      const svg = document.querySelector('#ladder-viz svg');
      const line = [...svg.querySelectorAll('line')].find(l => l.getAttribute('x1') == '0');
      const r = line.getBoundingClientRect(); const s = svg.getBoundingClientRect();
      // captain america dot vs label
      const marks = [...svg.querySelectorAll('g.mk')].map(g => { const c = g.querySelector('circle'); const t = g.querySelector('text'); return { t: t.textContent, cy: +c.getAttribute('cy'), ty: +t.getAttribute('y') - 1 }; });
      return { y: r.top + window.scrollY, x: s.left, w: s.width, marks };
    });
    console.log(w, JSON.stringify(box.marks.filter(m => Math.abs(m.cy - m.ty) > 20)));
    await p.screenshot({ path: OUT + `now-zoom-${w}.png`, clip: { x: box.x, y: box.y - 50, width: box.w, height: 140 }, fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
