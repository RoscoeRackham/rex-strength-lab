const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cases = JSON.parse(process.argv[2]);
const fonts = process.env.FONTS==='1';
(async () => {
  const opts={ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' };
  if (fonts && process.env.HTTPS_PROXY) opts.proxy={server:process.env.HTTPS_PROXY};
  const b = await chromium.launch(opts);
  for (const [w, name, st] of cases) {
    const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:w,height:900}, deviceScaleFactor:1 });
    await ctx.addInitScript((s)=>{try{localStorage.setItem('rex-lab-v1',JSON.stringify(s))}catch(e){}}, st);
    const page = await ctx.newPage();
    await page.goto('file://'+__dirname+'/prev.html');
    await page.waitForTimeout(5000);
    const r = await page.evaluate(() => {
      const fontOk = [...document.fonts].filter(f=>f.status==="loaded").map(f=>f.family+" "+f.weight).join(",") || "none";
      return {fontOk, tiles:[...document.querySelectorAll('#bay .tile')].map(t => {
        const v=t.querySelector('.v');
        // find line boxes via Range rects
        const rng=document.createRange(); rng.selectNodeContents(v);
        const rects=[...rng.getClientRects()];
        // reconstruct line text by char positions
        const tw=document.createTreeWalker(v,NodeFilter.SHOW_TEXT); let lines=[]; let lastTop=null; let cur='';
        let n; while((n=tw.nextNode())){ for(let i=0;i<n.length;i++){ const r=document.createRange(); r.setStart(n,i); r.setEnd(n,i+1); const rc=r.getClientRects()[0]; if(!rc) {cur+=n.data[i]; continue;} if(lastTop!==null && Math.abs(rc.top-lastTop)>3){lines.push(cur); cur='';} lastTop=rc.top; cur+=n.data[i]; } }
        lines.push(cur);
        return {k:t.querySelector('.k').textContent, lines, w:Math.round(t.getBoundingClientRect().width)};
      })};
    });
    console.log(w, name, 'fontLoaded='+r.fontOk);
    for (const t of r.tiles) console.log('   ', t.k, '['+t.w+'px]', JSON.stringify(t.lines));
    await page.locator('#bay .tiles').first().screenshot({ path: `${__dirname}/${fonts?'f-':''}${w}-${name}.png` });
    await ctx.close();
  }
  await b.close();
})();
