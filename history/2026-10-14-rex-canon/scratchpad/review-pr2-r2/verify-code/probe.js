// usage: node probe.js <page.html> <cases.json>   cases: [{label, state, pick?, sel?:[...]}]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, pageFile, casesFile] = process.argv;
const cases = JSON.parse(fs.readFileSync(casesFile, 'utf8'));
(async () => {
  const body = fs.readFileSync(pageFile, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(path.dirname(pageFile), path.basename(pageFile, '.html') + '.wrapped.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 160; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } console.log('STILL WORKING'); };
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.state);
    await page.reload(); await page.waitForTimeout(900);
    const bay = c.state.duoOpen ? 'duo-bay' : 'bay';
    await settle(bay);
    if (c.pick) { await page.selectOption(bay === 'duo-bay' ? '#duo-effort' : '#effort', c.pick); await page.waitForTimeout(400); await settle(bay); }
    if (c.js) { await page.evaluate(c.js); await page.waitForTimeout(800); await settle(bay); }
    const sels = c.sel || ['.verdict', '.effort-read', '.happens', '.tiles'];
    const out = await page.evaluate(([id, sels]) => { const b = document.getElementById(id); const r = {}; for (const s of sels) r[s] = Array.from(b.querySelectorAll(s)).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join(' / '); return r; }, [bay, sels]);
    console.log('=== ' + c.label);
    for (const [k, v] of Object.entries(out)) {
      if (c.grep) { const re = new RegExp(c.grep, 'g'); const m = v.match(new RegExp('[^.]*(' + c.grep + ')[^.]*\\.?[^.]*\\.?', 'g')); console.log('  ' + k + ': ' + (m ? m.join(' ‖ ') : '(no match)')); }
      else console.log('  ' + k + ': ' + v);
    }
  }
  if (errs.length) console.log('PAGEERRORS', errs);
  await browser.close();
})();
