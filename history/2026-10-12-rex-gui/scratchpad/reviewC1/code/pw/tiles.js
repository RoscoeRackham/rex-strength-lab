const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const page_file = process.argv[2];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(page_file).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(700); };
  const read = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => (t.querySelector('.k')||{}).textContent + ' = ' + (t.querySelector('.v')||{}).textContent + ' | ' + ((t.querySelector('.s')||t.querySelector('.sub')||{}).textContent||'')).filter(x=>/Energy|Compared/.test(x)));
  const effortState = () => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('rex-lab-v1')).effort; } catch (e) { return '?'; } });
  for (const effort of [null, 'allout']) for (const action of ['punch', 'clap', 'stomp']) for (const logKg of [1, 6, 12, 18, 24, 30, 34]) {
    const st = { action, logKg, mode: 'comic' };
    await load(st);
    if (effort) {
      // try clicking the all-out effort chip
      const ok = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button, [role=radio], .chip')).find((x) => /all.?out/i.test(x.textContent)); if (b) { b.click(); return b.textContent; } return null; });
      await page.waitForTimeout(500);
      if (!ok) { console.log('no all-out chip'); }
    }
    console.log((effort||'default').padEnd(8), action.padEnd(6), String(logKg).padEnd(3), 'effort=', await effortState(), JSON.stringify(await read()));
  }
  console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
