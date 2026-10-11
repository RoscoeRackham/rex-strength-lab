const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  const p = await open(b, { width: 1280, height: 900, skel: 'host', fonts: false });
  console.log(await p.evaluate(() => { const s = Array.from(document.querySelectorAll('#sources details.src summary')).map(x => x.textContent); return JSON.stringify({ s, facts: document.querySelectorAll('#sources .fact').length }); }));
  await b.close();
})();
