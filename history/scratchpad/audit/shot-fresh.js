const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/out/fresh-';
const cases = JSON.parse(fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : process.argv[2]);
const noshot = process.argv.includes('--noshot');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st, scheme, js] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 }, colorScheme: scheme || 'light' });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/index-fresh.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(600);
    if (js) { await page.evaluate(js); await page.waitForTimeout(500); }
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const info = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = [];
      document.querySelectorAll('main.panel *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && r.right > vw + 0.5) over.push((el.tagName + '.' + el.className).slice(0, 60) + ' right=' + Math.round(r.right) + ' txt=' + (el.innerText || '').slice(0, 60).replace(/\n/g, ' '));
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'visible' && el.clientWidth > 0) over.push('SCROLL ' + (el.tagName + '.' + el.className).slice(0, 60) + ' sw=' + el.scrollWidth + ' cw=' + el.clientWidth);
      });
      return { docW: document.documentElement.scrollWidth, vw, over: over.slice(0, 12) };
    });
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    console.log('==== ' + name + ' errors ' + JSON.stringify(errs) + ' docW=' + info.docW + ' vw=' + info.vw + (info.over.length ? '\nOVERFLOW: ' + info.over.join('\n  ') : '') + '\n' + t);
    if (!noshot) await (await page.$('main.panel')).screenshot({ path: S + name + '.png' });
    await page.close();
  }
  await browser.close();
})();
