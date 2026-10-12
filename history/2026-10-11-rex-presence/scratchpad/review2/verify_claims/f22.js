const H = require('./vh.js');
(async () => {
  const p = await H.open({ group: 'solo', action: 'walk' });
  await H.settle(p);
  const t = await p.evaluate(() => { document.querySelectorAll('details').forEach((d) => { d.open = true; }); return document.body.innerText; });
  console.log(t.split('\n').filter((l) => /glass|ripple|shimmer/i.test(l)).map((l) => l.slice(0, 400)).join('\n'));
  // tile statuses in bay
  console.log('TILES:', await p.evaluate(() => [...document.querySelectorAll('#bay .tile')].map((x) => x.innerText.replace(/\n/g, ' | ')).join('\n')));
  await p.close(); await H.close();
})();
