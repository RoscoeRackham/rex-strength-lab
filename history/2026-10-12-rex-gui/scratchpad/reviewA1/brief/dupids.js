const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'pages', 'branch.html'));
  const seen = {};
  for (const d of DUO) for (const wm of (d === 'wrestle' ? ['push', 'shove', 'lift', 'throw'] : [null])) for (const extra of (d === 'collide' ? [{ colSrc: 'sprint' }, { colSrc: 'set' }] : [{}])) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true, duoAction: d, action: 'walk' }, wm ? { wrestleMove: wm } : {}, extra));
    await page.reload(); await page.waitForTimeout(1500);
    for (const s of SOLO) {
      await page.click('#tab-' + s); await page.waitForTimeout(250);
      const dups = await page.evaluate(() => { const c = {}; for (const n of document.querySelectorAll('[id]')) c[n.id] = (c[n.id] || 0) + 1; return Object.entries(c).filter(([k, v]) => v > 1).map(([k, v]) => k + 'x' + v + '[' + Array.from(document.querySelectorAll('[id="' + k + '"]')).map((n) => n.closest('#bay') ? 'bay' : n.closest('#duo-bay') ? 'duo-bay' : 'other').join(',') + ']'); });
      if (dups.length) { const key = dups.join(' '); (seen[key] = seen[key] || []).push(s + '+' + d + (wm ? ':' + wm : '') + (extra.colSrc ? ':' + extra.colSrc : '')); }
    }
  }
  for (const [k, v] of Object.entries(seen)) console.log(k, '<= duo:', [...new Set(v.map((x) => x.split('+')[1]))].join(' '), '| solo:', [...new Set(v.map((x) => x.split('+')[0]))].join(' '));
  if (!Object.keys(seen).length) console.log('no duplicate ids');
  await browser.close();
})();
