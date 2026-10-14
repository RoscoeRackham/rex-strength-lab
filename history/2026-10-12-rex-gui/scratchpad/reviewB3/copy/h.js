const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB3/copy';
const DIST = process.env.DIST || S + '/repo/rex-strength-lab/dist/index.html';
const prev = S + '/' + (process.env.PREVNAME || 'preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + fs.readFileSync(DIST, 'utf8') + '</body></html>');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
async function open(opts = {}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: opts.h || 900 }, colorScheme: opts.scheme || 'light' });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  return { browser, page, errs };
}
async function settle(page, ms = 60000) {
  const t0 = Date.now();
  await page.waitForTimeout(400);
  while (Date.now() - t0 < ms) {
    const busy = await page.evaluate(() => /orking (it )?out/.test(document.body.innerText));
    if (!busy) break;
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(200);
}
// st: state overrides; tab; effort (solo) or duoEffort; returns text of the bay
async function view(page, st, tab, effort, extra) {
  await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, Object.assign({ action: SOLO.includes(tab) ? tab : 'throw', duoAction: SOLO.includes(tab) ? 'arm' : tab, duoOpen: !SOLO.includes(tab) }, st));
  await page.reload();
  await page.waitForTimeout(500);
  const duo = !SOLO.includes(tab);
  if (duo) { if (!(await page.evaluate(() => document.getElementById('duo').open))) await page.click('#duo > summary'); }
  await page.click('#tab-' + tab);
  await settle(page);
  if (extra) { await extra(page); await settle(page); }
  if (effort) { const sel = duo ? '#duo-effort' : '#effort'; if (await page.$(sel)) { await page.selectOption(sel, effort); await settle(page); } else return null; }
  return page.evaluate((duo) => { const n = duo ? document.getElementById('duo-bay') : document.getElementById('bay'); const c = n.cloneNode(true); c.querySelectorAll('details.math').forEach((d) => d.open = true); return n.innerText + '\n--MATH--\n' + Array.from(n.querySelectorAll('details.math .eq')).map((e) => e.textContent).join('\n'); }, duo);
}
module.exports = { open, view, settle, S, SOLO };
