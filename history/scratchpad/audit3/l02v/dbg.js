const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir=__dirname;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const file of ['page.html','page-fixed.html']) {
  const ctx=await b.newContext({viewport:{width:768,height:900},colorScheme:'light'});
  const p=await ctx.newPage();
  await p.goto('file://'+dir+'/'+file); await p.waitForTimeout(5000);
  const r=await p.evaluate(()=>{
    const svg=document.querySelector('#ladder-viz svg');
    const texts=[...svg.querySelectorAll('g.mk text')].map(t=>{const bb=t.getBBox();return {t:t.textContent,k:t.parentNode.dataset.key,x:bb.x,y:bb.y,width:bb.width,height:bb.height};});
    const out=[];
    for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const A=texts[i],B=texts[j]; if(A.x<B.x+B.width-0.5&&B.x<A.x+A.width-0.5&&A.y<B.y+B.height-2&&B.y<A.y+A.height-2) out.push([A.k,A.t,A.y.toFixed(1),A.height.toFixed(1),B.k,B.t,B.y.toFixed(1),B.height.toFixed(1)]);}
    const g=[...svg.querySelectorAll('g.mk')].filter(g=>/secretwars|allstar|earth|hulk/.test(g.dataset.key)&&g.dataset.key.startsWith('L')).map(g=>[g.dataset.key,[...g.querySelectorAll('text')].map(t=>t.getAttribute('y')+':'+t.textContent).join(' / ')]);
    return {out,g};
  });
  console.log(file, JSON.stringify(r,null,0));
  await ctx.close(); }
  await b.close();
})();
