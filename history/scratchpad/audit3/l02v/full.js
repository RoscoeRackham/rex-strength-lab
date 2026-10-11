const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir=__dirname;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const ctx=await b.newContext({viewport:{width:1280,height:900},colorScheme:'light',deviceScaleFactor:1});
  const p=await ctx.newPage();
  await p.goto('file://'+dir+'/page.html');
  await p.waitForTimeout(5000);
  const bb=await p.evaluate(()=>{const r=document.querySelector('#ladder-viz svg').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};});
  await p.screenshot({path:`${dir}/ladder-1280-top.png`, fullPage:true, clip:{x:bb.x+bb.width*0.15,y:bb.y+230,width:bb.width*0.7,height:200}});
  await p.screenshot({path:`${dir}/ladder-1280-bottom.png`, fullPage:true, clip:{x:bb.x+bb.width*0.15,y:bb.y+780,width:bb.width*0.7,height:200}});
  await b.close();
})();
