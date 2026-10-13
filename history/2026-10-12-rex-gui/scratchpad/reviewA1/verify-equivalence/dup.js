const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('file://' + S + '/branch.html');
  await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', duoAction: 'wrestle', wrestleMove: 'throw', duoOpen: true })); });
  await page.reload();
  await page.waitForFunction(() => { const d = document.querySelector('#duo-bay'); return d && d.querySelector('.verdict'); }, null, { timeout: 60000 });
  const r = await page.evaluate(() => {
    const out = {};
    const all = Array.from(document.querySelectorAll('[id]')).map((e) => e.id);
    const cnt = {}; for (const i of all) cnt[i] = (cnt[i] || 0) + 1;
    out.dups = Object.entries(cnt).filter(([, n]) => n > 1);
    out.detail = {};
    for (const id of ['near', 'angle']) out.detail[id] = Array.from(document.querySelectorAll('[id="' + id + '"]')).map((e) => ({ bay: e.closest('#bay') ? 'bay' : e.closest('#duo-bay') ? 'duo-bay' : '?', labels: e.labels ? e.labels.length : null, labelTexts: e.labels ? Array.from(e.labels).map((l) => l.textContent) : null }));
    out.duoOpen = document.querySelector('#duo').open;
    out.soloTab = document.querySelector('#tabs [aria-selected=true]').id; out.duoTab = document.querySelector('#duo-tabs [aria-selected=true]').id;
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  // accessibility tree for duo bay sliders/spinbuttons
  const snap = await page.locator('#duo-bay').ariaSnapshot();
  console.log('DUO aria (filtered):'); console.log(snap.split('\n').filter((l) => /slider|spinbutton/.test(l)).join('\n'));
  const snap2 = await page.locator('#bay').ariaSnapshot();
  console.log('SOLO aria (filtered):'); console.log(snap2.split('\n').filter((l) => /slider|spinbutton/.test(l)).join('\n'));
  console.log('errors', errs);
  await b.close();
})();
