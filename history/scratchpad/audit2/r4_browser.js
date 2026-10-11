const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { logKg: Math.log10(90718.474), surface: 'concrete' },
    { logKg: 6, surface: 'concrete' },
    { logKg: 30, surface: 'granite' },
    { logKg: 12, surface: 'steel' },
    { logKg: Math.log10(90718.474), surface: 'gravel' },
  ];
  for (const cs of cases) {
    const page = await browser.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((cs) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: cs.logKg, inf: false, mode: 'real', surface: cs.surface, groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 })); }, cs);
    await page.reload();
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => {
      const q = (s) => Array.from(document.querySelectorAll(s)).map((e) => e.innerText.replace(/\s+/g, ' ').trim());
      return { verdict: q('.verdict'), status: q('.status-row .status'), tiles: q('.tiles .tile'), happens: q('ul.happens li') };
    });
    console.log('=== ', cs.surface, cs.logKg.toFixed(3));
    console.log(JSON.stringify(txt, null, 1));
    await page.close();
  }
  await browser.close();
})();
