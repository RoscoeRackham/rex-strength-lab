const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir=__dirname;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const file of ['page.html','page-fixed.html']) for (const w of [320,390,768,1280]) for (const inf of [false,true]) {
    const ctx=await b.newContext({viewport:{width:w,height:900},colorScheme:'light',deviceScaleFactor:2});
    const p=await ctx.newPage();
    await p.addInitScript((inf)=>{ try{ if(!sessionStorage.getItem('x')){ if(inf) localStorage.setItem('rex-lab-v1', JSON.stringify({inf:true})); sessionStorage.setItem('x','1'); } }catch(e){} }, inf);
    await p.goto('file://'+dir+'/'+file);
    await p.waitForTimeout(5000);
    const r=await p.evaluate(()=>{
      const svg=document.querySelector('#ladder-viz svg'); const vbw=svg.viewBox.baseVal.width;
      const top=[...svg.querySelectorAll(':scope > text')].find(t=>t.textContent.includes('kg lift')).getBBox();
      const rule=[...svg.querySelectorAll(':scope > line')].find(l=>l.getAttribute('stroke')==='var(--ink)');
      const ry=+rule.getAttribute('y1');
      const arrow=[...svg.querySelectorAll(':scope > path')].find(pp=>pp.getAttribute('fill')==='var(--ink)').getBBox();
      const hit=(a,b2)=>a.x<b2.x+b2.width&&b2.x<a.x+a.width&&a.y<b2.y+b2.height&&b2.y<a.y+a.height;
      const ruleBox={x:+rule.getAttribute('x1'),y:ry-1.25,width:44,height:2.5};
      // all label text boxes
      const texts=[...svg.querySelectorAll('g.mk text')].map(t=>{const bb=t.getBBox();return {t:t.textContent,x:bb.x,y:bb.y,width:bb.width,height:bb.height};});
      let lblOverlap=0; for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const A=texts[i],B=texts[j]; if(A.x<B.x+B.width-0.5&&B.x<A.x+A.width-0.5&&A.y<B.y+B.height-2&&B.y<A.y+A.height-2) lblOverlap++;}
      const clipped=texts.filter(t=>t.x<0||t.x+t.width>vbw).length;
      const ruleHitsLabel=texts.some(t=>hit(ruleBox,t))||hit(ruleBox,top)||hit(arrow,top);
      const L=[...svg.querySelectorAll('g.mk')].filter(g=>g.dataset.key.startsWith('L:')).map(g=>Math.round(+g.querySelector('text').getAttribute('y')-+g.querySelector('circle').getAttribute('cy')));
      return {ruleY:ry, titleBox:[+top.y.toFixed(1),+(top.y+top.height).toFixed(1)], ruleOrArrowHitsText:ruleHitsLabel, lblOverlap, clipped, leftDy:L.join(',')};
    });
    console.log(file.padEnd(16),w,inf?'inf ':'def ',JSON.stringify(r));
    if(file==='page-fixed.html'&&inf&&(w===390||w===1280)){
      const bb=await p.evaluate(()=>{const r=document.querySelector('#ladder-viz svg').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width};});
      await p.screenshot({path:`${dir}/fixed-inf-${w}.png`, fullPage:true, clip:{x:bb.x+bb.width/2-70,y:bb.y-2,width:140,height:70}});
    }
    await ctx.close();
  }
  await b.close();
})();
