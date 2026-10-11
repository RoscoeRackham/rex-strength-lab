const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const jobs = [
    ['sprint-390-light.png', 390, 'light', { action: 'sprint' }, 'main.panel'],
    ['pull-390-dark.png', 390, 'dark', { action: 'pull', obj: 'car' }, 'main.panel'],
    ['stomp-390-krakatoa.png', 390, 'light', { action: 'stomp', logKg: 20 }, 'main.panel'],
    ['throw-390-titanic.png', 390, 'light', { action: 'throw', obj: 'titanic', logKg: 20 }, 'main.panel'],
    ['jump-390-dark.png', 390, 'dark', { action: 'jump', logKg: 6 }, 'main.panel'],
  ];
  for (const [name, w, scheme, st, sel] of jobs) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    await ctx.addInitScript((s) => localStorage.setItem('rex-lab-v1', s), JSON.stringify(st));
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(900);
    await (await page.$(sel)).screenshot({ path: __dirname + '/' + name });
    await ctx.close();
  }
  await browser.close();
})();
