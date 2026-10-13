const L = require('./lib.js');
// usage: node duo.js '<json state>' [maxchars] [ownStrengthLogKg]
(async () => {
  const s = JSON.parse(process.argv[2]);
  const b = await L.chromium.launch({ executablePath: L.CHROME });
  const p = await L.open(b, L.NEW(), Object.assign({ duoOpen: true }, s), { wait: 500 });
  if (process.argv[4]) {
    await p.evaluate(() => { document.querySelector('#ollie-setup').open = true; });
    await p.click('#o-own');
    const v = process.argv[4];
    if (v === 'inf') await p.check('#o-inf'); else await p.evaluate((x) => { const r = document.querySelector('#o-strength'); r.value = x; r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); }, v);
    await p.waitForTimeout(500);
  }
  if (process.env.EFF) { await L.waitSettled(p, '#duo-bay', 30000); await p.selectOption('#duo-effort', process.env.EFF); await p.waitForTimeout(500); }
  await p.evaluate(() => { for (const d of document.querySelectorAll('#duo-bay details')) d.open = true; });
  const t = await L.waitSettled(p, '#duo-bay', 30000);
  await p.evaluate(() => { for (const d of document.querySelectorAll('#duo-bay details')) d.open = true; });
  await p.waitForTimeout(200);
  const t2 = await p.evaluate(() => document.querySelector('#duo-bay').innerText);
  console.log(t2.slice(0, Number(process.argv[3] || 6000)));
  if (p.errs.length) console.log('ERRS', p.errs);
  await b.close();
})();
