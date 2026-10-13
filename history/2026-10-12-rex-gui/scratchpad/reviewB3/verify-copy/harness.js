// usage: node harness.js cases.json [htmlpath]  -> prints JSON results
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const src = process.argv[3] || path.join(S, 'copy/dist/index.html');
(async () => {
  const body = fs.readFileSync(src, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const tmp = path.join(S, 'page-' + path.basename(src, '.html') + '.html');
  fs.writeFileSync(tmp, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  if (cases.init) await page.addInitScript(cases.init);
  await page.goto(pathToFileURL(tmp).href);
  const out = {};
  const DUO = ['arm', 'wrestle', 'catch', 'collide'];
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } console.error('still busy'); };
  for (const c of cases.list) {
    const duo = DUO.includes(c.tab);
    const st = Object.assign({}, c.state, duo ? { duoAction: c.tab, duoOpen: true } : { action: c.tab });
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(1000);
    const bay = duo ? 'duo-bay' : 'bay';
    await settle(bay);
    if (c.pick) { await page.selectOption(duo ? '#duo-effort' : '#effort', c.pick); await page.waitForTimeout(600); await settle(bay); }
    if (c.eval) { await page.evaluate(c.eval); await page.waitForTimeout(600); await settle(bay); }
    out[c.id] = await page.evaluate((id) => {
      const bay = document.getElementById(id);
      const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
      const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
      return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq') };
    }, bay);
    if (c.extra) out[c.id].extra = await page.evaluate(c.extra);
  }
  out.errs = errs;
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
