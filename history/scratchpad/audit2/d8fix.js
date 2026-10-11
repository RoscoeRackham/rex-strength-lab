const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const kg of [247200 * 1.1, 2.5e5, 300 * 907.18474]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((kg) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: Math.log10(kg), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'lift', obj: 'b777', angle: 45 })); }, kg);
    const p = await ctx.newPage();
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(800);
    const out = await p.evaluate(() => {
      const rig = document.querySelector('.rig').innerText;
      const v = document.querySelector('.verdict'), s = document.querySelector('.status-row');
      const hp = [...document.querySelectorAll('.happens li, .happens p')].map(x => x.innerText);
      return { dial: rig.split('\n').slice(0, 4).join(' / '), verdict: v.innerText, status: s.innerText.replace(/\n/g, ' | '), happens: hp };
    });
    console.log(kg, JSON.stringify(out, null, 1));
    await ctx.close();
  }
  await b.close();
})();
