const { open } = require('./pw.js');
const grab = (t, re) => t.split('\n').filter((l) => re.test(l)).join('\n');
(async () => {
  // 1. Kaiju size walk math
  let s = await open({ state: { H: 50, m: 3007 * Math.pow(50 / 3.048, 3), action: 'walk' } });
  await s.tab('walk'); await s.openAll();
  let t = await s.bay();
  console.log('--- 50 m walk\n' + grab(t, /Load:|landing pulse/));
  await s.browser.close();
  // 2. sand, both walkers
  s = await open({ state: { surface: 'sand', action: 'walk', walker: 'both' } });
  await s.tab('walk'); await s.openAll();
  t = await s.bay();
  console.log('--- sand both\n' + grab(t, /elephant|Footprint|deep|mm$|cm$/i).slice(0, 1500));
  await s.browser.close();
  s = await open({ state: { surface: 'sand', action: 'walk', walker: 'rex' } });
  await s.tab('walk'); t = await s.bay();
  console.log('--- sand rex\n' + t.split('\n').slice(t.split('\n').findIndex((l) => /Compared with an elephant/.test(l)), t.split('\n').findIndex((l) => /Compared with an elephant/.test(l)) + 12).join('\n'));
  await s.browser.close();
  s = await open({ state: { surface: 'granite', action: 'walk', walker: 'rex' } });
  await s.tab('walk'); t = await s.bay();
  const L = t.split('\n'), i = L.findIndex((l) => /Compared with an elephant/.test(l));
  console.log('--- granite rex\n' + L.slice(i, i + 3).join('\n'));
  // whole-page text for sources + cards
  await s.openAll();
  const all = await s.page.evaluate(() => document.body.innerText);
  require('fs').writeFileSync(__dirname + '/alltext.txt', all);
  await s.browser.close();
  // stomp
  s = await open({ state: { action: 'stomp' } });
  await s.tab('stomp'); t = await s.bay();
  console.log('--- stomp\n' + grab(t, /Effort:|feel/));
  await s.browser.close();
  // weight what-if
  s = await open({ state: { action: 'weight' } });
  await s.tab('weight'); await s.openAll(); t = await s.bay();
  console.log('--- weight\n' + grab(t, /Krakatoa|Chicxulub|Sun|grow|absorb/i).slice(0, 2500));
  const sel = await s.page.evaluate(() => [...document.querySelectorAll('#bay select')].map((x) => x.id + ': ' + [...x.options].map((o) => o.value).join('|')));
  console.log(sel);
  await s.browser.close();
})();
