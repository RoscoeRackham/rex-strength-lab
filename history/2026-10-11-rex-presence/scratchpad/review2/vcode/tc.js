const { open } = require('./pw.js');
(async()=>{
 const { browser, page, errs } = await open(__dirname+'/rhead', null);
 await page.waitForTimeout(2000);
 const SOLO = ['walk','lift','throw','jump','stomp','punch','clap','sprint','pull','weight'], DUO = ['arm','wrestle','catch','collide'];
 const bad = [];
 for (const tab of SOLO.concat(DUO)) {
   await page.click(DUO.includes(tab) ? '#grp-duo' : '#grp-solo'); await page.click('#tab-'+tab); await page.waitForTimeout(DUO.includes(tab)?1500:800);
   const m = await page.evaluate(()=>{ const c=document.body.cloneNode(true); c.querySelectorAll('script,style').forEach(n=>n.remove()); const t=c.textContent; return (t.match(/.{0,40}(NaN|undefined|(?<![∞\w])Infinity).{0,20}/g)||[]); });
   if (m.length) bad.push(tab+': '+m.slice(0,3).join(' || '));
 }
 console.log('textContent broken-text hits:', bad.length ? bad : 'none');
 await browser.close();
})();
