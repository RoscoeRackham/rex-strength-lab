const L = require('./lib.js');
// usage: EFFSEL=allout node solo.js '<json state>' [grep-regex]
(async () => {
  const s = JSON.parse(process.argv[2]);
  const b = await L.chromium.launch({ executablePath: L.CHROME });
  const p = await L.open(b, process.env.MAINPAGE ? L.MAIN() : L.NEW(), s, { wait: 800 });
  if (process.env.EFFSEL) { await L.waitSettled(p, '#bay', 30000); await p.selectOption('#effort', process.env.EFFSEL); await p.waitForTimeout(800); }
  await L.waitSettled(p, '#bay', 30000);
  await p.evaluate(() => { for (const d of document.querySelectorAll('#bay details')) d.open = true; });
  await p.waitForTimeout(200);
  const t = await p.evaluate(() => document.querySelector('#bay').innerText);
  const re = process.argv[3] ? new RegExp(process.argv[3], 'i') : null;
  console.log(re ? t.split('\n').filter((l) => re.test(l)).join('\n') : t);
  if (p.errs.length) console.log('ERRS', p.errs);
  await b.close();
})();
