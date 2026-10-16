// node probe.js <dist/index.html> <cases.json> <out.json> [width]
// Each case: { id, state, pick?, tab? } -> loads the state (saveV 3), opens the two-player tab, waits for every search,
// optionally picks an effort, and records the duo bay's text segments, the time the search took and page errors.
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [, , PAGE, CASES, OUT, W] = process.argv;
(async () => {
  const body = fs.readFileSync(PAGE, 'utf8');
  const tmp = path.join(path.dirname(OUT), path.basename(OUT, '.json') + '-page.html');
  fs.writeFileSync(tmp, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const cases = JSON.parse(fs.readFileSync(CASES, 'utf8'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: Number(W || 1280), height: 900 } });
  let errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await page.goto(pathToFileURL(tmp).href);
  const busy = () => page.evaluate(() => { const b = document.getElementById('duo-bay'); return !b || /working it out|Working out/i.test(b.textContent); });
  const settle = async (lim) => { const t0 = Date.now(); await page.waitForTimeout(1500); while (await busy()) { if (Date.now() - t0 > lim) return -1; await page.waitForTimeout(100); } return Date.now() - t0; };
  const read = () => page.evaluate(() => {
    const bay = document.getElementById('duo-bay');
    const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
    const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq'), all: txt(bay),
      scroll: document.documentElement.scrollWidth > document.documentElement.clientWidth };
  });
  const out = {};
  for (const c of cases) {
    errs = [];
    const st = Object.assign({ saveV: 3, duoOpen: true }, c.state);
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload();
    const ms = await settle(180000);
    const r0 = await read();
    out[c.id] = Object.assign(r0, { ms, errs: errs.slice() });
    let line = c.id + ' ' + ms;
    for (const pk of (c.picks || (c.pick ? [c.pick] : []))) {
      errs = [];
      await page.selectOption('#duo-effort', pk); const m2 = await settle(180000);
      out[c.id + '@' + pk] = Object.assign(await read(), { ms: m2, errs: errs.slice() });
      line += ' ' + pk + ':' + m2 + (errs.length ? ' ERR ' + errs[0] : '');
    }
    process.stdout.write(line + (out[c.id].errs.length ? ' ERR ' + out[c.id].errs[0] : '') + '\n');
  }
  await browser.close();
  fs.unlinkSync(tmp);
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})();
