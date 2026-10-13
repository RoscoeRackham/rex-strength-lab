// rand84's Stomp tab timed out on both pages: is a search stuck, or does the result text say "working"?
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const c = require('../cases.json').find((x) => x.id === 'rand84');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const v of ['main', 'branch']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const st = Object.assign({}, c.state, { action: 'stomp', group: 'solo' });
    await ctx.addInitScript((s) => { if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('s', '1'); } }, JSON.stringify(st));
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(__dirname, '..', v + '.html'));
    for (const t of [3000, 30000]) {
      await page.waitForTimeout(t);
      const txt = await page.evaluate(() => document.querySelector('#bay').textContent.replace(/\s+/g, ' '));
      const i = txt.search(/working/i);
      console.log(v, 'after', t, 'ms: working at', i, '…' + txt.slice(Math.max(0, i - 200), i + 200));
    }
    // with effort all-out as in the case
    await page.evaluate(() => { const s = document.querySelector('#effort'); s.value = 'allout'; s.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForTimeout(5000);
    const txt = await page.evaluate(() => document.querySelector('#bay').textContent.replace(/\s+/g, ' '));
    const i = txt.search(/working/i);
    console.log(v, 'all-out: working at', i, '…' + txt.slice(Math.max(0, i - 300), i + 200));
    await ctx.close();
  }
  await browser.close();
})();
