const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/rex-strength-lab/rex-strength-lab/dist/preview.html');
  await p.waitForTimeout(1000);
  await p.click('#tab-throw');
  await p.selectOption('#obj', 'person');
  const wait = async () => { for (let i = 0; i < 80; i++) { const w = await p.evaluate(() => /working it out/i.test(document.querySelector('#bay').innerText)); if (!w) break; await p.waitForTimeout(500); } };
  await wait();
  await p.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
  console.log((await p.evaluate(() => document.querySelector('#bay').innerText)).split('\n').filter((l) => /g |ride|Eiband|drag|person|Effort|ceiling|Courtesy|Passenger|passenger|flies|lands|landing/i.test(l)).join('\n'));
  // all-out
  const opts = await p.$$eval('#bay select', (ss) => ss.map((s) => s.id + ':' + [...s.options].map((o) => o.value).join(',')));
  console.log(opts);
  await b.close();
})();
