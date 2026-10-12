const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const w of [360,390,768,1280]){
    const page=await browser.newPage({viewport:{width:w,height:900}});
    await page.addInitScript(()=>{ localStorage.setItem('rex-lab-v1',JSON.stringify({action:'walk'})); });
    await page.goto(URL); await page.waitForTimeout(2500);
    const r=await page.evaluate(()=>{
      const svg=[...document.querySelectorAll('#bay svg')].find(s=>/Ground shaking/.test(s.getAttribute('aria-label')||''));
      if(!svg) return 'nosvg';
      const lines=[...svg.querySelectorAll('line[stroke-dasharray="5 4"]')].map((l,i)=>({i,y:+l.getAttribute('y1'),x1:+l.getAttribute('x1'),x2:+l.getAttribute('x2')}));
      const texts=[...svg.querySelectorAll('text.halo')].filter(t=>t.textContent!=='listener').map(t=>{const b=t.getBBox();return {t:t.textContent,y:+t.getAttribute('y'),bx:b.x,by:b.y,bw:b.width,bh:b.height}});
      const out=[];
      texts.forEach((t,ti)=>{ lines.forEach(l=>{ if(l.y>t.by+1 && l.y<t.by+t.bh-1 && l.x2>t.bx) out.push(`"${t.t}" (own line #${ti} y=${lines[ti]&&lines[ti].y.toFixed(1)}) crossed by line #${l.i} y=${l.y.toFixed(1)} [label box ${t.by.toFixed(1)}-${(t.by+t.bh).toFixed(1)}]`); }); });
      return {lines:lines.map(l=>l.y.toFixed(1)).join(','),labels:texts.map(t=>t.t+'@'+t.y.toFixed(1)).join(' | '),cross:out};
    });
    console.log(w,JSON.stringify(r,null,1));
    const svgEl=await page.$('#bay .viz svg'); if(svgEl) await svgEl.screenshot({path:__dirname+'/walk-'+w+'.png'});
    await page.close();
  }
  await browser.close();
})();
