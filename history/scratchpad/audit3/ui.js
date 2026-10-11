// usage: node ui.js scenarios.json  -> prints bay text per scenario
// scenario: {name, state:{...}, tab, click?: [selectors], feat?: 'title substring', wait?: ms}
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const PREV = 'file://' + __dirname + '/preview.html';
const DEF = { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 };
(async () => {
  const sc = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  for (const s of sc) {
    await page.goto(PREV);
    await page.evaluate((st) => { localStorage.clear(); if (st) localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, s.state ? Object.assign({}, DEF, s.state) : null);
    await page.goto(PREV);
    await page.waitForTimeout(200);
    for (const c of s.click || []) { await page.click(c); await page.waitForTimeout(150); }
    if (s.feat) {
      await page.evaluate((t) => { for (const a of document.querySelectorAll('article.feat')) if (a.querySelector('.t').textContent.includes(t)) { a.querySelector('button.run').click(); return; } throw new Error('feat not found ' + t); }, s.feat);
      await page.waitForTimeout(300);
    }
    if (s.tab) { await page.click('#tab-' + s.tab); await page.waitForTimeout(150); }
    if (s.wait) await page.waitForTimeout(s.wait);
    const txt = await page.evaluate((full) => {
      const bay = document.querySelector('#bay');
      const parts = [];
      parts.push('DIAL: ' + document.querySelector('#dial-big').textContent + ' | ' + document.querySelector('#setup-sum').textContent + ' | ' + document.querySelector('#dial-who').textContent);
      const v = bay.querySelector('.verdict'); parts.push('VERDICT: ' + (v ? v.textContent : '-'));
      parts.push('CHIPS: ' + [...bay.querySelectorAll('.status-row .status')].map((x) => x.textContent).join(' / '));
      parts.push('TILES: ' + [...bay.querySelectorAll('.tile')].map((t) => [...t.children].map((c) => c.textContent).join(' ~ ')).join(' || '));
      for (const li of bay.querySelectorAll('.happens li')) parts.push('  * ' + li.textContent);
      for (const c of bay.querySelectorAll('.callout')) parts.push('CALLOUT: ' + c.textContent);
      if (full) { const m = bay.querySelector('.math .eq'); if (m) parts.push('MATH: ' + m.textContent.replace(/\n/g, ' /// ')); }
      const ll = document.querySelector('#ladder-never'); if (full && ll) parts.push('LADDER-NEVER: ' + ll.textContent);
      if (full) parts.push('SVG: ' + [...bay.querySelectorAll('svg')].map((s) => s.getAttribute('aria-label')).join(' ## '));
      return parts.join('\n');
    }, !!s.full);
    console.log('=== ' + (s.name || JSON.stringify(s.state)) + '\n' + txt);
    if (s.shot) await page.locator('main.panel').screenshot({ path: __dirname + '/' + s.shot });
  }
  if (errs.length) console.log('ERRORS:', errs.join('\n'));
  await browser.close();
})();
