const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/reverify/';
const cases = JSON.parse(process.argv[2]);
const PAGE = process.env.WHATIF ? 'file://' + S + 'whatif.html' : 'file:///home/user/dino-strength-sim/dist/preview.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st, scheme] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 }, colorScheme: scheme || 'light' });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(PAGE);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    const t0 = Date.now();
    await page.reload(); await page.waitForTimeout(+(process.env.WAIT || 700));
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    const lines = t.split('\n').filter((l) => l.trim() && !/ · [\d.,]+ (k?g|t)$/.test(l) && !/^(Plush|Water|Steel|Osmium|White dwarf|Neutron star|Black hole|DENSITY|BALL)$/.test(l));
    console.log('==== ' + name + ' errors ' + JSON.stringify(errs) + '\n' + lines.join('\n').slice(0, +(process.env.MAXT || 5000)));
    if (process.env.PNG) await (await page.$('main.panel')).screenshot({ path: S + name + '.png' });
    await page.close();
  }
  await browser.close();
})();
