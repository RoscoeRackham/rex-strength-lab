const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const page_file = process.argv[2], width = Number(process.argv[3] || 1280);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(page_file).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(900); };
  const read = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => (t.querySelector('.k')||{}).textContent + ' = ' + (t.querySelector('.v')||{}).textContent + ' | ' + (Array.from(t.children).slice(2).map(c=>c.textContent).join(' '))).filter(x=>/Energy/.test(x)));
  const scroll = () => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  for (const m of [3007, 1e5, 1e8, 1e12, 1e16, 1e20, 1e22, 1e24, 1e26, 1e28, 1e30, 1e31, 1e32, 1e40, 1e50, 1e100, 1e200, 1e300]) {
    await load({ action: 'weight', m, mode: 'comic' });
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).m);
    console.log(String(m).padEnd(8), 'saved m', st, JSON.stringify(await read()), (await scroll()) ? 'HSCROLL' : '');
  }
  // growth what-if chips
  await load({ action: 'weight', mode: 'comic', growWhat: 'krakatoa' });
  console.log('growWhat after load:', await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).growWhat));
  for (const id of ['krakatoa', 'chicxulub', 'sun']) {
    const clicked = await page.evaluate((id) => { const b = document.querySelector('[data-v="' + id + '"], #grow-what [value="' + id + '"]') || Array.from(document.querySelectorAll('.growth-whatif button')).find((x) => x.textContent === { krakatoa: 'Krakatoa', chicxulub: 'Dinosaur-killer impact', sun: 'The Sun for 1 second' }[id]); if (!b) return null; b.click(); return b.textContent; }, id);
    await page.waitForTimeout(700);
    const txt = await page.evaluate(() => { const b = document.querySelector('.growth-whatif'); return b ? Array.from(b.querySelectorAll('p')).map(p => p.textContent).join(' // ') : 'no box'; });
    console.log('CHIP', id, clicked, '\n   ', txt.slice(0, 900), (await scroll()) ? 'HSCROLL' : '');
  }
  console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
