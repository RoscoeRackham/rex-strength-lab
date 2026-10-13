const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const prev = path.join(process.argv[3], 'preview.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const W = Number(process.argv[4] || 390);
  const page = await browser.newPage({ viewport: { width: W, height: 844 }, colorScheme: process.argv[5] || 'light' });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const res = {};
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(400); await settle(page, 'bay'); };
  // growth what-ifs
  for (const g of ['krakatoa', 'chicxulub', 'sun']) {
    await load({ action: 'weight' });
    await page.click('#grow-what-' + g); await page.waitForTimeout(400); await settle(page, 'bay');
    res['grow-' + g] = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .growth-whatif p, #bay .growth-whatif tr')).map((n) => n.textContent.replace(/\s+/g, ' ')).join('\n'));
    res['grow-' + g + '-ovf'] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: path.join(process.argv[3], 'grow-' + g + '-' + W + '.png'), fullPage: false });
    const box = await page.$('#bay .growth-whatif'); if (box) await box.screenshot({ path: path.join(process.argv[3], 'growbox-' + g + '-' + W + '-' + (process.argv[5]||'light') + '.png') });
  }
  // weight tab at large masses
  for (const [H, m] of [[3.048, 3007], [3.048, 1e10], [3.048, 1e15], [3.048, 1e18], [3.048, 1e21], [3.048, 1e24], [3.048, 1e25], [3.048, 1e26], [3.048, 1e27], [3.048, 1e29], [3.048, 1e31], [500, 1e33], [500, 1e34], [0.1, 1.1e13], [10, 1e27]]) {
    await load({ action: 'weight', H, m });
    res['weight-' + H + '-' + m] = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('#bay .tile')).filter((x) => /Energy/.test((x.querySelector('.k') || {}).textContent)).map((x) => x.textContent.replace(/\s+/g, ' '));
      const all = document.getElementById('bay').textContent.replace(/\s+/g, ' ');
      const sents = all.split(/(?<=\.)\s/).filter((s) => /blow|Earth apart|energy that holds|× (the|a|an) |% of (the|a|an) |beyond the ladder|roughly/.test(s));
      return { tiles: t, sents, ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
  }
  // card and pitch
  res.card = await page.evaluate(() => Array.from(document.querySelectorAll('#assume > div')).map((d) => d.textContent).filter((t) => /Energy comparisons/.test(t)));
  res.pitch = await page.evaluate(() => Array.from(document.querySelectorAll('article.feat')).map((d) => d.textContent).filter((t) => /pitch/i.test(t)));
  res.errs = errs;
  fs.writeFileSync(path.join(process.argv[3], 'weight-' + W + '-' + (process.argv[5]||'light') + '.json'), JSON.stringify(res, null, 1));
  await browser.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
