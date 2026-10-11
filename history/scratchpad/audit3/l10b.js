const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const action of ['stomp', 'jump', 'sprint', 'punch', 'throw']) {
    const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
    await page.addInitScript((a) => { try { const s = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(s, { logKg: 12, action: a }))); } catch (e) {} }, action);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const info = await page.evaluate(() => [...document.querySelectorAll('#bay .viz svg')].map(s => { const vb = s.viewBox.baseVal.width; const r = s.getBoundingClientRect().width; const t = s.querySelector('text'); return vb + '->' + Math.round(r) + ' ' + (t ? (parseFloat(getComputedStyle(t).fontSize) * r / vb).toFixed(2) : '-') + 'px ' + (s.getAttribute('aria-label') || '').slice(0, 30); }));
    const st = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
    console.log(action, st.slice(0, 80), '\n  ' + info.join('\n  '));
    if (action === 'stomp') await page.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/stomp320.png', fullPage: true });
    await page.close();
  }
  await browser.close();
})();
