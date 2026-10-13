const { NEW, launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const p = await open(b, NEW, null, { wait: 1500 });
  const rows = await p.evaluate(() => Array.from(document.querySelectorAll('table tr')).map((r) => r.textContent.replace(/\s+/g, ' ').trim()).filter((t) => /shear|bolted|Ollie's grip|Ollie’s grip|Their powers|tear/i.test(t)));
  rows.forEach((r) => console.log('-', r.slice(0, 400)));
  await b.close();
})();
