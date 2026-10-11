const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir=__dirname;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const scheme of ['light','dark']) for (const w of [320,390,768,1280]) {
    const ctx=await b.newContext({viewport:{width:w,height:900},colorScheme:scheme,deviceScaleFactor:3});
    const p=await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.addInitScript(()=>{ try{ if(!sessionStorage.getItem('x')){ localStorage.setItem('rex-lab-v1', JSON.stringify({inf:true})); sessionStorage.setItem('x','1'); } }catch(e){} });
    await p.goto('file://'+dir+'/page.html');
    await p.waitForTimeout(5000);
    const r=await p.evaluate(()=>{
      const svg=document.querySelector('#ladder-viz svg');
      const vb=svg.viewBox.baseVal; const sr=svg.getBoundingClientRect(); const sc=sr.width/vb.width;
      const top=[...svg.querySelectorAll(':scope > text')].find(t=>t.textContent.includes('kg lift'));
      const tb=top.getBBox();
      const rule=[...svg.querySelectorAll(':scope > line')].find(l=>l.getAttribute('stroke')==='var(--ink)');
      const arrow=[...svg.querySelectorAll(':scope > path')].find(pp=>pp.getAttribute('fill')==='var(--ink)');
      const ab=arrow.getBBox();
      const st=JSON.parse(localStorage.getItem('rex-lab-v1')||'{}');
      const ts=getComputedStyle(top);
      return {inf:st.inf, W:vb.width, scale:sc, text:{x:tb.x,y:tb.y,w:tb.width,h:tb.height,x2:tb.x+tb.width,y2:tb.y+tb.height,fs:ts.fontSize,fill:ts.fill},
        rule:{x1:+rule.getAttribute('x1'),x2:+rule.getAttribute('x2'),y:+rule.getAttribute('y1'),sw:rule.getAttribute('stroke-width')},
        arrow:{x:ab.x,y:ab.y,x2:ab.x+ab.width,y2:ab.y+ab.height},
        order:{ruleIdx:[...svg.children].indexOf(rule),arrowIdx:[...svg.children].indexOf(arrow),textIdx:[...svg.children].indexOf(top)},
        dialTxt:(document.querySelector('.dial-read')||{}).textContent};
    });
    console.log(scheme,w,JSON.stringify(r),errs.length?errs:'');
    const bb=await p.evaluate(()=>{const r=document.querySelector('#ladder-viz svg').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width};});
    const cx=bb.x+bb.width/2;
    await p.screenshot({path:`${dir}/inf-${scheme}-${w}.png`, fullPage:true, clip:{x:cx-70,y:bb.y-2,width:140,height:40}});
    await ctx.close();
  }
  await b.close();
})();
