const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const here=__dirname;
(async()=>{
  const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  // F10: long tasks on load at 1280 and at 390 with 4x CPU throttle
  for (const [w,thr] of [[1280,1],[390,4]]) {
    const ctx=await br.newContext({viewport:{width:w,height:900}});
    await ctx.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
    const p=await ctx.newPage();
    if (thr>1){const s=await ctx.newCDPSession(p); await s.send('Emulation.setCPUThrottlingRate',{rate:thr});}
    await p.addInitScript(()=>{window.__lt=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lt.push([Math.round(e.startTime),Math.round(e.duration)]))).observe({type:'longtask',buffered:true});});
    const t0=Date.now();
    await p.goto('file://'+here+'/page.html');
    const load=Date.now()-t0;
    await p.waitForFunction(()=>document.querySelectorAll('#results tr').length>5 && /measures|reach|fails/.test(document.getElementById('targetStatus').textContent) && /pass|fail/i.test(document.getElementById('validation').textContent),null,{timeout:300000});
    const done=Date.now()-t0;
    const r=await p.evaluate(()=>({fcp:Math.round((performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime),lt:window.__lt.filter(x=>x[1]>200)}));
    console.log('F10 width',w,'cpu x'+thr,'load',load,'ms; tool runs done',done,'ms; FCP',r.fcp,'; long tasks >200ms [start,dur]',JSON.stringify(r.lt));
    if (w===1280) {
      // F12
      const res=await p.evaluate(()=>{const ds=[...document.querySelectorAll('details')];const closed=ds.filter(d=>!d.open);const before=document.body.innerText.length;
        // inject a NaN into closed details to see if the audit regex would see it
        const probe=document.createElement('span');probe.textContent=' NaN-probe NaN ';const tgt=closed.find(d=>d.querySelector(':scope > :not(summary)'));tgt.querySelector(':scope > :not(summary)').appendChild(probe);
        const seenClosed=/\bNaN\b/.test(document.body.innerText);
        closed.forEach(d=>d.open=true);const after=document.body.innerText.length;const seenOpen=/\bNaN\b/.test(document.body.innerText);
        return {details:ds.length,closed:closed.length,summaries:closed.map(d=>d.querySelector('summary').textContent.trim().slice(0,30)),before,after,seenClosed,seenOpen};});
      console.log('F12',JSON.stringify(res));
    }
    await ctx.close();
  }
  await br.close();
})();
