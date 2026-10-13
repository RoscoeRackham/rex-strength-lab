const H = require('./harness');
(async () => {
  const b = await H.launch();
  const p = await H.open(b, H.OLD, { group: 'duo', duoAction: 'arm', anchor: 'bolted', surface: 'sand' });
  await H.settle(p, '#bay', 60000);
  const t = await p.evaluate(() => document.querySelector('#bay').innerText);
  const i = t.indexOf('Dead heat'); console.log(t.slice(i, i + 400));
  const q = await H.open(b, H.NEW, { duoOpen: true, duoAction: 'arm', anchor: 'bolted', surface: 'sand' });
  await H.settle(q, '#duo-bay', 60000);
  const u = await q.evaluate(() => { const bay = document.querySelector('#duo-bay'); for (const d of bay.querySelectorAll('details')) d.open = true; return bay.innerText; });
  const j = u.indexOf('Dead heat'); console.log('NEW:', u.slice(j, j + 300));
  const k = u.indexOf('Bolted to the planet holds'); console.log('NEW item:', k >= 0 ? u.slice(k, k + 250) : 'none');
  const m = u.indexOf('Show the math'); console.log('NEW math:', u.slice(m, m + 600));
  await b.close();
})();
