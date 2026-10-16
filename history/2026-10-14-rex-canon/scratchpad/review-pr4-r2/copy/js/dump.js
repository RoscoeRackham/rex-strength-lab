// usage: node dump.js cases.json outdir
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = process.env.REPO || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/copy/repo/rex-strength-lab';
const SCR = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/copy';
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const outdir = process.argv[3]; fs.mkdirSync(outdir, { recursive: true });
(async () => {
  const html = fs.readFileSync(path.join(REPO, 'dist', 'index.html'), 'utf8');
  const prev = path.join(SCR, process.env.PREV ? process.env.PREV : process.env.REPO ? 'preview-base.html' : 'preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pages = {};
  const getPage = async (w, h, scheme) => { const k = w + scheme; if (pages[k]) return pages[k];
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme }); page.errs = [];
    page.on('pageerror', (e) => page.errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') page.errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href); pages[k] = page; return page; };
  const settle = async (page) => { const t0 = Date.now(); for (let i = 0; i < 480; i++) { const b = await page.evaluate(() => { const m = (document.getElementById('duo-bay').textContent + ' ' + document.getElementById('bay').textContent).match(/.{0,60}(working it out|Working out).{0,60}/i); return m && m[0]; }); if (!b) { if (Date.now() - t0 > 5000) console.log('  settled in ' + Math.round((Date.now() - t0) / 1000) + ' s'); return; } if (i % 40 === 39) console.log('  busy: ' + b); await page.waitForTimeout(250); } console.log('  GAVE UP'); };
  for (const c of cases) {
    const w = c.w || 1280, h = c.h || 900, scheme = c.scheme || 'light';
    const page = await getPage(w, h, scheme); const e0 = page.errs.length;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, c.state));
    await page.reload(); await page.waitForTimeout(900); await settle(page);
    if (c.pick) { await page.selectOption('#duo-effort', c.pick); await page.waitForTimeout(400); await settle(page); }
    if (c.eval) { await page.evaluate(c.eval); await page.waitForTimeout(800); await settle(page); }
    const r = await page.evaluate(() => {
      document.querySelectorAll('#duo-bay details').forEach((d) => { d.open = true; });
      const bay = document.getElementById('duo-bay');
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      // clipped: svg text outside its svg, or elements wider than their box
      const clipped = [];
      for (const s of bay.querySelectorAll('svg')) { const sb = s.getBoundingClientRect(); for (const t of s.querySelectorAll('text')) { const tb = t.getBoundingClientRect(); if (tb.width && (tb.left < sb.left - 1 || tb.right > sb.right + 1)) clipped.push('svg text: ' + t.textContent + ' [' + Math.round(tb.left - sb.left) + '..' + Math.round(tb.right - sb.left) + ' of ' + Math.round(sb.width) + ']'); } }
      for (const n of bay.querySelectorAll('*')) { const cs = getComputedStyle(n); if (n.scrollWidth > n.clientWidth + 1 && n.clientWidth > 0 && (cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis')) clipped.push('box: ' + (n.className || n.tagName) + ' ' + n.textContent.slice(0, 60)); }
      return { text: bay.innerText, overflow, clipped };
    });
    r.errs = page.errs.slice(e0);
    const f = path.join(outdir, c.id + (c.w ? '-' + w : '') + (c.scheme ? '-' + scheme : '') + '.txt');
    fs.writeFileSync(f, '# ' + JSON.stringify(c) + '\n# overflow ' + r.overflow + ' clipped ' + JSON.stringify(r.clipped) + ' errs ' + JSON.stringify(r.errs) + '\n' + r.text);
    console.log(c.id, w, scheme, 'overflow', r.overflow, 'clipped', r.clipped.length, 'errs', r.errs.length);
    if (c.shot) await (await page.$('#duo')).screenshot({ path: f.replace(/\.txt$/, '.png') });
  }
  await browser.close();
})();
