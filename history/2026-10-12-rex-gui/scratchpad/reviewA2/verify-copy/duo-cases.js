const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { run } = require('./h.js');
const cases = [
  ['wrestle shove both bolted', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', anchor: 'bolted', oAnchor: 'bolted', surface: 'sand' }],
  ['wrestle push both bolted', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', anchor: 'bolted', oAnchor: 'bolted', surface: 'sand' }],
  ['wrestle push Rex bolted only', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', anchor: 'bolted', oAnchor: 'friction', surface: 'sand' }],
  ['wrestle shove Rex bolted only', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', anchor: 'bolted', oAnchor: 'friction', surface: 'sand' }],
  ['wrestle shove both bolted allout', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', anchor: 'bolted', oAnchor: 'bolted', surface: 'sand', duoEffort: 'allout' }],
  ['collide push, Ollie pushes, Ollie bolted only', { duoOpen: true, duoAction: 'collide', colMode: 'push', colWho: 'ollie', anchor: 'friction', oAnchor: 'bolted', surface: 'sand' }],
  ['collide push, Ollie pushes, Rex bolted only', { duoOpen: true, duoAction: 'collide', colMode: 'push', colWho: 'ollie', anchor: 'bolted', oAnchor: 'friction', surface: 'sand' }],
  ['arm, Rex bolted, sand', { duoOpen: true, duoAction: 'arm', anchor: 'bolted', oAnchor: 'friction', surface: 'sand' }],
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  const only = process.argv[2];
  for (const [name, st] of cases) {
    if (only && !name.includes(only)) continue;
    const t = await run(page, 'new', st, 'duo');
    console.log('=== ' + name + ' ' + JSON.stringify(st));
    console.log(t.split('\n').filter((l) => l.trim()).filter((l) => /tear|bolt|footing|moves|shove|push|holds|wins|Nobody|Neither|Dead|limit|rock|ground/i.test(l)).map((l) => '  ' + l.slice(0, 330)).join('\n'));
  }
  await browser.close();
})();
