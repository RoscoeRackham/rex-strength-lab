const { open } = require('./pw.js');
(async()=>{
 const r='rhead';
 const { browser, page, errs } = await open(__dirname+'/'+r, null);
 await page.waitForTimeout(1500);
 for (const tab of ['throw','pull']) {
  await page.click('#grp-solo'); await page.click('#tab-'+tab); await page.waitForTimeout(800);
  const res = await page.evaluate(()=>{
    const closed=[...document.querySelectorAll('main.panel details')].filter(d=>!d.open);
    const info=closed.map(d=>(d.className||d.id||'?')+':'+(d.querySelector('summary')||{}).textContent?.slice(0,40));
    // inject NaN into each closed details body (not summary)
    closed.forEach(d=>{ const s=document.createElement('span'); s.textContent=' NaN '; d.appendChild(s); });
    const t=document.body.innerText;
    return {closed:info, nanInInnerText:(t.match(/NaN/g)||[]).length, nanInTextContent:(document.querySelector('main.panel').textContent.match(/NaN/g)||[]).length};
  });
  console.log(tab, JSON.stringify(res));
 }
 await browser.close();
})();
