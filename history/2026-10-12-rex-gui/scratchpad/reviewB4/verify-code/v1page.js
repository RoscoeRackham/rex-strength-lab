const {open,run,chromium}=require('./page.js');
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const url=await open('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html');
  for (const [style,eff] of [['easy',null],['easy','allout'],['hard',null],['hard','allout']]) {
    const r=await run(browser,url,{duoOpen:true,duoAction:'catch',cObj:'partner',cLogD:3,cStyle:style,surface:'sand',logKg:7},eff);
    const lines=r.text.split('\n').filter(l=>/Courtesy|ceiling|shakes|Effort:|tosses|plaster|ground/i.test(l));
    console.log('=== ',style,eff||'least', r.errs.length?'ERRS '+r.errs.join('|'):''); console.log(lines.join('\n'));
  }
  await browser.close();
})();
