// node sweep.js <dist/index.html> <states.json> <out.json> [efforts comma list]
// Loads each state (a localStorage object), settles the Rex + Ollie bay, and for each effort reads the bay.
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [distP, statesP, outP, effArg] = process.argv.slice(2);
const EFF = (effArg || 'least,allout').split(',');
(async () => {
  const body = fs.readFileSync(distP, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const tmp = path.join(path.dirname(outP), 'pg-' + path.basename(outP, '.json') + '.html');
  fs.writeFileSync(tmp, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(tmp).href);
  const settle = async () => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate(() => { const b = document.getElementById('duo-bay'); return !b || /working it out|Working out/i.test(b.textContent); }); if (!busy) return true; await page.waitForTimeout(125); } return false; };
  const read = () => page.evaluate(() => {
    const bay = document.getElementById('duo-bay');
    const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
    const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt).join(' / ');
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq'), all: txt(bay) };
  });
  const states = JSON.parse(fs.readFileSync(statesP, 'utf8'));
  const out = {};
  for (const [id, st] of Object.entries(states)) {
    const t0 = Date.now();
    const e0 = errs.length;
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ duoOpen: true, saveV: 3 }, st.state));
    await page.reload();
    await page.waitForTimeout(300);
    if (st.ollieKg != null) {
      await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
      await page.click('#o-own'); await page.waitForTimeout(200);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, st.ollieKg);
      await page.waitForTimeout(500);
    }
    const ok0 = await settle();
    const tLoad = Date.now() - t0;
    out[id] = { tLoad, settled: ok0 };
    for (const e of (st.efforts || EFF)) {
      const t1 = Date.now();
      if (e.startsWith('custom:')) {
        await page.evaluate((v) => { const s = document.getElementById('duo-effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, Number(e.slice(7)));
        await page.waitForTimeout(600);
      } else {
        const has = await page.evaluate((v) => { const s = document.getElementById('duo-effort'); return !!s && Array.from(s.options).some((o) => o.value === v); }, e);
        if (!has) { out[id][e] = { missing: true }; continue; }
        await page.selectOption('#duo-effort', e); await page.waitForTimeout(150);
      }
      const ok = await settle();
      const r = await read();
      r.t = Date.now() - t1; r.settled = ok;
      out[id][e] = r;
    }
    out[id].errs = errs.slice(e0);
    process.stdout.write('.');
  }
  fs.writeFileSync(outP, JSON.stringify(out));
  await browser.close();
  console.log('\nwrote', outP, Object.keys(out).length);
})().catch((e) => { console.error(e); process.exit(1); });
