const { open } = require('./pw.js');
const states = [
 {group:'duo', duoAction:'catch', cObj:'car', inf:true, mode:'comic', cLogD:3, cStyle:'hard'},
 {group:'duo', duoAction:'catch', cObj:'car', inf:false, logKg:12, mode:'comic', cLogD:3, cStyle:'hard'},
];
(async()=>{
 for (const r of process.argv.slice(2)) for (const st of states) {
  const { browser, page, errs } = await open(__dirname+'/'+r, st);
  await page.waitForTimeout(1500);
  await page.waitForFunction(()=>!/working it out/i.test(document.querySelector('main.panel').innerText), null, {timeout:120000}).catch(()=>console.log('timeout'));
  await page.waitForTimeout(500);
  const t = await page.evaluate(()=>document.querySelector('.effort-read').innerText);
  const body = await page.evaluate(()=>document.querySelector('main.panel').innerText);
  console.log('==', r, JSON.stringify(st), '\n', t.replace(/\n+/g,' / '), '\n  plasma?', /plasma/.test(body), 'windows shatter:', (body.match(/Windows shatter[^\n]*/)||[''])[0]);
  await browser.close();
 }
})();
