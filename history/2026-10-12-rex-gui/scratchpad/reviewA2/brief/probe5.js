const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
const settle=async(p,id)=>{for(let i=0;i<120;i++){const busy=await p.evaluate(id=>/working it out|Working out/i.test(document.getElementById(id).textContent),id); if(!busy) return; await p.waitForTimeout(250);} };
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file://'+path.resolve('branch.html'));
  for (const gh of [false,true]) {
    await p.evaluate(s=>localStorage.setItem('rex-lab-v1',JSON.stringify(s)),{duoOpen:true,duoAction:'wrestle',wrestleMove:'push',anchor:'bolted',oAnchor:'bolted',logKg:9,groundHolds:gh});
    await p.reload(); await p.waitForTimeout(1000); await settle(p,'duo-bay');
    console.log('comicGround',gh, await p.evaluate(()=>[document.querySelector('#duo-bay .verdict').textContent.slice(0,250), Array.from(document.querySelectorAll('#duo-bay .status-row')).map(n=>n.textContent).join(' / ')]));
  }
  await b.close();
})();
