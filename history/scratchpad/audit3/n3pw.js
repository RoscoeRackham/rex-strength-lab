const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage();
  await page.goto('file:///home/user/dino-strength-sim/dist/index.html');
  await page.waitForTimeout(1500);
  async function dump(label) {
    const out = await page.evaluate(() => {
      const verdict = document.querySelector('.verdict');
      const eq = document.querySelector('details.math .eq');
      const happens = [...document.querySelectorAll('ul.happens li')].map(x=>x.textContent);
      const tiles = [...document.querySelectorAll('.tile')].map(t=>t.textContent).slice(0,8);
      return { verdict: verdict && verdict.textContent, eq: eq && eq.textContent.split('\n')[0], happens, tiles };
    });
    console.log('==', label); console.log(JSON.stringify(out, null, 1));
  }
  // Feat: Hulk and Thor
  const btns = await page.$$('button.run');
  for (const btn of btns) {
    const t = await btn.evaluate((el) => el.closest('*:not(button)').parentElement.textContent);
    if (/Class 100/.test(t)) { await btn.click(); break; }
  }
  await page.waitForTimeout(500);
  await dump('Hulk/Thor feat');
  for (const btn of await page.$$('button.run')) {
    const t = await btn.evaluate((el) => el.closest('*:not(button)').parentElement.textContent);
    if (/Spider-Man lifts 10 tons/.test(t)) { await btn.click(); break; }
  }
  await page.waitForTimeout(500);
  await dump('Spider-Man feat');
  // logKg 4 car 45
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 4, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 })));
  await page.reload(); await page.waitForTimeout(1500);
  await dump('car logKg4');
  await b.close();
})();
