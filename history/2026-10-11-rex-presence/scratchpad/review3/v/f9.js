const {open}=require('./lib');
(async()=>{
  for (const w of [360,390,768,1280]) {
    const {browser,page}=await open(w,900);
    await page.click('#grp-solo'); await page.click('#tab-walk'); await page.waitForTimeout(1500);
    const r=await page.evaluate(()=>{
      const svg=[...document.querySelectorAll('#bay svg')].find(s=>/Ground shaking/.test(s.getAttribute('aria-label')||''));
      if(!svg) return 'no chart';
      const texts=[...svg.querySelectorAll('text')].map(t=>{const b=t.getBoundingClientRect(); return {t:t.textContent,l:b.left,r:b.right,tp:b.top,bt:b.bottom};});
      const xl=texts.filter(t=>/^(1|10|100) ?k?m$/.test(t.t)).sort((a,b)=>a.l-b.l);
      const gaps=[]; for(let i=1;i<xl.length;i++) gaps.push(xl[i-1].t+'→'+xl[i].t+':'+(xl[i].l-xl[i-1].r).toFixed(1));
      const ov=[]; for(let i=0;i<texts.length;i++) for(let j=i+1;j<texts.length;j++){const a=texts[i],b=texts[j]; const ox=Math.min(a.r,b.r)-Math.max(a.l,b.l), oy=Math.min(a.bt,b.bt)-Math.max(a.tp,b.tp); if(ox>0.5&&oy>0.5) ov.push(a.t+' X '+b.t+' ('+ox.toFixed(1)+'x'+oy.toFixed(1)+')');}
      const sb=svg.getBoundingClientRect();
      return {svgW:Math.round(sb.width), xLabels: xl.map(x=>x.t), gaps, overlaps: ov};
    });
    console.log(w, JSON.stringify(r));
    const svgEl = await page.$('#bay svg[aria-label^="Ground shaking"]');
    if (svgEl) { await svgEl.scrollIntoViewIfNeeded(); await svgEl.screenshot({path:`f9-walk-${w}.png`}); }
    await browser.close();
  }
})();
