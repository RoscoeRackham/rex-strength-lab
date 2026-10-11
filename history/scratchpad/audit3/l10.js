const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const actions = process.argv.slice(2).length ? process.argv.slice(2) : null;
  for (const [w, h] of [[320, 640], [360, 740], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    const acts = await page.evaluate(() => [...document.querySelectorAll('[data-action], .tabs button, [role=tab]')].map(b => (b.dataset.action || b.textContent).trim()).slice(0, 40));
    if (w === 320) console.log('tabs/actions:', JSON.stringify(acts));
    const info = await page.evaluate(() => {
      const bay = document.querySelector('#bay');
      return { bayW: bay && bay.clientWidth, docW: document.documentElement.clientWidth, scrollW: document.documentElement.scrollWidth,
        svgs: [...document.querySelectorAll('#bay .viz svg')].map(s => { const vb = s.viewBox.baseVal.width; const r = s.getBoundingClientRect().width; const t = s.querySelector('text'); return { vb, px: Math.round(r), fontPx: t ? +(parseFloat(getComputedStyle(t).fontSize) * r / vb).toFixed(2) : null, label: (s.getAttribute('aria-label')||'').slice(0, 40) }; }) };
    });
    console.log(w + 'x' + h, JSON.stringify(info, null, 0));
    await page.close();
  }
  await browser.close();
})();
