const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB4/brief/repo/rex-strength-lab';
const S='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB4/brief';
const body = fs.readFileSync(R + '/dist/index.html', 'utf8');
const prev = S + '/page.html';
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
async function open(w) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: w || 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  return { browser, page, errs };
}
async function settle(page, id) {
  for (let i = 0; i < 240; i++) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id);
    if (!busy) return;
    await page.waitForTimeout(250);
  }
  throw new Error('still working');
}
// load a state; tab: solo action or duo action
async function load(page, state, tab, duo) {
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, Object.assign({}, state, duo ? { duoOpen: true, duoAction: tab } : { action: tab }));
  await page.reload();
  await page.waitForTimeout(800);
  await settle(page, duo ? 'duo-bay' : 'bay');
}
async function text(page, id) { return page.evaluate((id) => document.getElementById(id).innerText, id); }
async function pick(page, sel, val, id) { await page.selectOption(sel, val); await page.waitForTimeout(400); await settle(page, id); }
module.exports = { open, settle, load, text, pick };
