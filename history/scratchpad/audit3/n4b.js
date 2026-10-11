const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1200, height: 1600 } });
  const url = 'file:///home/user/dino-strength-sim/dist/index.html';
  for (const [lg, inf, ang] of [[9, false, 30], [6, false, 30]]) {
    await p.goto(url);
    await p.evaluate(([lg, inf, ang]) => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: lg, inf, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'baseball', angle: ang })), [lg, inf, ang]);
    await p.reload();
    await p.waitForTimeout(1500);
    const t = await p.evaluate(() => {
      const chips = [...document.querySelectorAll('.status-row .status')].map((x) => x.textContent).join(' / ');
      const li = [...document.querySelectorAll('ul.happens li')].map((x) => x.textContent).filter((x) => /sinks|ground under|holds back/.test(x));
      return chips + ' || ' + li.join(' | ');
    });
    console.log(lg, inf, ang, '=>', t);
  }
  await b.close();
})();
