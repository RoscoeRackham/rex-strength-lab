const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  const p = await open(b, { width: 390, height: 844, skel: 'host' });
  await p.click('#clusters button[data-jump="meatball"]'); await p.waitForTimeout(150);
  console.log('cluster 924 ->', await p.evaluate(() => { const el = document.getElementById('meatball'); return Math.round(el.getBoundingClientRect().top) + ' ' + document.getElementById('locNow').textContent; }));
  await b.close();
})();
