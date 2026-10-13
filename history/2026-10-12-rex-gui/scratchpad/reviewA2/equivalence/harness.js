// Round 2 equivalence harness: load main's build and the branch's build with the same saved state, visit tabs, and
// record the result text of each bay. Usage: node harness.js cases.json shardIndex shardCount out.jsonl
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const [casesFile, shardStr, nShardStr, outFile] = process.argv.slice(2);
const shard = Number(shardStr || 0), nShard = Number(nShardStr || 1);
const only = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
const cases = JSON.parse(fs.readFileSync(casesFile, 'utf8')).filter((c, i) => i % nShard === shard).filter((c) => !only || only.test(c.id));
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
  const clone = bay.cloneNode(true);
  for (const x of clone.querySelectorAll('svg, select, .bay-controls, .effort-adjust, script, style')) x.remove();
  // what the controls say (labels, the chosen option, the spoken value of each slider, pressed chips), ids left out
  const ctl = [];
  for (const e of bay.querySelectorAll('label, select, input[type=range], button[aria-pressed="true"], input[type=checkbox]')) {
    if (e.tagName === 'LABEL') ctl.push('L:' + norm(e.textContent));
    else if (e.tagName === 'SELECT') ctl.push('S:' + (e.selectedOptions[0] ? norm(e.selectedOptions[0].textContent) : ''));
    else if (e.type === 'range') ctl.push('R:' + (e.getAttribute('aria-valuetext') || '') + '|' + e.min + '|' + e.max + '|' + e.value + (e.disabled ? '|dis' : ''));
    else if (e.type === 'checkbox') ctl.push('C:' + e.checked);
    else ctl.push('P:' + norm(e.textContent));
  }
  const svg = Array.from(bay.querySelectorAll('svg')).map((s) => Array.from(s.querySelectorAll('text, title')).map((t) => norm(t.textContent)).join(' | '));
  return { verdict: q('.verdict'), status: q('.status-row'), tiles: q('.tiles'), effort: q('.effort-read'), happens: q('.happens'), callout: q('.callout'), math: q('.math .eq'), cases: q('table.cases'), ctl, svg, all: norm(clone.textContent) };
};

async function waitStable(page, sel, timeout = 120000) {
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

// a control action (the settings that reset on every load, and the per-tab sub-controls)
async function act(page, a, variant) {
  return page.evaluate(([a, variant]) => {
    if (a.anchor) {
      // footing: main's menus, the branch's switches
      const who = a.anchor.who, val = a.anchor.val;
      if (variant === 'main') { const s = document.querySelector(who === 'rex' ? '#anchor' : '#o-anchor'); s.value = val; s.dispatchEvent(new Event('change', { bubbles: true })); }
      else { const c = document.querySelector(who === 'rex' ? '#bolt-rex' : '#bolt-ollie'); c.checked = val === 'bolted'; c.dispatchEvent(new Event('change', { bubbles: true })); }
      return 'ok';
    }
    if (a.featIdx != null) { const b = document.querySelectorAll('#feat-groups button.run')[a.featIdx]; if (!b) return 'missing feat ' + a.featIdx; b.click(); return 'ok'; }
    if (a.duoOpen != null) { if (variant === 'main') return 'ok'; const d = document.querySelector('#duo'); d.open = a.duoOpen; return 'ok'; }
    if (a.wait) return 'ok';
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
  }, [a, variant]);
}

const DIAL = () => ['#dial-big', '#dial-force', '#dial-who'].map((s) => { const e = document.querySelector(s); return e ? e.textContent : null; }).join(' | ');
async function grabLadder(page) {
  // the ladder's thresholds come from a background search
  const t0 = Date.now();
  let last = null, same = 0;
  while (Date.now() - t0 < 120000) {
    const t = await page.evaluate(() => { const l = document.querySelector('#ladder'); if (!l) return null; const c = l.cloneNode(true); return c.textContent.replace(/\s+/g, ' ').trim(); });
    if (t && !/Working out the thresholds/.test(t) && t === last) { same++; if (same >= 3) return t; } else same = 0;
    last = t;
    await page.waitForTimeout(200);
  }
  return { timeout: true };
}

async function runPage(browser, variant, c) {
  const ctxB = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const saved = Object.assign({}, c.state);
  const mainStartDuo = c.duoFirst ? (c.duo || []).length > 0 : (c.mainGroup || 'solo') === 'duo';
  if (variant === 'main') { saved.group = mainStartDuo ? 'duo' : 'solo'; delete saved.duoOpen; }
  else { if (!c.branchNoOpen) saved.duoOpen = true; if (c.branchGroup) saved.group = c.branchGroup; }
  await ctxB.addInitScript((s) => { try { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('seeded', '1'); } } catch (e) {} }, JSON.stringify(saved));
  const page = await ctxB.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(URL[variant]);
  const out = { solo: {}, duo: {}, errors, notes: [] };
  const pre = c.pre || [];
  for (const a of pre.filter((x) => !x.needTab)) { const r = await act(page, a, variant); if (r !== 'ok') out.notes.push(r); if (a.wait) await page.waitForTimeout(a.wait); }
  await page.waitForTimeout(50);
  let group = variant === 'main' ? (mainStartDuo ? 'duo' : 'solo') : null;
  const runSolo = async () => {
    if (!(c.solo || []).length) return;
    if (variant === 'main' && group !== 'solo') { await page.click('#grp-solo'); group = 'solo'; }
    const needTab = pre.filter((x) => x.needTab);
    if (needTab.length) {
      // the effort menu is in an effort tab: show one first
      const first = c.solo.find((t) => ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull'].includes(t)) || 'throw';
      await page.evaluate((t) => document.querySelector('#tab-' + t).click(), first);
      await waitStable(page, '#bay');
      for (const a of needTab) { const r = await act(page, a, variant); if (r !== 'ok') out.notes.push(r); await page.waitForTimeout(30); }
    }
    for (const t of c.solo) {
      await page.evaluate((t) => document.querySelector('#tab-' + t).click(), t);
      await page.waitForTimeout(30);
      for (const a of (c.soloTab || {})[t] || []) { await waitStable(page, '#bay'); const r = await act(page, a, variant); if (r !== 'ok') out.notes.push(t + ': ' + r); await page.waitForTimeout(30); }
      const ok = await waitStable(page, '#bay');
      out.solo[t] = ok ? await page.evaluate(GRAB, '#bay') : { timeout: true };
    }
  };
  const runDuo = async () => {
    if (!(c.duo || []).length) return;
    if (variant === 'main' && group !== 'duo') { await page.click('#grp-duo'); group = 'duo'; }
    const sel = variant === 'main' ? '#bay' : '#duo-bay';
    let first = true;
    for (const t of c.duo) {
      await page.evaluate((t) => document.querySelector('#tab-' + t).click(), t);
      await page.waitForTimeout(30);
      if (first) { for (const a of c.duoPre || []) { await waitStable(page, sel); const r = await act(page, a, variant); if (r !== 'ok') out.notes.push('duo: ' + r); await page.waitForTimeout(30); } first = false; }
      const ok = await waitStable(page, sel);
      out.duo[t] = ok ? await page.evaluate(GRAB, sel) : { timeout: true };
    }
  };
  if (c.duoFirst) { await runDuo(); await runSolo(); } else { await runSolo(); await runDuo(); }
  out.dial = await page.evaluate(DIAL);
  if (c.ladder) out.ladder = await grabLadder(page);
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
