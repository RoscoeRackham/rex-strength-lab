const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'loco', st: { logKg: 18.7, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'loco', angle: 80 } },
    { name: 'titanic', st: { logKg: 20, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'titanic', angle: 45 } },
  ];
  for (const c of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, c.st);
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l05v/preview_fix.html');
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => {
      const tiles = [...document.querySelectorAll('.tile')].map((t) => t.innerText.replace(/\n/g, ' | '));
      const labs = [...document.querySelectorAll('svg text.lbl-strong')].map((t) => t.textContent).filter((t) => t.startsWith('top'));
      const paths = [...document.querySelectorAll('svg path')].map((p) => (p.getAttribute('d') || '').split(/[ML]/).length - 1);
      return { tiles, labs, paths };
    });
    console.log(c.name, JSON.stringify(info));
    const svg = await page.$('svg[aria-label^="Flight path"]');
    if (svg) await svg.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l05v/' + c.name + '_fix.png' });
    await ctx.close();
  }
  await browser.close();
})();
