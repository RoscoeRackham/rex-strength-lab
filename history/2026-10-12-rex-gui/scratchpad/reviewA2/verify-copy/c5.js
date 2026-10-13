const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { run } = require('./h.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const gh of [false, true]) {
    const st = { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', anchor: 'bolted', oAnchor: 'bolted', surface: 'concrete', groundHolds: gh };
    const t = await run(page, 'new', st, 'duo');
    console.log('=== wrestle push both bolted concrete groundHolds=' + gh);
    console.log(t.split('\n').filter((l) => /Neither moves|tears|Comic ground/.test(l)).map((l) => '  ' + l.slice(0, 300)).join('\n'));
  }
  for (const gh of [false, true]) {
    const st = { duoOpen: true, duoAction: 'arm', anchor: 'bolted', oAnchor: 'bolted', surface: 'sand', groundHolds: gh };
    const t = await run(page, 'new', st, 'duo');
    console.log('=== arm both bolted sand groundHolds=' + gh);
    console.log(t.split('\n').filter((l) => /tears|Table|table holds|Comic ground/i.test(l)).map((l) => '  ' + l.slice(0, 200)).join('\n'));
  }
  // the Newton card text as rendered
  const card = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && /Newton’s third law stays on/.test(e.textContent)).map((e) => e.parentElement.innerText).join('\n---\n'));
  console.log('CARD:', card.slice(0, 700));
  await browser.close();
})();
