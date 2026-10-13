const {open,settle,text,chromium}=require('./page.js');
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const pg=await open(browser,{duoOpen:true,duoAction:'catch',cObj:'baseball',cLogD:1,cStyle:'hard',logKg:10,oLogKg:10});
  const opts=await pg.evaluate(()=>{const s=document.querySelector('#duo-effort'); return s?[...s.options].map(o=>o.value):null;});
  console.log('duo options',opts);
  await pg.selectOption('#duo-effort','allout'); await settle(pg);
  await pg.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true)); await pg.waitForTimeout(800); const t=await pg.evaluate(()=>[...document.querySelectorAll('li,p,div')].filter(e=>e.children.length===0||e.tagName==='LI').map(e=>e.textContent).join('\n'));
  const i=t.indexOf('Catch'); console.log(t.split('\n').filter(l=>/as real physics says|feet hand the ground/i.test(l)).map(l=>l.slice(0,300)).slice(0,40).join('\n'));
  console.log('ERRORS',pg.errs);
  await browser.close();
})();
