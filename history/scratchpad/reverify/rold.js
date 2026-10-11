// usage: node r.js '[["name",1280,{state},"dark"?]]' [whatif]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/reverify/';
const fs = require('fs');
const cases = JSON.parse(process.argv[2]);
const whatif = process.argv[3] === 'whatif';
const url = whatif ? 'file://' + S + 'preview-whatif.html' : 'file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/reverify/old/dist/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st, scheme] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 }, colorScheme: scheme || 'light' });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(url);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(900);
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    fs.writeFileSync(S + 'out/old_' + name + '.txt', t);
    console.log('==== ' + name + ' errors ' + JSON.stringify(errs) + '\n' + t.slice(0, +(process.env.MAXT || 3000)));
    if (process.env.SHOT) await (await page.$('main.panel')).screenshot({ path: S + 'out/old_' + name + '.png' });
    await page.close();
  }
  await browser.close();
})();
