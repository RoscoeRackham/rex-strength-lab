const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('file:///home/user/rex-strength-lab/rex-strength-lab/dist/preview.html');
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); Object.assign(s, { action: 'weight', surface: 'concrete', anchor: 'friction', groundHolds: false }); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); });
  await page.reload(); await page.waitForTimeout(1500);
  for (const mode of ['gradual', 'instant', 'runaway']) for (const what of ['chicxulub', 'sun']) for (const form of ['Mix (default)', 'Pure size', 'Pure density']) {
    await page.evaluate((m) => { const s = document.querySelector('#absorb'); s.value = m; s.dispatchEvent(new Event('change', { bubbles: true })); }, mode); await page.waitForTimeout(300);
    await page.evaluate((f) => [...document.querySelectorAll('#grow-chips button')].find((b) => b.textContent === f).click(), form); await page.waitForTimeout(300);
    const chip = await page.$('[data-key="grow-what"] button:has-text("' + (what === 'chicxulub' ? 'Dinosaur' : 'The Sun') + '")') || await page.$('button:has-text("' + (what === 'chicxulub' ? 'Dinosaur-killer impact' : 'The Sun for 1 second') + '")');
    await chip.click(); await page.waitForTimeout(800);
    const txt = await page.evaluate(() => { const b = document.querySelector('.growth-whatif'); return b ? b.innerText : 'none'; });
    console.log('==== ', mode, what, form); console.log(txt.split('\n').filter((l) => /^(It becomes|Shortest|Over|All at once|The air|Momentum|Runaway|A real|At that|Open)/.test(l)).join('\n'));
  }
  console.log('errors', errs);
  await browser.close();
})();
