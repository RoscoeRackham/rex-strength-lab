const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = 'file:///home/user/dino-strength-sim/dist/preview.html';
const out = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/';
async function measure(page, tag) {
  const r = await page.evaluate(() => {
    const bay = document.querySelector('#bay');
    const rows = [...bay.querySelectorAll('.viz svg')].map((s) => {
      const vb = s.viewBox.baseVal.width;
      const rw = s.getBoundingClientRect().width;
      const t = s.querySelector('text');
      const th = t ? t.getBoundingClientRect().height : 0;
      return { vb, rw: Math.round(rw), scale: +(rw / vb).toFixed(3), textPx: +(11 * rw / vb).toFixed(1), textBoxH: +th.toFixed(1) };
    });
    return { vw: innerWidth, bayW: bay.clientWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, rows };
  });
  console.log(tag, JSON.stringify(r));
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const action of ['stomp', 'throw']) {
    const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    await page.addInitScript((a) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 12, action: a })); }, action);
    await page.goto(prev); await page.waitForTimeout(800);
    await measure(page, action + ' load 844x390');
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(800);
    await measure(page, action + ' rotated 390x844');
    await page.screenshot({ path: out + 'rot-' + action + '.png', fullPage: false });
    const svgEl = await page.$('#bay .viz svg');
    if (svgEl) await svgEl.screenshot({ path: out + 'rot-' + action + '-svg.png' });
    // reverse: portrait -> landscape
    await page.reload(); await page.waitForTimeout(800);
    await measure(page, action + ' reload 390x844');
    await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(800);
    await measure(page, action + ' rotated back 844x390');
    await ctx.close();
  }
  // 320
  for (const action of ['stomp', 'throw']) {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.addInitScript((a) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 12, action: a })); }, action);
    await page.goto(prev); await page.waitForTimeout(800);
    await measure(page, action + ' load 320x640');
    const svgEl = await page.$('#bay .viz svg');
    if (svgEl) await svgEl.screenshot({ path: out + 'w320-' + action + '-svg.png' });
    await ctx.close();
  }
  // desktop window resize
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 12, action: 'stomp' })); });
    await page.goto(prev); await page.waitForTimeout(800);
    await measure(page, 'desk load 1280');
    await page.setViewportSize({ width: 500, height: 900 }); await page.waitForTimeout(800);
    await measure(page, 'desk resized 500');
    await ctx.close();
  }
  await browser.close();
})();
