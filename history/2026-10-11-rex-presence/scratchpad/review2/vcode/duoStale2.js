const { open } = require('./pw.js');
const st = {group:'duo', duoAction:'catch', cObj:'person', inf:true, mode:'real', cLogD:1.5, cStyle:'hard'};
const read = (page) => page.evaluate(()=>document.querySelector('.effort-read').innerText.replace(/\n+/g,' / '));
const isPending = (page) => page.evaluate(()=>/working it out/i.test(document.querySelector('main.panel').innerText));
const settle = (page) => page.waitForFunction(()=>!/working it out/i.test(document.querySelector('main.panel').innerText), null, {timeout:120000, polling: 50});
(async()=>{
 for (const r of process.argv.slice(2)) {
  let { browser, page } = await open(__dirname+'/'+r, st);
  const t0=Date.now(); await settle(page); console.log(r,'fresh settle ms', Date.now()-t0);
  await browser.close();
  for (const delay of [0, 100, 300]) for (const other of ['partner','bus']) {
    ({ browser, page } = await open(__dirname+'/'+r, st));
    await page.waitForTimeout(delay);
    const res = await page.evaluate((o)=>{ const p=/working it out/i.test(document.querySelector('main.panel').innerText); const s=document.querySelector('#c-obj'); s.value=o; s.dispatchEvent(new Event('change')); return {p, after:/working it out/i.test(document.querySelector('main.panel').innerText)}; }, other);
    await page.waitForTimeout(15000);
    await page.evaluate(()=>{ const s=document.querySelector('#c-obj'); s.value='person'; s.dispatchEvent(new Event('change')); });
    await page.waitForTimeout(300); await settle(page).catch(()=>{}); await page.waitForTimeout(300);
    console.log('  ', r, 'delay', delay, 'pending at switch:', JSON.stringify(res), 'via', other, '->', (await read(page)).slice(0,120));
    await browser.close();
  }
 }
})();
