const L = require('./lib.js');
(async () => {
  const b = await L.chromium.launch({ executablePath: L.CHROME });
  const url = L.NEW();
  const p = await L.open(b, url, null);
  // open all details in sidebar
  await p.evaluate(() => { for (const d of document.querySelectorAll('aside details')) d.open = true; });
  const side = await p.evaluate(() => document.querySelector('aside').innerText);
  console.log('=== SIDEBAR\n' + side);
  const sums = await p.evaluate(() => ({ setup: document.querySelector('#setup-sum').textContent, powers: document.querySelector('#powers-sum').textContent, duo: document.querySelector('#duo-sum').textContent, ollie: document.querySelector('#ollie-sum').textContent }));
  console.log(JSON.stringify(sums, null, 1));
  // full page text, search for suspects
  await p.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = true; });
  await p.waitForTimeout(4000);
  const all = await p.evaluate(() => document.body.innerText);
  require('fs').writeFileSync('page-default.txt', all);
  const re = /Settings|Comic switch|comic switch|dug|claw|boot|sidebar|Rex alone|Ollie panel|Ollie’s panel|braced|shear|kick|foothold/g;
  const lines = all.split('\n');
  lines.forEach((l, i) => { if (re.test(l)) console.log('L' + i + ': ' + l.slice(0, 400)); re.lastIndex = 0; });
  console.log('errs', p.errs);
  await b.close();
})();
