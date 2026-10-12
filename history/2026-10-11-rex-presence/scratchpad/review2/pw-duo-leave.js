const { open, bayText, launch } = require('./lib.js');
const pick = (t) => t.split('\n').filter((l) => /^(Effort:|All-out|Courtesy ceiling|At this effort)/.test(l)).join(' | ');
const settle = async (page) => { for (let i = 0; i < 200; i++) { await page.waitForTimeout(250); if (!/working it out/i.test(await bayText(page))) return; } };
(async () => {
  const b = await launch();
  const st = JSON.parse(process.argv[2]);
  let { page } = await open(b, st);
  await settle(page);
  console.log('fresh            :', pick(await bayText(page)));
  await page.close();
  ({ page } = await open(b, st));
  console.log('pending at leave :', /working it out/i.test(await bayText(page)));
  await page.click('#grp-solo');
  await page.waitForTimeout(15000);
  await page.click('#grp-duo');
  await settle(page);
  console.log('after solo trip  :', pick(await bayText(page)));
  await b.close();
})();
