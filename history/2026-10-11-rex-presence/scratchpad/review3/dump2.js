const H = require('./h.js');
(async () => {
  const p = await H.open({ action: 'throw', obj: 'bowling' });
  await H.waitDone(p);
  let t = await H.bay(p);
  require('fs').writeFileSync('throw-bowling-least.txt', t);
  t = await H.setEffort(p, 'ceiling'); t = await H.bay(p);
  require('fs').writeFileSync('throw-bowling-ceiling.txt', t);
  const all = await p.evaluate(() => document.body.textContent);
  const i = all.indexOf('12.7');
  console.log('pageHas12.7', i, (all.match(/12\.7 mm\/s/g)||[]).length, (all.match(/50\.8|51 mm\/s|40 Hz/g)||[]));
  await p.close(); await H.close();
})();
