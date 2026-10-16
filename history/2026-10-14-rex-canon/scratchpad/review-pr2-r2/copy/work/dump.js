// usage: node dump.js <page.html> <cases.json> <out.json> [width] [scheme]
// each case: { id, state, effort?: 'allout'|..., duo?: bool, tab?: string, actions?: string (JS to eval after load) }
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [page_, casesF, outF, W, scheme] = process.argv.slice(2);
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: Number(W || 1280), height: W && Number(W) < 500 ? 844 : 900 }, colorScheme: scheme || 'light' });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(path.resolve(page_)).href);
  const settle = async (id) => { for (let i = 0; i < 160; i++) { const busy = await page.evaluate((id) => { const n = document.getElementById(id); return !!n && /working it out|Working out/i.test(n.textContent); }, id); if (!busy) return; await page.waitForTimeout(250); } };
  const cases = JSON.parse(fs.readFileSync(casesF, 'utf8'));
  const out = {};
  for (const c of cases) {
    const duo = c.duo || (c.state.duoAction && c.state.duoOpen);
    const bay = duo ? 'duo-bay' : 'bay';
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, c.state);
    await page.reload(); await page.waitForTimeout(900); await settle(bay);
    if (c.actions) { await page.evaluate(c.actions); await page.waitForTimeout(900); await settle(bay); }
    if (c.effort) { const sel = duo ? '#duo-effort' : '#effort'; if (await page.$(sel)) { await page.selectOption(sel, c.effort); await page.waitForTimeout(400); await settle(bay); } }
    const r = await page.evaluate((id) => {
      const b = document.getElementById(id);
      const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
      const all = (sel) => Array.from(b.querySelectorAll(sel)).map(txt);
      return { verdict: txt(b.querySelector('.verdict')), status: all('.status-row .status'), tiles: all('.tile'), effort: all('.effort-read p, .effort-read li'), happens: all('.happens > li'), math: all('details.math .eq'), whole: txt(b) };
    }, bay);
    r.overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    r.elOver = await page.evaluate((id) => { const vw = document.documentElement.clientWidth; const o = []; document.querySelectorAll('#' + id + ' *').forEach((n) => { const cs = getComputedStyle(n); if (cs.display === 'none' || !n.getClientRects().length) return; const b = n.getBoundingClientRect(); if (b.right > vw + 0.5 || b.left < -0.5) o.push((n.className || n.tagName) + ':' + Math.round(b.left) + '-' + Math.round(b.right)); else if ((n.classList.contains('tile') || n.classList.contains('status') || n.classList.contains('v') || n.classList.contains('s') || n.classList.contains('k')) && n.scrollWidth > n.clientWidth + 1 && cs.overflowX !== 'auto') o.push('clip ' + n.className + ':' + n.scrollWidth + '>' + n.clientWidth + ' ' + n.textContent.slice(0, 40)); }); return o.slice(0, 10); }, bay);
    if (process.env.SHOT) await (await page.$('#' + bay)).screenshot({ path: process.env.SHOT + '/' + c.id.replace(/[|]/g, '_') + '.png' });
    out[c.id] = r;
    process.stderr.write(c.id + ' ');
  }
  out.__errs = errs;
  fs.writeFileSync(outF, JSON.stringify(out, null, 1));
  await browser.close();
})();
