const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const DEF = { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 };
  const states = [
    ['default-jump', {}],
    ['kaiju50-sand-1e12', { H: 50, m: 180 * Math.pow(25, 3), surface: 'sand', logKg: 12 }],
    ['kaiju-real-sand-secretwars', { H: 50, m: 180 * Math.pow(25, 3), surface: 'sand', mode: 'real', logKg: Math.log10(1.5e14) }],
  ];
  for (const [name, o] of states) {
    const p = await b.newPage();
    await p.addInitScript((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({}, DEF, o));
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(800);
    const txt = await p.evaluate(() => { const st = JSON.parse(localStorage.getItem('rex-lab-v1')); const items=[...document.querySelectorAll('ul.happens li')].map(l=>l.textContent); const tilesT=[...document.querySelectorAll('.tile')].map(t=>t.textContent); return {st, items, tilesT, verdict:[...document.querySelectorAll('.verdict')].map(v=>v.textContent)}; });
    console.log('=== ' + name, JSON.stringify(txt, null, 1));
    await p.close();
  }
  await b.close();
})();
