// With both bays drawn, list ids used more than once in the document, for every pair of Rex's tab and a two-player tab.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const found = {};
  for (const wm of ['push', 'throw', 'shove', 'lift']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((wm) => { if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', duoAction: 'arm', duoOpen: true, wrestleMove: wm, logKg: 8 })); sessionStorage.setItem('s', '1'); } }, wm);
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(__dirname, '..', 'branch.html'));
    for (const d of DUO) {
      if (wm !== 'push' && d !== 'wrestle') continue;
      await page.evaluate((d) => document.querySelector('#tab-' + d).click(), d);
      await page.waitForFunction(() => { const x = document.querySelector('#duo-bay'); return x && x.querySelector('.verdict') && !/working/i.test(x.textContent); }, null, { timeout: 60000 });
      for (const s of SOLO) {
        await page.evaluate((s) => document.querySelector('#tab-' + s).click(), s);
        await page.waitForTimeout(150);
        const dups = await page.evaluate(() => { const c = {}; for (const e of document.querySelectorAll('[id]')) c[e.id] = (c[e.id] || 0) + 1; return Object.keys(c).filter((k) => c[k] > 1); });
        for (const id of dups) (found[id] = found[id] || []).push(s + '+' + d + (d === 'wrestle' ? '(' + wm + ')' : ''));
      }
    }
    await ctx.close();
  }
  for (const [id, where] of Object.entries(found)) console.log('#' + id, 'duplicated when Rex/duo tabs are', where.join(', '));
  await browser.close();
})();
