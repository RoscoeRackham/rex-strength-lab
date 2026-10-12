const H = require('./h.js');
(async () => {
  const p = await H.open({ action: 'jump', group: 'solo' });
  await H.waitDone(p); await H.openAll(p);
  const t = await p.evaluate(() => [document.querySelector('#dial-big').innerText, document.querySelector('#dial-force').innerText, [...document.querySelectorAll('#bay .math .eq')].map((x) => x.innerText).join('\n')].join('\n'));
  console.log(t);
  await p.close(); await H.close();
})();
