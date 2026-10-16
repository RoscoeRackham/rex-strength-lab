const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url'), path = require('path');
const { settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/code/repo/rex-strength-lab/test/make-page-fixture.js');
const U = (n) => pathToFileURL(path.join(__dirname, n + '.html')).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, scheme] of [[1280, 900, 'light'], [1280, 900, 'dark'], [390, 844, 'light'], [390, 844, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(U('pr3'));
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', obj: 'person' }))); await page.reload(); await page.waitForTimeout(1000); await settle(page, 'bay');
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => {
      const inp = document.getElementById('sw-passenger'), lab = inp.closest('label'), brow = lab.previousElementSibling;
      const r = lab.getBoundingClientRect(), b = brow.getBoundingClientRect(), pr = document.getElementById('powers').getBoundingClientRect();
      const cs = getComputedStyle(brow), ls = getComputedStyle(lab);
      // overflowing elements in #powers and the bay's tiles and chips
      const over = Array.from(document.querySelectorAll('#powers *, #bay .tile, #bay .status, #bay .status-row > *')).filter((n) => n.scrollWidth > n.clientWidth + 1 && getComputedStyle(n).overflowX !== 'visible').map((n) => (n.id || n.className) + ':' + n.scrollWidth + '>' + n.clientWidth);
      const outside = Array.from(document.querySelectorAll('#powers *')).filter((n) => { const q = n.getBoundingClientRect(); return q.width > 0 && (q.right > pr.right + 1 || q.left < pr.left - 1); }).map((n) => n.id || n.tagName + '.' + n.className);
      return { brow: brow.textContent, browCls: brow.className, browColor: cs.color, labColor: ls.color, label: { x: r.x, w: r.width, h: r.height }, powers: { x: pr.x, w: pr.width }, docOv: document.documentElement.scrollWidth - document.documentElement.clientWidth, over, outside: outside.slice(0, 5), ariaName: inp.labels && inp.labels[0] && inp.labels[0].textContent.slice(0, 40), checked: inp.checked, focusable: inp.tabIndex };
    });
    // accessible name via accessibility snapshot
    const acc = await page.accessibility.snapshot({ root: await page.$('#sw-passenger') }).catch((e) => ({ err: e.message }));
    console.log(w, scheme, JSON.stringify(info), 'acc:', JSON.stringify(acc).slice(0, 160));
    await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.style.position = 'static'; a.style.maxHeight = 'none'; a.style.overflow = 'visible'; });
    await (await page.$('#powers')).screenshot({ path: path.join(__dirname, 'shots', `powers-${w}-${scheme}.png`) });
    await (await page.$('#bay')).screenshot({ path: path.join(__dirname, 'shots', `bay-${w}-${scheme}.png`) });
    console.log('errors', errs);
    await page.close();
  }
  await browser.close();
})();
