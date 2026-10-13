const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => { if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', duoAction: 'wrestle', wrestleMove: 'throw', duoOpen: true })); sessionStorage.setItem('s', '1'); } });
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(__dirname, '..', 'branch.html'));
  await page.waitForFunction(() => { const x = document.querySelector('#duo-bay'); return x && x.querySelector('.verdict') && !/working it out|working out/i.test(x.textContent); }, null, { timeout: 60000 });
  const r = await page.evaluate(() => ['near', 'angle'].map((id) => Array.from(document.querySelectorAll('[id="' + id + '"]')).map((e) => ({ id, bay: e.closest('.bay').id, labels: e.labels.length, labelText: Array.from(e.labels).map((l) => l.textContent).join('|') }))));
  console.log(JSON.stringify(r, null, 1));
  const snap = await page.accessibility.snapshot({ root: await page.$('#duo-bay') }).catch((e) => 'snapshot failed ' + e.message);
  const find = (n, out) => { if (!n || typeof n !== 'object') return out; if (n.role === 'spinbutton' || n.role === 'slider') out.push(n.role + ' name="' + (n.name || '') + '"'); (n.children || []).forEach((c) => find(c, out)); return out; };
  console.log('duo bay inputs in the accessibility tree:', JSON.stringify(find(snap, [])));
  await browser.close();
})();
