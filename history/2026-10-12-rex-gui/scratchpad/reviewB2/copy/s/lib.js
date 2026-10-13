const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/copy';
const SRC = process.env.PAGE || path.join(DIR, 'lab/dist/index.html');
const prev = path.join(DIR, 'preview' + (process.env.PAGE ? '-alt' : '') + '.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(SRC, 'utf8') + '</body></html>');
async function open(opts = {}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: opts.h || 900 }, colorScheme: opts.scheme || 'light' });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  return { browser, page, errs };
}
async function settle(page, id) {
  for (let i = 0; i < 400; i++) {
    const busy = await page.evaluate((id) => { const b = document.getElementById(id); return !b || /working it out|Working out/i.test(b.textContent); }, id);
    if (!busy) return;
    await page.waitForTimeout(250);
  }
  console.log('!! still working after 100 s');
}
async function load(page, st, { effort, duoEffort, duo } = {}) {
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.reload();
  await page.waitForTimeout(500);
  const id = duo ? 'duo-bay' : 'bay';
  if (effort) { await page.selectOption('#effort', effort); }
  if (duoEffort) { await settle(page, 'duo-bay'); await page.selectOption('#duo-effort', duoEffort); }
  await page.waitForTimeout(300);
  await settle(page, id);
  return id;
}
async function read(page, id) {
  return page.evaluate((id) => {
    const bay = document.getElementById(id);
    const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
    const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
    return { verdict: all('.verdict'), status: all('.status-row'), tiles: all('.tile'), effort: all('.effort-read p, .effort-read li, .effort-read .status'), happens: all('.happens li'), callouts: all('.callout'), math: all('details.math .eq'), legend: all('.ladder-legend') };
  }, id);
}
function show(label, r) {
  console.log('\n===== ' + label);
  for (const k of Object.keys(r)) if (r[k] && r[k].length) { console.log('-- ' + k); for (const x of r[k]) console.log('   ' + x); }
}
module.exports = { open, load, read, show, settle };
