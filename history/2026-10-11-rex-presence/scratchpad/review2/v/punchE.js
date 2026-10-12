const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file://'+__dirname+'/preview.html'); await p.waitForTimeout(2000);
  // find logKg giving punch E ~1e19 J at all-out
  const res=await p.evaluate(()=>{const P=window.DinoPhys, D=window.DINO_DATA; const body=P.makeBody({H:P.DEFAULT_BODIES.rex.H,m:P.DEFAULT_BODIES.rex.m,build:'rex'});
    const surface=D.surfaces.find(s=>s.id==='concrete'); const out=[];
    for(let lk=20; lk<=30; lk+=0.5){ const r=P.punch({F:Math.pow(10,lk)*9.80665, mode:'comic', body, surface, groundHolds:false, anchor:'friction'}); out.push([lk, r.E]); }
    return out;});
  console.log(JSON.stringify(res));
  await b.close();
})();
