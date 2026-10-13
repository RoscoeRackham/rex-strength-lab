// Equivalence harness: load main's build and the branch's build with the same saved state, visit tabs, and
// record the result text of each bay. Usage: node harness.js cases.json shardIndex shardCount out.jsonl
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const [casesFile, shardStr, nShardStr, outFile] = process.argv.slice(2);
const shard = Number(shardStr || 0), nShard = Number(nShardStr || 1);
const cases = JSON.parse(fs.readFileSync(casesFile, 'utf8')).filter((c, i) => i % nShard === shard);
const wrap = (f) => '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(f, 'utf8') + '</body></html>';
for (const v of ['main', 'branch']) {
  const p = path.join(S, v + '.html');
  if (!fs.existsSync(p)) fs.writeFileSync(p, wrap(path.join(S, v, 'rex-strength-lab/dist/index.html')));
}
const URL = { main: 'file://' + path.join(S, 'main.html'), branch: 'file://' + path.join(S, 'branch.html') };

const GRAB = (sel) => {
  const bay = document.querySelector(sel);
  if (!bay) return null;
  const norm = (t) => t.replace(/\s+/g, ' ').trim();
  const q = (s) => Array.from(bay.querySelectorAll(s)).map((e) => norm(e.textContent));
  // everything else in the bay that is text a reader sees, minus controls and charts
  const clone = bay.cloneNode(true);
  for (const x of clone.querySelectorAll('svg, select, .bay-controls, .effort-adjust, script, style')) x.remove();
  return { verdict: q('.verdict'), status: q('.status-row'), tiles: q('.tiles'), effort: q('.effort-read'), happens: q('.happens'), callout: q('.callout'), math: q('.math .eq'), cases: q('table.cases'), all: norm(clone.textContent) };
};

async function waitStable(page, sel, timeout = 90000) {
  const t0 = Date.now();
  let last = null, same = 0;
  while (Date.now() - t0 < timeout) {
    const txt = await page.evaluate((s) => { const b = document.querySelector(s); return b ? b.textContent : null; }, sel);
    const ok = txt && txt.length > 0 && !/working it out|working out/i.test(txt);
    if (ok && txt === last) { same++; if (same >= 3) return true; } else same = 0;
    last = txt;
    await page.waitForTimeout(150);
  }
  return false;
}

// interactions after load (the settings that reset on every load)
async function act(page, a) {
  return page.evaluate((a) => {
    const e = document.querySelector(a.sel);
    if (!e) return 'missing ' + a.sel;
    if (a.click) { e.click(); return 'ok'; }
    if (a.check != null) { e.checked = a.check; e.dispatchEvent(new Event('change', { bubbles: true })); return 'ok'; }
    if (a.value != null) {
      let v = a.value;
      if (a.frac != null) { const lo = Number(e.min), hi = Number(e.max); v = String(lo + a.frac * (hi - lo)); }
      e.value = v; e.dispatchEvent(new Event(a.event || 'change', { bubbles: true })); return 'ok';
    }
    return 'noop';
  }, a);
}

async function runPage(browser, variant, c) {
  const ctxB = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const saved = Object.assign({}, c.state);
  if (variant === 'main') { saved.group = c.mainGroup || 'solo'; delete saved.duoOpen; }
  else { if (!c.branchNoOpen) saved.duoOpen = true; if (c.branchGroup) saved.group = c.branchGroup; }
  await ctxB.addInitScript((s) => { try { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('seeded', '1'); } } catch (e) {} }, JSON.stringify(saved));
  const page = await ctxB.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(URL[variant]);
  const out = { solo: {}, duo: {}, errors, notes: [] };
  for (const a of c.pre || []) { const r = await act(page, a); if (r !== 'ok') out.notes.push(r); }
  await page.waitForTimeout(50);
  // solo tabs
  if (variant === 'main' && (c.mainGroup || 'solo') === 'duo' && (c.solo || []).length) { await page.click('#grp-solo'); }
  for (const t of c.solo || []) {
    await page.evaluate((t) => document.querySelector('#tab-' + t).click(), t);
    await page.waitForTimeout(30);
    for (const a of (c.soloTab || {})[t] || []) { const ok0 = await waitStable(page, '#bay'); const r = await act(page, a); if (r !== 'ok') out.notes.push(t + ': ' + r); await page.waitForTimeout(30); }
    const ok = await waitStable(page, '#bay');
    out.solo[t] = ok ? await page.evaluate(GRAB, '#bay') : { timeout: true };
  }
  // two-player tabs
  if ((c.duo || []).length) {
    if (variant === 'main' && (c.mainGroup || 'solo') !== 'duo') await page.click('#grp-duo');
    const sel = variant === 'main' ? '#bay' : '#duo-bay';
    let first = true;
    for (const t of c.duo) {
      await page.evaluate((t) => document.querySelector('#tab-' + t).click(), t);
      await page.waitForTimeout(30);
      if (first) { for (const a of c.duoPre || []) { await waitStable(page, sel); const r = await act(page, a); if (r !== 'ok') out.notes.push('duo: ' + r); await page.waitForTimeout(30); } first = false; }
      const ok = await waitStable(page, sel);
      out.duo[t] = ok ? await page.evaluate(GRAB, sel) : { timeout: true };
    }
  }
  out.finalState = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('rex-lab-v1')); } catch (e) { return null; } });
  await ctxB.close();
  return out;
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const fd = fs.openSync(outFile, 'a');
  for (const c of cases) {
    const t0 = Date.now();
    const variants = c.variants || ['main', 'branch'];
    const rec = { id: c.id };
    for (const v of variants) {
      try { rec[v] = await runPage(browser, v, c); } catch (e) { rec[v] = { crash: String(e && e.stack || e) }; }
    }
    rec.ms = Date.now() - t0;
    fs.writeSync(fd, JSON.stringify(rec) + '\n');
    process.stdout.write(c.id + ' ' + rec.ms + 'ms\n');
  }
  fs.closeSync(fd);
  await browser.close();
})();
