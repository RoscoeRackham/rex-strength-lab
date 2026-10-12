const { open } = require('./pw.js');
const st = {group:'duo', duoAction:'catch', cObj:'person', inf:true, mode:'real', cLogD:1.5, cStyle:'hard'};
const read = (page) => page.evaluate(()=>document.querySelector('.effort-read').innerText.replace(/\n+/g,' / '));
const settle = (page) => page.waitForFunction(()=>!/working it out/i.test(document.querySelector('main.panel').innerText), null, {timeout:120000});
(async()=>{
 for (const r of process.argv.slice(2)) {
  // control: fresh load, settle
  let { browser, page } = await open(__dirname+'/'+r, st);
  await page.waitForTimeout(300); await settle(page); await page.waitForTimeout(300);
  console.log('==', r, 'fresh:', (await read(page)).slice(0,200));
  await browser.close();
  for (const other of ['partner','bus','baseball']) {
    ({ browser, page } = await open(__dirname+'/'+r, st));
    await page.waitForSelector('#c-obj');
    const pending = await page.evaluate(()=>/working it out/i.test(document.querySelector('main.panel').innerText));
    await page.selectOption('#c-obj', other);
    await page.waitForTimeout(200);
    await settle(page).catch(()=>{});
    await page.waitForTimeout(15000);
    await page.selectOption('#c-obj', 'person');
    await page.waitForTimeout(300); await settle(page).catch(()=>{}); await page.waitForTimeout(300);
    console.log('  ', r, 'pending at switch:', pending, 'via', other, '->', (await read(page)).slice(0,200));
    await browser.close();
  }
 }
})();
