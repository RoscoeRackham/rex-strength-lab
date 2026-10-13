// harness: node h.js cases.json -> prints bay text for each case
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
const SRC = '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html';
const body = fs.readFileSync(SRC, 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
const prev = path.join(DIR, 'page.html'); fs.writeFileSync(prev, wrapped);
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
async function settle(page, id) { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } console.log('!! still working'); }
async function dump(page, id) {
  return page.evaluate((id) => {
    const bay = document.getElementById(id); const out = [];
    const walk = (n) => {
      for (const c of n.children) {
        const cls = c.className && c.className.baseVal === undefined ? c.className : '';
        if (c.tagName === 'svg' || c.tagName === 'CANVAS') continue;
        if (/\b(verdict|callout|chip|tile|effort-read|status-row)\b/.test(cls) || c.tagName === 'LI' || c.tagName === 'P' || (c.classList && c.classList.contains('eq'))) { out.push('[' + (cls || c.tagName) + '] ' + (c.classList.contains('eq') ? c.textContent : c.textContent.replace(/\s+/g, ' ').trim())); continue; }
        if (c.tagName === 'OPTION') continue;
        if (c.children.length === 0 && c.textContent.trim()) { out.push('[' + c.tagName + '.' + cls + '] ' + c.textContent.replace(/\s+/g, ' ').trim()); continue; }
        walk(c);
      }
    };
    walk(bay); return out.join('\n');
  }, id);
}
module.exports = async function run(cases, opts = {}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: opts.h || 900 }, colorScheme: opts.scheme || 'light' });
  const errs = []; page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  const res = {};
  for (const c of cases) {
    const duo = !SOLO.includes(c.tab);
    const st = Object.assign({}, c.state, duo ? { duoOpen: true, duoAction: c.tab } : { action: c.tab });
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload(); await page.waitForTimeout(500);
    const id = duo ? 'duo-bay' : 'bay';
    if (duo) { await page.evaluate(() => { const d = document.getElementById('duo'); if (!d.open) d.open = true; }); await page.waitForTimeout(300); }
    await settle(page, id);
    if (c.pre) { await page.evaluate(c.pre); await page.waitForTimeout(400); await settle(page, id); }
    if (c.pick && await page.$(duo ? '#duo-effort' : '#effort')) { await page.selectOption(duo ? '#duo-effort' : '#effort', c.pick); await page.waitForTimeout(400); await settle(page, id); }
    if (c.custom != null) { await page.evaluate(([sel, v]) => { const s = document.querySelector(sel); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }, [duo ? '#duo-effort-use' : '#effort-use', String(c.custom)]); await page.waitForTimeout(600); await settle(page, id); }
    if (c.after) { await page.evaluate(c.after); await page.waitForTimeout(500); await settle(page, id); }
    await page.evaluate(() => document.querySelectorAll('details.math').forEach((d) => d.open = true));
    const t = await dump(page, id);
    res[c.id] = t;
    if (!opts.quiet) console.log('\n######## ' + c.id + ' ' + JSON.stringify(c.state) + (c.pick ? ' pick=' + c.pick : '') + '\n' + t);
    if (c.shot) await page.screenshot({ path: path.join(DIR, c.id + '.png'), fullPage: !!c.full });
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
  return res;
};
