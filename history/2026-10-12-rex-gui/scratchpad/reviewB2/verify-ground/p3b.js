const {open,settle,text,chromium}=require('./page.js');
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const pg=await open(browser,{duoOpen:true,duoAction:'catch',cObj:'baseball',cLogD:1,cStyle:'hard',logKg:10,oLogKg:10});
  await pg.selectOption('#duo-effort','allout'); await settle(pg);
  await pg.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true)); await pg.waitForTimeout(1500); await settle(pg);
  const t=await pg.evaluate(()=>document.body.innerText);
  const m=t.split('\n').filter(l=>/real physics says|feet hand the ground/.test(l));
  console.log(m.map(l=>l.slice(0,400)).join('\n')||'(not found)');
  await browser.close();
})();
