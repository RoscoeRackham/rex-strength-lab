// Does a background two-player plan keep running with the new settings after a change, and cache wrong results?
const { open, bayText, launch } = require('./lib.js');
const pick = (t) => t.split('\n').filter((l) => /Effort|ceiling|Courtesy|All-out|At this effort|working/i.test(l)).slice(0, 5).join(' | ');
(async () => {
  const b = await launch();
  const st = JSON.parse(process.argv[2]);
  // A: fresh, wait to settle
  let { page } = await open(b, st);
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (!/working it out/i.test(await bayText(page))) break; }
  console.log('A fresh car:', pick(await bayText(page)));
  await page.close();
  // B: load, then switch to the partner toss while the car plan is still working, wait, switch back to car
  ({ page } = await open(b, st));
  await page.waitForTimeout(300);
  console.log('B at load:', pick(await bayText(page)));
  await page.selectOption('#c-obj', 'partner');
  await page.waitForTimeout(200);
  console.log('B partner:', pick(await bayText(page)));
  await page.waitForTimeout(8000);
  await page.selectOption('#c-obj', 'car');
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (!/working it out/i.test(await bayText(page))) break; }
  console.log('B back to car:', pick(await bayText(page)));
  await b.close();
})();
