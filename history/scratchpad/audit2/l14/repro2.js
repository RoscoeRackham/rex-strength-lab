const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l14/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    let renders = 0;
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(2500);
    const res = await page.evaluate(async () => {
      const out = [];
      const n = document.querySelectorAll('#ladder-viz .mk').length;
      for (let i = 0; i < n; i++) {
        const wrap = document.querySelector('#ladder-viz');
        const mk = wrap.querySelectorAll('.mk')[i];
        mk.dispatchEvent(new PointerEvent('pointerenter'));
        const tip = wrap.querySelector('.tip');
        const wr = wrap.getBoundingClientRect(); const tr = tip.getBoundingClientRect();
        out.push({ label: mk.getAttribute('aria-label'), over: Math.round(tr.bottom - wr.bottom), top: Math.round(tr.top - wr.top), th: Math.round(tr.height), wh: Math.round(wr.height), sh: wrap.scrollHeight, ch: wrap.clientHeight, cw: wrap.clientWidth, ow: wrap.offsetWidth });
        mk.dispatchEvent(new PointerEvent('pointerleave'));
      }
      return out;
    });
    for (const r of res) if (r.over > -30) console.log(width, JSON.stringify(r));
    await page.close();
  }
  await browser.close();
})();
