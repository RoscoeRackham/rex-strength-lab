const { session } = require('./lib2');
(async () => {
  const s = await session();
  await s.load({});
  await s.page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
  await s.page.waitForTimeout(1500);
  const all = await s.page.evaluate(() => document.body.innerText);
  require('fs').writeFileSync(__dirname + '/fulltext.txt', all);
  const lines = all.split('\n');
  for (const re of [/shear/i, /claw/i, /dug/i, /buried/i, /setting/i, /comic switch/i, /Rex alone/i, /boot/i, /bolt/i, /foothold/i, /Their powers/i, /Ground gripped/i]) {
    const hits = lines.filter(l => re.test(l));
    console.log('==', re, hits.length); hits.slice(0, 12).forEach(h => console.log('   ', h.slice(0, 400)));
  }
  await s.browser.close();
})();
