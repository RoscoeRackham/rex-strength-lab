// shared helpers for the round 4 ux lens
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const { pathToFileURL } = require('url');
const DIR = __dirname;
const url = (name) => pathToFileURL(path.join(DIR, name)).href;
async function open(browser, { w = 1280, h = 900, scheme = 'light', file = 'branch.html', state = null, theme = null, init = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  if (init) await page.addInitScript(init.fn, init.arg);
  await page.addInitScript(({ state, theme }) => {
    try { if (!sessionStorage.getItem('__init')) { localStorage.clear(); if (state) localStorage.setItem('rex-lab-v1', JSON.stringify(state)); sessionStorage.setItem('__init', '1'); } } catch (e) {}
    if (theme) document.addEventListener('DOMContentLoaded', () => document.documentElement.setAttribute('data-theme', theme));
  }, { state, theme });
  await page.goto(url(file));
  await page.waitForTimeout(2500);
  return { page, ctx, errs };
}
const launch = () => chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
module.exports = { open, launch, DIR, url };
