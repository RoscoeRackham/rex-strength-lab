const {open,run,chromium}=require('./page.js');
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const url=await open('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html');
  for (const [st,eff] of [[{cStyle:'hard',logKg:6,surface:'concrete'},null],[{cStyle:'hard',logKg:6,surface:'concrete'},'allout'],[{cStyle:'easy',cLogD:3,logKg:7,surface:'concrete'},'allout'],[{cStyle:'hard',logKg:8,surface:'concrete',cLogD:2},'allout']]) {
    const r=await run(browser,url,Object.assign({duoOpen:true,duoAction:'catch',cObj:'partner',cLogD:1},st),eff);
    console.log('=== ',JSON.stringify(st),eff||'least', r.errs.length?'ERRS '+r.errs.join('|'):''); console.log(r.text);
  }
  await browser.close();
})();
