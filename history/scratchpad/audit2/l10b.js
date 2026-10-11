const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/';
const orig = 'file:///home/user/dino-strength-sim/dist/preview.html';
const fixed = 'file://' + dir + 'l10-fixed.html';
async function measure(page, tag) {
  const r = await page.evaluate(() => {
    const bay = document.querySelector('#bay');
    const rows = [...bay.querySelectorAll('.viz svg')].map((s) => {
      const vb = s.viewBox.baseVal.width;
      const rw = s.getBoundingClientRect().width;
      const sl = s.getBoundingClientRect().left;
      let minX = Infinity; let clipped = [];
      for (const t of s.querySelectorAll('text')) { const b = t.getBBox(); if (b.x < -0.5 || b.x + b.width > vb + 0.5) clipped.push(t.textContent + '@' + b.x.toFixed(0)); }
      return { vb, rw: Math.round(rw), textPx: +(11 * rw / vb).toFixed(1), clipped };
    });
    const openDetails = [...bay.querySelectorAll('details')].filter((d) => d.open).length;
    return { vw: innerWidth, bayW: bay.clientWidth, rows, openDetails };
  });
  console.log(tag, JSON.stringify(r));
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, url] of [['orig', orig], ['fixed', fixed]]) {
    const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.addInitScript(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 12, action: 'stomp' })); });
    await page.goto(url); await page.waitForTimeout(800);
    await page.evaluate(() => { const d = document.querySelector('#bay details'); if (d) d.open = true; });
    await measure(page, name + ' 844');
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(600);
    await measure(page, name + ' ->390');
    await page.setViewportSize({ width: 390, height: 700 }); await page.waitForTimeout(600);
    await measure(page, name + ' height-only');
    await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(600);
    await measure(page, name + ' ->844');
    await ctx.close();
  }
  for (const vw of [320, 360, 375, 390]) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 700 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.addInitScript(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 12, action: 'stomp' })); });
    await page.goto(orig); await page.waitForTimeout(800);
    await measure(page, 'orig load ' + vw);
    await ctx.close();
  }
  await browser.close();
})();
