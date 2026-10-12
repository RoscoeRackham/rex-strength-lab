const {open}=require('./lib');
(async()=>{
  const {browser,page}=await open({wait:2500});
  await page.click('#tab-jump'); await page.waitForTimeout(3000);
  await page.evaluate(()=>{document.querySelectorAll('#bay details').forEach(d=>d.open=true)});
  const t=await page.evaluate(()=>document.querySelector('#bay').innerText);
  console.log(t.split('\n').filter(x=>/within|ceiling|Effort|People and buildings/.test(x)).join('\n'));
  await page.click('#tab-stomp'); await page.waitForTimeout(3000);
  await page.evaluate(()=>{document.querySelectorAll('#bay details').forEach(d=>d.open=true)});
  const t2=await page.evaluate(()=>document.querySelector('#bay').innerText);
  console.log('--stomp\n'+t2.split('\n').filter(x=>/within|ceiling|Effort|People and/.test(x)).join('\n'));
  await browser.close();
})();
