const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), { pathToFileURL } = require('url');
const S = __dirname;
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0;
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; if (delay) { const t = performance.now(); while (performance.now() - t < delay) { } } return f.apply(this, arguments); }; }
    v = x;
  } });
};
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
async function open(browser, file, opts = {}) {
  const page = await browser.newPage({ viewport: opts.viewport || { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  if (opts.count) await page.addInitScript(countDuoCalls, { names: DUO_FNS, delay: opts.delay || 0 });
  if (opts.init) await page.addInitScript(opts.init, opts.initArg);
  const url = pathToFileURL(path.join(S, file)).href;
  await page.goto(url);
  if (opts.state !== undefined) {
    await page.evaluate((s) => { if (s === null) localStorage.clear(); else localStorage.setItem('rex-lab-v1', typeof s === 'string' ? s : JSON.stringify(s)); }, opts.state);
    await page.reload();
  }
  await page.waitForTimeout(opts.wait || 1000);
  page.errs = errs;
  return page;
}
async function settle(page, bayId) {
  for (let i = 0; i < 160; i++) {
    const busy = await page.evaluate((id) => { const b = document.getElementById(id); return !b || /working it out|Working out/i.test(b.textContent); }, bayId);
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}
async function readResult(page, bayId) {
  return page.evaluate((id) => {
    const bay = document.getElementById(id);
    const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
    const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq') };
  }, bayId);
}
module.exports = { launch, open, settle, readResult, S, DUO_FNS };
