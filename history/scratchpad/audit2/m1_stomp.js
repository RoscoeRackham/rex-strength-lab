const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    ['real 1e6', { logKg: 6, mode: 'real', action: 'stomp' }],
    ['real inf', { logKg: 6, inf: true, mode: 'real', action: 'stomp' }],
    ['real 1e20', { logKg: 20, mode: 'real', action: 'stomp' }],
    ['spidey real', { logKg: Math.log10(9071.8474), mode: 'comic', action: 'stomp' }],
    ['spidey real-mode', { logKg: Math.log10(9071.8474), mode: 'real', action: 'stomp' }],
    ['10 kg', { logKg: 1, mode: 'comic', action: 'stomp' }],
    ['511 kg', { logKg: Math.log10(511), mode: 'comic', action: 'stomp' }],
    ['1000 kg', { logKg: 3, mode: 'comic', action: 'stomp' }],
    ['5000 kg', { logKg: Math.log10(5000), mode: 'comic', action: 'stomp' }],
  ];
  for (const [label, st] of cases.slice(0,3)) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const info = await page.evaluate(() => {
      const q = (s) => Array.from(document.querySelectorAll(s)).map((e) => e.innerText.replace(/\s+/g, ' ').trim());
      return {
        dial: (document.querySelector('#dial-big') || {}).innerText,
        verdict: q('.verdict'),
        status: q('.status'),
        tiles: q('.tile').filter((t) => /launched|Hole|Crater/.test(t)),
        happens: q('.happens li').filter((t) => /foot takes|Newton/.test(t)),
      };
    });
    console.log('=== ' + label);
    console.log(JSON.stringify(info, null, 1));
    if (label === 'spidey real') await page.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/m1_spidey.png', fullPage: false });
    await page.close();
  }
  await browser.close();
})();
