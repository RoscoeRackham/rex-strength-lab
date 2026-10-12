// Usage: node bays.js '<json state overrides>' tab1,tab2 ...   prints bay text per tab
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), { pathToFileURL } = require('url');
(async () => {
  const over = JSON.parse(process.argv[2] || '{}');
  const tabs = (process.argv[3] || 'throw').split(',');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  const prev = pathToFileURL(path.join('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html')).href;
  await page.goto(prev);
  await page.evaluate((o) => { const s = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(s, o))); }, over);
  await page.goto(prev);
  if (over.effort) await page.evaluate((e) => { const s = document.querySelector('#effort'); }, over.effort);
  await page.waitForTimeout(800);
  for (const t of tabs) {
    if (['arm', 'wrestle', 'catch', 'collide'].includes(t)) await page.click('#grp-duo'); else if (await page.$('#grp-solo')) await page.click('#grp-solo');
    await page.click('#tab-' + t);
    await page.waitForTimeout(800);
    for (const sel of (process.argv[4] || '').split(',').filter(Boolean)) {
      if (sel.startsWith('select:')) { const [, id, v] = sel.split(':'); await page.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('change')); }, [id, v]); }
      else if (sel.startsWith('check:')) { const id = sel.slice(6); await page.evaluate((id) => { const e = document.getElementById(id); e.checked = !e.checked; e.dispatchEvent(new Event('change')); }, id); }
      else await page.click(sel);
      await page.waitForTimeout(600);
    }
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => document.querySelector('#bay').innerText);
    console.log('===== ' + t + '\n' + txt);
    if (/NaN|undefined|Infinity/.test(txt)) console.log('!!! BAD TOKEN in ' + t);
  }
  console.log('errors', JSON.stringify(errs));
  await browser.close();
})();
