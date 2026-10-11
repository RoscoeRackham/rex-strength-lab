const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  const states = [
    null,
    { logKg: 4.5, inf:false, mode:'comic', surface:'concrete', groundHolds:false, anchor:'friction', H:2, m:180, action:'throw', obj:'car', angle:45 },
    { logKg: 7, inf:false, mode:'comic', surface:'concrete', groundHolds:false, anchor:'friction', H:2, m:180, action:'throw', obj:'car', angle:45 },
    { logKg: 7, inf:false, mode:'comic', surface:'concrete', groundHolds:false, anchor:'bolted', H:2, m:180, action:'throw', obj:'car', angle:45 },
  ];
  for (const st of states) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(url);
    await page.evaluate((s) => { if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); else localStorage.removeItem('rex-lab-v1'); }, st);
    await page.reload();
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => {
      const pick = (sel) => Array.from(document.querySelectorAll(sel)).map(e => e.innerText.trim()).filter(Boolean);
      return { verdict: pick('.verdict'), chips: pick('.status'), tiles: pick('.tile').map(t=>t.replace(/\n/g,' | ')), happens: pick('.happens li') };
    });
    console.log('STATE', JSON.stringify(st));
    console.log(JSON.stringify(txt, null, 1));
    await ctx.close();
  }
  await browser.close();
})();
