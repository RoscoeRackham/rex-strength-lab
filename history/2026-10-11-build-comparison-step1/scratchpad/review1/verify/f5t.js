const fs=require('fs');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const here=__dirname, B='/home/user/rex-strength-lab/build-comparison/';
const BC=require('/home/user/rex-strength-lab/build-calculator/src/calc.js'), calc=BC.create(require('/home/user/rex-strength-lab/build-calculator/data/builds.json'));
const T=require(B+'data/outline.json');
const r0=calc.compute({buildId:'ansur2_m_p50',heightM:1.8}); const g={}; BC.SITES.forEach(s=>g[s]=r0.girths[s].value);
(async()=>{
  const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  await ctx.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
  const p=await ctx.newPage(); const cdp=await ctx.newCDPSession(p);
  await p.goto('file://'+here+'/page.html');
  await p.waitForFunction(()=>document.querySelectorAll('#results tr').length>5 && /measures|reach|fails/.test(document.getElementById('targetStatus').textContent),null,{timeout:180000});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4}); for (const px of [2000]) {
    const out=await p.evaluate(([T,g,px])=>{
      const F=window.Figure,M=window.Measure,BC=window.BuildCalc;
      const f=F.human(T,1.8,g,{},{buttockFit:BC.FRUSTUM.M.buttock,armDeg:35}); const y=f.dims.levels;
      const img=F.renderSheet({front:f.front,side:f.side},1.8,{shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee},{figurePx:px});
      const sk=F.sheetSkullRows(img,1.8);
      const t0=performance.now();
      // the page's measure() call: no seg options, so refine = 2
      const r=M.measureSheet(img,{heightM:1.8,heightRef:'skull',skullRows:sk,order:['front','side','back'],density:1060,bodyFatPct:7.5,armK:1});
      const t1=performance.now();
      const r2=M.measureSheet(img,{heightM:1.8,heightRef:'skull',skullRows:sk,order:['front','side','back'],density:1060,bodyFatPct:7.5,armK:1,seg:{refine:0}});
      const t2=performance.now();
      return {px,size:img.width+'x'+img.height,ms_page:Math.round(t1-t0),score:r.score.value.toFixed(2),ms_norefine:Math.round(t2-t1),score_norefine:r2.score.value.toFixed(2)};
    },[T,g,px]);
    console.log(JSON.stringify(out));
  }
  await br.close();
})();
