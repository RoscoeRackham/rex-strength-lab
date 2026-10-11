const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l02/';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[390,'light'],[390,'dark'],[320,'light'],[1280,'light']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 844 }, colorScheme: scheme });
    const p = await ctx.newPage();
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(1200);
    await p.locator('#ladder-viz').scrollIntoViewIfNeeded();
    await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const svg = document.querySelector('#ladder-viz svg');
      const sr = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const scale = sr.width / vb.width;
      const out = { svgW: sr.width, vbW: vb.width, scale, clipped: [], nowLabel: null, state: localStorage.getItem('rex-lab-v1') };
      svg.querySelectorAll('text').forEach(t => {
        const bb = t.getBBox();
        const right = bb.x + bb.width;
        if (right > vb.width + 0.5 || bb.x < -0.5) out.clipped.push({ txt: t.textContent, x: bb.x.toFixed(0), right: right.toFixed(0), over: (right - vb.width).toFixed(0), left: bb.x.toFixed(0) });
        if (/^now/.test(t.textContent)) out.nowLabel = { x: bb.x, y: bb.y, w: bb.width, h: bb.height };
      });
      // overlaps of now label with others
      if (out.nowLabel) {
        const n = out.nowLabel; out.nowOverlaps = [];
        svg.querySelectorAll('text').forEach(t => { if (/^now/.test(t.textContent)) return; const bb = t.getBBox();
          if (bb.x < n.x + n.w && bb.x + bb.width > n.x && bb.y < n.y + n.h && bb.y + bb.height > n.y) out.nowOverlaps.push(t.textContent); });
        // which texts does the now-line (y = cy) pass through
        const line = [...svg.querySelectorAll('line')].find(l => l.getAttribute('x1') == '0');
        const cy = +line.getAttribute('y1'); out.cy = cy; out.lineHits = [];
        svg.querySelectorAll('text').forEach(t => { const bb = t.getBBox(); if (bb.y < cy && bb.y + bb.height > cy) out.lineHits.push(t.textContent); });
      }
      return out;
    });
    console.log(w, scheme, JSON.stringify(r, null, 1));
    await p.locator('#ladder-viz').screenshot({ path: OUT + `ladder-${w}-${scheme}.png` });
    await ctx.close();
  }
  await b.close();
})();
