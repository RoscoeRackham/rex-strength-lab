const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = {
    blocked: () => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('The operation is insecure.', 'SecurityError'); } }); },
    quotaFull: () => { Storage.prototype.setItem = function () { throw new DOMException('quota', 'QuotaExceededError'); }; },
    badAction: () => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'fly' })),
    badMode: () => localStorage.setItem('rex-lab-v1', JSON.stringify({ mode: 'cartoon' })),
    nanLog: () => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: null })),
    strLog: () => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: '5' })),
    badAnchor: () => localStorage.setItem('rex-lab-v1', JSON.stringify({ anchor: 'glued' })),
    hugeH: () => localStorage.setItem('rex-lab-v1', JSON.stringify({ H: 1e6, m: 1e20 })),
    garbage: () => localStorage.setItem('rex-lab-v1', '{not json'),
    arrayJSON: () => localStorage.setItem('rex-lab-v1', '[1,2]'),
    nullJSON: () => localStorage.setItem('rex-lab-v1', '"hello"'),
  };
  for (const [name, fn] of Object.entries(cases)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(fn);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => ({ dial: document.querySelector('#dial-big').textContent, force: document.querySelector('#dial-force').textContent.slice(0, 60), verdict: (document.querySelector('.verdict') || document.querySelector('#bay .callout') || {}).textContent, selTab: (document.querySelector('[aria-selected=true]') || {}).id, setup: document.querySelector('#setup-sum').textContent, ladder: !!document.querySelector('#ladder-viz svg'), feats: document.querySelectorAll('.feat').length }));
    // interaction: click a tier chip
    let afterClick = '';
    try { await page.click('#tier-chips .chip >> nth=0', { timeout: 2000 }); afterClick = await page.textContent('#dial-big'); } catch (e) { afterClick = 'ERR ' + e.message.slice(0, 60); }
    console.log(name.padEnd(10), JSON.stringify(r), '| chip click ->', afterClick, '| errors:', JSON.stringify(errs.slice(0, 3)));
    await ctx.close();
  }
  await browser.close();
})();
