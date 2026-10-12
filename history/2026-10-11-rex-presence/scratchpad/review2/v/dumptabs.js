const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file://'+__dirname+'/preview.html'); await p.waitForTimeout(3000);
  const tabs=(process.argv[2]||'walk,stomp,punch,weight').split(',');
  const DUO=['arm','wrestle','catch','collide'];
  for(const t of tabs){
    await p.click(DUO.includes(t)?'#grp-duo':'#grp-solo'); await p.click('#tab-'+t);
    await p.waitForTimeout(2500);
    // open all details
    await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
    await p.waitForTimeout(300);
    const txt=await p.evaluate(()=>document.querySelector('main.panel').innerText);
    fs.writeFileSync(__dirname+'/tab-'+t+'.txt',txt);
    console.log(t, txt.length);
  }
  const all=await p.evaluate(()=>document.body.innerText); fs.writeFileSync(__dirname+'/body.txt',all);
  await b.close();
})();
