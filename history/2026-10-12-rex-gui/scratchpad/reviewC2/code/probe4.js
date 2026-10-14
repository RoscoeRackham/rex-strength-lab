const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const DIR = process.argv[2];
(async () => {
  const prev = path.join(DIR, 'probe.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st, allout, bay='bay', sel='#effort') => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(700); await settle(page, bay); if (allout) { await page.selectOption(sel, 'allout'); await page.waitForTimeout(500); await settle(page, bay); } };
  const ovf = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const cmp = (bay) => page.evaluate((b) => Array.from(document.querySelectorAll('#' + b + ' .tile')).filter((t) => /Compared with|Energy freed|Energy released/.test(t.textContent)).map((t) => t.textContent.replace(/\s+/g, ' ')), bay);
  const words = new Set();
  for (const action of ['punch', 'clap', 'stomp']) for (const logKg of [0.5, 1, 2, 5, 10, 20, 30, 34]) {
    await load({ action, logKg, mode: 'comic' }, true);
    const o = await ovf(); const c = await cmp('bay');
    for (const x of c) words.add(action + ' ' + logKg + ': ' + x);
    if (o > 0) console.log('OVERFLOW', action, logKg, o);
  }
  for (const w of words) console.log(w);
  // custom low effort: tiny energies
  for (const action of ['punch','clap','stomp']) {
    await load({ action, logKg: 1, mode: 'comic', effort: 'custom', effortLogKg: -3 }, false);
    console.log('custom -3', action, await cmp('bay'), await ovf());
  }
  // duo: collide and catch all-out at high strength
  for (const st of [{ duoOpen: true, duoAction: 'collide', logKg: 34 }, { duoOpen: true, duoAction: 'collide', logKg: 20 }, { duoOpen: true, duoAction: 'catch', logKg: 34 }, { duoOpen: true, duoAction: 'catch', logKg: 25 }, { duoOpen: true, duoAction: 'catch', logKg: 20, cObj: 'car' }]) {
    await load(st, false, 'duo-bay');
    try { await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(600); await settle(page, 'duo-bay'); } catch (e) { console.log('sel fail', e.message.slice(0,80)); }
    const t = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    const hits = t.match(/[^.]*(?:the same as|× (?:the|a|an|Earth|Jupiter|Usain|SN|Castle)|% of (?:the|a|an|Earth|Jupiter|Usain|SN|Castle)|beyond the ladder|no energy to compare|more than any finite)[^.]*\./g) || [];
    console.log('\n=== ', JSON.stringify(st), 'overflow', await ovf()); for (const h of hits) console.log('  >', h.slice(0, 400));
    console.log('  tiles', await cmp('duo-bay'));
  }
  console.log('errs', errs);
  await browser.close();
})();
