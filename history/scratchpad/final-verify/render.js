// usage: node render.js '[["name",width,{state},"light|dark"],...]'  -> writes out/<name>.txt and out/<name>.png
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/final-verify/out/';
const fs = require('fs');
const cases = JSON.parse(fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st, scheme] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 }, colorScheme: scheme || 'light' });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => { localStorage.clear(); if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload(); await page.waitForTimeout(800);
    await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
    await page.waitForTimeout(100);
    const info = await page.evaluate(() => ({
      bay: document.querySelector('#bay') ? document.querySelector('#bay').innerText : '',
      all: document.body.innerText,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      wide: [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > document.documentElement.clientWidth + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 5).map((e) => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right)),
      bg: getComputedStyle(document.body).backgroundColor,
    }));
    fs.writeFileSync(S + name + '.txt', 'errors ' + JSON.stringify(errs) + '\noverflow ' + info.overflow + ' ' + JSON.stringify(info.wide) + '\nbg ' + info.bg + '\n==== BAY\n' + info.bay + '\n==== ALL\n' + info.all);
    console.log(name, 'errors', errs.length, 'overflow', info.overflow, info.wide.length ? JSON.stringify(info.wide) : '', 'bg', info.bg);
    await page.screenshot({ path: S + name + '.png', fullPage: true });
    await page.close();
  }
  await browser.close();
})();
