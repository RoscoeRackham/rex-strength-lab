// usage: node page.js cases.json  -> prints results as JSON lines
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
const SRC = process.env.PAGE || path.join(DIR, 'repo', 'dist', 'index.html');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
(async () => {
  const body = fs.readFileSync(SRC, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(DIR, 'prev-' + path.basename(process.argv[2]) + '.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: cases.width || 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } console.log('TIMEOUT'); };
  for (const c of cases.list || cases) {
    const duo = DUO.includes(c.tab);
    const st = Object.assign({}, c.state || {}, duo ? { duoOpen: true, duoAction: c.tab } : { action: c.tab });
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload(); await page.waitForTimeout(600);
    const bay = duo ? 'duo-bay' : 'bay';
    await settle(bay);
    for (const a of c.actions || []) {
      if (a.select) await page.selectOption(a.select, a.value);
      if (a.click) await page.click(a.click);
      if (a.eval) await page.evaluate(a.eval);
      if (a.fill) await page.fill(a.fill, a.value);
      await page.waitForTimeout(a.wait || 500); await settle(bay);
    }
    const r = await page.evaluate((id) => {
      const bay = document.getElementById(id);
      const sels = Array.from(bay.querySelectorAll('select, .chips, .seg, svg, .bay-controls')); sels.forEach((x) => { x.dataset.d = x.style.display; x.style.display = 'none'; }); const txt = (n) => (n ? n.innerText.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n').trim() : null);
      const T = txt(bay); sels.forEach((x) => { x.style.display = x.dataset.d; }); return { text: T, effortOpts: Array.from(document.querySelectorAll(id === 'bay' ? '#effort option' : '#duo-effort option')).map((o) => o.value + '=' + o.textContent), airRead: document.getElementById('air-absorb-read').textContent, slider: document.getElementById('air-absorb').value };
    }, bay);
    console.log('=== ' + (c.id || c.tab) + '\n' + r.text + '\n--- effort options: ' + r.effortOpts.join(' | ') + '\n--- slider ' + r.slider + ' ' + r.airRead);
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
