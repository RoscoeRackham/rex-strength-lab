const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, st] of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(700);
    const t = await page.evaluate(() => [...document.querySelectorAll('#bay ul.happens li')].map(l=>l.innerText));
    const v = await page.evaluate(() => (document.querySelector('#bay') || {}).innerText.split('\n').slice(0,40).join(' | '));
    console.log('==== ' + name + ' n=' + t.length); t.forEach((x,i)=>console.log(i+': '+x.slice(0,200)));
    if (process.env.V) console.log(v);
    await page.close();
  }
  await browser.close();
})();
