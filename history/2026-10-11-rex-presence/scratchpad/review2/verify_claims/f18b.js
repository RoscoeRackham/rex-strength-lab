const H = require('./vh.js');
(async () => {
  const p = await H.open({ group: 'solo', action: 'walk', m: 6000 });
  await H.settle(p);
  console.log(await p.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).m), await p.evaluate(() => document.body.innerText.match(/[^\n]*(6,000|6 t)[^\n]*/g)));
  await p.close(); await H.close();
})();
