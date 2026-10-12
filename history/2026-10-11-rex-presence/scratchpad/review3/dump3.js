const H = require('./h.js');
(async () => {
  const p = await H.open({ action: 'throw', obj: 'bowling' });
  await H.waitDone(p);
  await p.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
  const txt = await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style').forEach((s) => s.remove()); return c.textContent; });
  require('fs').writeFileSync('fullpage.txt', txt);
  for (const re of [/[^.]*12\.7 mm\/s[^.]*\./g, /[^.]*40 Hz[^.]*\./g]) { const m = txt.match(re) || []; console.log(re, m.length); m.slice(0, 30).forEach((s) => console.log('  >', s.trim().slice(0, 300))); }
  await p.close(); await H.close();
})();
