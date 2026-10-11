const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir=__dirname;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const [scheme,w] of [['light',390],['light',1280],['dark',390]]) {
    const ctx=await b.newContext({viewport:{width:w,height:900},colorScheme:scheme,deviceScaleFactor:1});
    const p=await ctx.newPage();
    await p.goto('file://'+dir+'/page.html');
    await p.waitForTimeout(5000);
    const r=await p.evaluate(()=>{
      // effective background behind ladder
      let n=document.querySelector('#ladder-viz'), bg='';
      while(n){ const c=getComputedStyle(n).backgroundColor; if(c && c!=='rgba(0, 0, 0, 0)'){bg=c+' on '+(n.id||n.tagName+'.'+n.className);break;} n=n.parentElement; }
      const svg=document.querySelector('#ladder-viz svg');
      const items=[...svg.querySelectorAll('g.mk')].map(g=>{
        const c=g.querySelector('circle'); const t=g.querySelectorAll('text');
        const path=g.querySelector('path');
        return {key:g.dataset.key, label:[...t].map(x=>x.textContent).join(' | '), dotY:+c.getAttribute('cy'), labelY:+t[0].getAttribute('y'), dy:+t[0].getAttribute('y') - +c.getAttribute('cy'), stroke:getComputedStyle(path).stroke, so:path.getAttribute('stroke-opacity')};
      });
      return {bg, items};
    });
    console.log('==',scheme,w,'bg:',r.bg);
    const L=r.items.filter(i=>i.key.startsWith('L:')).sort((a,b)=>a.dotY-b.dotY);
    for (const i of r.items) console.log(i.key.padEnd(22), String(i.dotY).padStart(5), 'label dy', String(Math.round(i.dy)).padStart(4), i.label.slice(0,70));
    for (let k=1;k<L.length;k++) if (L[k].dotY-L[k-1].dotY<12) console.log('  OVERLAP dots', L[k-1].key, L[k].key, (L[k].dotY-L[k-1].dotY).toFixed(1),'px apart (r=5 + 2px ring)');
    console.log(' leader stroke', r.items[0].stroke, 'opacity', r.items[0].so);
    await ctx.close();
  }
  await b.close();
})();
