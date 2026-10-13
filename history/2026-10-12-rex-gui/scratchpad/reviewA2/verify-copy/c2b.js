const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { run } = require('./h.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const [n, st] of [
    ['shove Rex bolted, Ollie standing, sand', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', anchor: 'bolted', oAnchor: 'friction', surface: 'sand' }],
    ['shove both bolted, sand', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', anchor: 'bolted', oAnchor: 'bolted', surface: 'sand' }],
    ['collide push, Ollie bolted pusher, sand', { duoOpen: true, duoAction: 'collide', colMode: 'push', colWho: 'ollie', anchor: 'friction', oAnchor: 'bolted', surface: 'sand' }]]) {
    const t = await run(page, 'new', st, 'duo');
    const lines = t.split('\n').filter((l) => l.trim());
    const i = lines.findIndex((l) => /^(Nobody|Rex|Ollie|Pushing|Neither)/.test(l) && l.length > 30);
    console.log('=== ' + n + '\n  verdict: ' + (lines[i] || '').slice(0, 250) + '\n  mentions of tear: ' + (lines.filter((l) => /tear/i.test(l) && !/^\s*(FINITE|UNLIMITED)/.test(l)).length));
  }
  await browser.close();
})();
