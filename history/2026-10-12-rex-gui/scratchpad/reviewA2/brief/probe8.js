const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
const settle=async(p,id)=>{for(let i=0;i<120;i++){const busy=await p.evaluate(id=>/working it out|Working out/i.test(document.getElementById(id).textContent),id); if(!busy) return; await p.waitForTimeout(250);} };
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file://'+path.resolve('branch.html'));
  for (const st of [{anchor:'bolted',action:'sprint',duoAction:'wrestle'},{oAnchor:'bolted',action:'sprint',duoAction:'collide',colWho:'ollie',colSrc:'sprint'},{oAnchor:'friction',action:'sprint',duoAction:'collide',colWho:'ollie',colSrc:'sprint'}]) {
    await p.evaluate(s=>localStorage.setItem('rex-lab-v1',JSON.stringify(s)),Object.assign({duoOpen:true},st));
    await p.reload(); await p.waitForTimeout(1200); await settle(p,'duo-bay'); await settle(p,'bay');
    const r=await p.evaluate(()=>({rex:document.querySelector('#bay .verdict').textContent, rexHappens:(document.querySelector('#bay .happens')||{}).textContent, duo:document.querySelector('#duo-bay .verdict').textContent, duoHappens:Array.from(document.querySelectorAll('#duo-bay .happens li')).map(n=>n.textContent).filter(t=>/bolt|walk|step|sprint|charge/i.test(t))}));
    console.log(JSON.stringify(st)); console.log(JSON.stringify(r,null,1));
  }
  await b.close();
})();
