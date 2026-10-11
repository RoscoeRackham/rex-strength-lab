const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  const surfaces = ['sand','gravel','softclay','stiffclay','asphalt','concrete','ice','steel','granite'];
  const tiers = [['spidey', 9071.8474], ['hulk', 90718.474], ['inf', null]];
  for (const [tn, kg] of tiers) for (const s of surfaces) for (const gh of [false, true]) {
    const st = { logKg: kg ? Math.log10(kg) : 5, inf: kg == null, mode: 'comic', surface: s, groundHolds: gh, anchor: 'friction', H: 2, m: 180, action: 'sprint', obj: 'car', angle: 45 };
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((st) => localStorage.setItem('rex-lab-v1', JSON.stringify(st)), st);
    await page.reload();
    await page.waitForTimeout(150);
    const info = await page.evaluate(() => {
      const v = document.querySelector('.verdict');
      const tiles = [...document.querySelectorAll('.tile')].map(t => t.innerText.replace(/\s+/g,' '));
      const stat = [...document.querySelectorAll('.status-row')].map(t => t.innerText.replace(/\s+/g,' '));
      return { v: v && v.innerText, t: tiles.filter(x => /0 to 100|Acceleration/.test(x)), stat: stat.slice(-1) };
    });
    console.log(tn, s, 'gh=' + gh, '|', info.v, '|', info.t.join(' ; '), '|', info.stat.join(''));
  }
  await browser.close();
})();
