const {open}=require('./lib');
async function run(label, ls, setup){
  const {browser,page,errs}=await open(1280,900,'light',ls);
  if (setup) await setup(page);
  const pre=await page.evaluate(()=>{const s=[...document.querySelectorAll('#bay summary')].find(x=>/Show the math/.test(x.textContent)); if(!s) return 'no math summary';
    s.focus(); return {focused: document.activeElement.textContent, bayText: /working it out|Working out/i.test(document.querySelector('#bay').textContent)};});
  // wait for search to finish
  let t=0; while(t<15000){ const w=await page.evaluate(()=>/working it out|Working out/i.test(document.querySelector('#bay').textContent)); if(!w) break; await page.waitForTimeout(250); t+=250; }
  await page.waitForTimeout(800);
  const post=await page.evaluate(()=>{const a=document.activeElement; return a===document.body?'BODY (focus lost)':(a.tagName+' '+(a.id||'')+' '+a.textContent.slice(0,30))});
  console.log(label,'pre',JSON.stringify(pre),'waited',t,'ms post',post,'errs',errs.length);
  await browser.close();
}
(async()=>{
  await run('throw-inf-real',{inf:true,mode:'real',action:'throw',obj:'car'}, async(p)=>{ /* load already on throw */ });
  await run('catch-fastball-car',{group:'duo',action:'catch',duoAction:'catch',cObj:'car',cStyle:'hard'}, async(p)=>{});
  await run('throw-default-control',{action:'throw'}, async(p)=>{});
})();
