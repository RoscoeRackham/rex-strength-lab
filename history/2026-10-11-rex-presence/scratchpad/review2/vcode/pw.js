// helper: open a page with saved state
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const path=require('path');
exports.open = async (repo, saved, opts={}) => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: opts.w||1280, height: 900 } });
  const page = await ctx.newPage();
  const errs=[]; page.on('pageerror', e=>errs.push(e.message)); page.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  const url = pathToFileURL(path.join(repo,'rex-strength-lab/dist/preview.html')).href;
  if (saved) { await page.addInitScript((s)=>{ if(!sessionStorage.getItem('seeded')){ localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('seeded','1'); } }, saved); }
  await page.goto(url);
  return { browser, page, errs, url };
};
