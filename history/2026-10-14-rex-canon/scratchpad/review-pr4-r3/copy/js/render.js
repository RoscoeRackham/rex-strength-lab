// usage: node render.js cases.json [out.json]
// cases: [{id, state, pick, w, h, scheme, ollieKg}]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/copy/repo/rex-strength-lab';
const SCR = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/copy';
const distFile = process.env.DIST || path.join(REPO, 'dist', 'index.html');
const html = fs.readFileSync(distFile, 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>';
const page_ = path.join(SCR, 'page-' + (process.env.TAG || 'cur') + '.html');
fs.writeFileSync(page_, wrapped);
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const settle = async (page, id) => { for (let i = 0; i < 160; i++) { const busy = await page.evaluate((x) => { const b = document.getElementById(x); return b && /working it out|Working out/i.test(b.textContent); }, id); if (!busy) return; await page.waitForTimeout(250); } };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const res = {};
  const pages = {};
  for (const c of cases) {
    const w = c.w || 1280, h = c.h || (w < 500 ? 844 : 900), scheme = c.scheme || 'light';
    const key = w + 'x' + h + scheme;
    if (!pages[key]) { const p = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme }); p.__errs = []; p.on('pageerror', (e) => p.__errs.push('PAGEERROR ' + e.message)); p.on('console', (m) => { if (m.type() === 'error') p.__errs.push(m.text()); }); await p.goto(pathToFileURL(page_).href); pages[key] = p; }
    const page = pages[key];
    const e0 = page.__errs.length;
    await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(x)); }, Object.assign({ saveV: 3 }, c.state));
    await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    if (c.ollieKg != null) { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, c.ollieKg); await page.waitForTimeout(800); await settle(page, 'duo-bay'); }
    if (c.pick) { await page.selectOption('#duo-effort', c.pick); await page.waitForTimeout(400); await settle(page, 'duo-bay'); }
    if (c.click) { for (const sel of c.click) { await page.click(sel); await page.waitForTimeout(500); await settle(page, 'duo-bay'); } }
    const r = await page.evaluate(() => {
      const bay = document.getElementById('duo-bay');
      const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
      const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
      const chips = Array.from(bay.querySelectorAll('.status-row')).map((row) => Array.from(row.children).map(txt));
      const tiles = Array.from(bay.querySelectorAll('.tile')).map((t) => Array.from(t.children).map(txt).join(' | '));
      const svgs = Array.from(bay.querySelectorAll('svg[aria-label]')).map((s) => s.getAttribute('aria-label'));
      const happens = Array.from(bay.querySelectorAll('.happens li')).map(txt);
      const muted = Array.from(bay.querySelectorAll('p.muted')).map(txt);
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      // elements wider than the bay
      const bw = bay.getBoundingClientRect();
      const wide = Array.from(bay.querySelectorAll('*')).filter((n) => { const r = n.getBoundingClientRect(); return r.width > 0 && (r.right > bw.right + 1 || r.left < bw.left - 1); }).slice(0, 5).map((n) => n.tagName + '.' + n.className + ' ' + (n.textContent || '').slice(0, 60));
      return { verdict: all('.verdict'), chips, tiles, effort: all('.effort-read'), happens, callouts: all('.callout'), math: all('details.math .eq'), svgs, muted, overflow, wide, full: txt(bay) };
    });
    r.errs = page.__errs.slice(e0);
    res[c.id] = r;
    if (c.shot) await (await page.$('#duo')).screenshot({ path: path.join(SCR, 'shots', c.id + '.png') });
    process.stderr.write('.');
  }
  await browser.close();
  const out = process.argv[3] || path.join(SCR, 'out.json');
  fs.writeFileSync(out, JSON.stringify(res, null, 1));
  process.stderr.write('\nwrote ' + out + '\n');
})();
